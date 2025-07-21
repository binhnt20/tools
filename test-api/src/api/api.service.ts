import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { format } from '@fast-csv/format';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { extractIpRangeAWSToDecimal, getIPRange, getRandomIP, getRandomUserAgent, IIpRageResult, randomArray, sleep } from '../utils';

interface AmazonIP {
  ip_prefix?: string;
  ipv6_prefix?: string;
  region: string;
  service: string;
  network_border_group: string;
}

@Injectable()
@WebSocketGateway({ cors: true })
export class ApiService {
  @WebSocketServer() server: Server;

  private readonly OUTPUT_DIR = './api_results';

  constructor() {
    if (!fs.existsSync(this.OUTPUT_DIR)) {
      fs.mkdirSync(this.OUTPUT_DIR);
    }
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private sendLog(message: string) {
    this.server.emit('log', `${new Date().toLocaleTimeString()}: ${message}`);
  }

  async testApis(url: string, runCount: number) {
    const API_URL_FILTER = 'https://apps-shopify.ipblocker.io/s/api/';
    this.sendLog(`Starting test for ${url} with ${runCount} runs...`);

    const allResults = {};
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    for (let run = 1; run <= runCount; run++) {
      this.sendLog(`Starting run ${run}...`);
      const page = await browser.newPage();
      await page.setRequestInterception(true);

      const requestStartTimes = new Map();

      page.on('request', (request) => {
        requestStartTimes.set(request.url(), performance.now());
        request.continue();
      });

      page.on('response', async (response) => {
        const request = response.request();
        const apiUrl = request.url();

        // if (response.headers()["content-type"]?.includes("application/json")) {
        if (apiUrl?.includes(API_URL_FILTER)) {
          try {
            const startTime = requestStartTimes.get(apiUrl) || performance.now();
            const endTime = performance.now();
            const status = response.status();
            const method = request.method();

            let responseData = null;
            try {
              responseData = await response.json();
            } catch (e) {}

            if (!allResults[apiUrl]) {
              allResults[apiUrl] = {
                method,
                runs: [],
                statusCounts: {},
                responseTimes: [],
                responseSizes: [],
              };
            }

            const result = {
              timestamp: new Date().toISOString(),
              status,
              responseTime: endTime - startTime,
              responseSize: response.headers()['content-length'] || 'unknown',
              responseData: responseData ? JSON.stringify(responseData).slice(0, 500) : null,
            };

            allResults[apiUrl].runs.push(result);
            allResults[apiUrl].statusCounts[status] = (allResults[apiUrl].statusCounts[status] || 0) + 1;
            allResults[apiUrl].responseTimes.push(result.responseTime);
            allResults[apiUrl].responseSizes.push(result.responseSize !== 'unknown' ? parseInt(result.responseSize) : 0);

            this.sendLog(`Run ${run} - API: ${apiUrl} - Status: ${status} - Time: ${result.responseTime}ms`);

            requestStartTimes.delete(apiUrl);
          } catch (error) {
            this.sendLog(`Error processing response ${apiUrl} in run ${run}: ${error.message}`);
          }
        }
      });

      try {
        this.sendLog(`Navigating to ${url} in run ${run}...`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        await this.delay(5000);
      } catch (error) {
        this.sendLog(`Error navigating to ${url} in run ${run}: ${error.message}`);
      }

      await page.close();
    }

    await browser.close();

    const averageResults = Object.keys(allResults).map((apiUrl) => {
      const data = allResults[apiUrl];
      const responseTimes = data.responseTimes;
      const responseSizes = data.responseSizes.filter((size) => size !== 0);

      const avgResponseTime =
        responseTimes.length > 0 ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length : 0;

      const avgResponseSize =
        responseSizes.length > 0 ? responseSizes.reduce((sum, size) => sum + size, 0) / responseSizes.length : 'unknown';

      const mostCommonStatus = Object.keys(data.statusCounts).reduce((a, b) =>
        data.statusCounts[a] > data.statusCounts[b] ? a : b,
      );

      return {
        url: apiUrl,
        method: data.method,
        runCount: data.runs.length,
        averageResponseTime: avgResponseTime.toFixed(2),
        averageResponseSize: avgResponseSize !== 'unknown' ? avgResponseSize.toFixed(2) : 'unknown',
        mostCommonStatus,
        statusDistribution: data.statusCounts,
        sampleResponseData: data.runs[0]?.responseData || null,
      };
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const jsonFile = path.join(this.OUTPUT_DIR, `api_results_${timestamp}.json`);
    const csvFile = path.join(this.OUTPUT_DIR, `api_results_${timestamp}.csv`);

    fs.writeFileSync(jsonFile, JSON.stringify(averageResults, null, 2));

    const csvStream = format({ headers: true });
    const writableStream = fs.createWriteStream(csvFile);

    csvStream.pipe(writableStream);

    averageResults.forEach((result) => {
      csvStream.write({
        ...result,
        statusDistribution: JSON.stringify(result.statusDistribution),
      });
    });

    csvStream.end();

    this.sendLog('Test completed successfully!');

    return {
      results: averageResults,
      jsonFile: `/api/results/api_results_${timestamp}.json`,
      csvFile: `/api/results/api_results_${timestamp}.csv`,
    };
  }

  async getAmazonIP(rangesToGet?: number): Promise<string[]> {
    const response = await fetch('https://ip-ranges.amazonaws.com/ip-ranges.json');
    if (!response.ok) {
      throw new Error('Failed to fetch IP information');
    }
    const data: { prefixes: AmazonIP[] } = await response.json();
    const listPrefixes = data.prefixes
      ?.slice(1000, 1000 + (rangesToGet || 20))
      .map((item) => item?.ip_prefix || item?.ipv6_prefix);
    console.log('🚀 ~ getAmazonIP ~ ata.prefixes:', data.prefixes?.length);
    const crawlerIpRange: IIpRageResult[] = [];
    const ipList: string[] = [];

    if (listPrefixes?.length) {
      crawlerIpRange.push(...extractIpRangeAWSToDecimal(listPrefixes));
    }

    if (crawlerIpRange.length) {
      for (const range of crawlerIpRange) {
        const { startRange, endRange } = range;
        const ipsInRange = getIPRange(startRange, endRange);
        ipList.push(...ipsInRange);
      }
    }
    return ipList;
  }

  async testIP(shop: string, runCount: number, domain: string) {
    const accessUrl = `https://${shop}/test-ips`;
    // const amazonIPs = await this.getAmazonIP(runCount);
    // const ipsToTest = randomArray(amazonIPs, 10);

    for (let i = 0; i < 10; i++) {
      const ipAddress = getRandomIP();
      console.log('🚀 ~ testIP ~ ipAddress:', ipAddress);
      const result = await fetch(`${domain}/api/block/check-ip`, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': getRandomUserAgent(),
          'ngrok-skip-browser-warning': 'true',
        },
        method: 'POST',
        body: JSON.stringify({ ipAddress, identifierId: shop, accessUrl }),
      });
      const data = await result.json();

      // Random delay từ 1 đến 3 giây
      // const delayMs = 1000 + Math.floor(Math.random() * 1000);
      // await sleep(delayMs);
    }
    return {
      message: `Test completed for ${shop} with ${runCount} runs.`,
      totalIPsTested: 10,
      accessUrl,
    };
  }
}
