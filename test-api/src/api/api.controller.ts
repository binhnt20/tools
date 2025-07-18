import { Controller, Post, Body, Get, Res, BadRequestException } from '@nestjs/common';
import { ApiService } from './api.service';
import { Response } from 'express';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post('test-apis')
  async testApis(@Body() body: { url: string; runCount: number }) {
    const { url, runCount } = body;
    if (!url || !runCount || runCount <= 0) {
      throw new BadRequestException('Invalid URL or run count');
    }
    return this.apiService.testApis(url, runCount);
  }

  @Post('test-ips')
  async testIP(@Body() body: { shop: string; runCount: number; domain: string }) {
    const { shop, runCount, domain } = body;
    if (!shop || !shop?.endsWith('.myshopify.com') || !runCount || runCount <= 0) {
      throw new BadRequestException('Invalid shop or run count');
    }
    return this.apiService.testIP(shop, runCount, domain);
  }

  @Get('results/*')
  serveResults(@Res() res: Response) {
    const filePath = res.req.url.replace('/api/results', '');
    res.sendFile(filePath, { root: './api_results' });
  }
}
