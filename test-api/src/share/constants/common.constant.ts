import { TranslationKeys } from '../enums/commons.enum';

export const SETTING_ERROR = {
  USER_NOT_FOUND: { errorCode: 1001, errorMsg: TranslationKeys.USER_NOT_FOUND },
  RULE_EXISTING: { errorCode: 1002, errorMsg: TranslationKeys.RULE_EXIST },
  INVALID_IPADDRESS_FORMAT: { errorCode: 1005, errorMsg: TranslationKeys.IP_INVALID },
  INVALID_URL_FORMAT: { errorCode: 1006, errorMsg: TranslationKeys.URL_FORMAT_INVALID },
  INVALID_REFER_URL_FORMAT: { errorCode: 1007, errorMsg: TranslationKeys.REFER_URL_INVALID },
  INVALID_ISP: { errorCode: 1008, errorMsg: TranslationKeys.ISP_INVALID },
  ISP_NOT_FOUND: { errorCode: 1009, errorMsg: TranslationKeys.ISP_NOT_FOUND },
  EXCEEDED_RULE_LIMIT: {
    errorCode: 1010,
    errorMsg: TranslationKeys.RULES_LIMIT_EXCEEDED,
  },
  INVALID_RULE: {
    errorCode: 1011,
    errorMsg: TranslationKeys.INVALID_RULE_FORMAT,
  },
  INVALID_COLLECTION: {
    errorCode: 1012,
    errorMsg: TranslationKeys.INVALID_COLLECTION,
  },
  COLLECTION_NOT_FOUND: { errorCode: 1013, errorMsg: TranslationKeys.COLLECTION_NOT_FOUND },
  PRODUCT_NOT_FOUND: { errorCode: 1014, errorMsg: TranslationKeys.PRODUCT_NOT_FOUND },
  INVALID_EMAIL: { errorCode: 1015, errorMsg: TranslationKeys.EMAIL_INVALID },
  INVALID_IP_RANGE_FORMAT: { errorCode: 1016, errorMsg: TranslationKeys.IP_RANGE_FORMAT_INVALID },
  TIMEZONE_IS_REQUIRED: { errorCode: 1017, errorMsg: TranslationKeys.TIMEZONE_REQUIRED },
  PAGE_NOT_FOUND: { errorCode: 1018, errorMsg: TranslationKeys.PAGE_NOT_FOUND },
  REFER_URL_IS_REQUIRED: { errorCode: 1019, errorMsg: TranslationKeys.REFER_URL_REQUIRED },
};

export const SCOPE_REQUIRE = {
  update_scope: {
    name: 'orderScope',
    scopes: ['read_orders', 'write_orders'],
  },
  update_validation_scope: {
    name: 'validationScope',
    scopes: ['read_validations', 'write_validations'],
  },
  update_payment_scope: {
    name: 'paymentCustomizationScope',
    scopes: ['read_markets', 'read_payment_customizations', 'write_payment_customizations'],
  },
  update_read_content_scope: {
    name: 'readContentScope',
    scopes: ['read_content'],
  },
  update_delivery_scope: {
    name: 'deliveryCustomizationScope',
    scopes: ['write_delivery_customizations', 'read_shipping'],
  },
  update_webpixel_scope: {
    name: 'webPixelScope',
    scopes: ['write_pixels', 'read_customer_events'],
  },
};

export const SHOPIFY_DEVELOPMENT_PLAN = ['partner_test', 'plus_partner_sandbox', 'affiliate'];
