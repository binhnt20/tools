export enum ShopifyNamespaceMetafield {
  BLOCKIFY_APP = 'BLOCKIFY',
}

export enum ShopifyKeyMetafield {
  IS_ACTIVE = 'is_active',
  TEST = 'test',
  BLOCKING_TEMPLATE_FILE = 'blocking_template_file',
  BLOCKIFY_BLOCK_CHECKOUT = 'blockify_block_checkout',
  HIDE_PAYMENT_RULE = 'blockify_hide_payment_rule',
  HIDE_PAYMENT_RULE_VARIABLES = 'blockify_hide_payment_variables',
  HIDE_SHIPPING_RULE = 'blockify_hide_shipping_rule',
  HIDE_SHIPPING_RULE_VARIABLES = 'blockify_hide_shipping_variables',
}

export enum ShopifyPlan {
  PARTNER_TEST = 'partner_test',
  SHOPIFY_PLUS = 'shopify_plus',
}

export enum PrivateMetafieldValueType {
  INTEGER = 'INTEGER',
  JSON_STRING = 'JSON_STRING',
  STRING = 'STRING',
}

export enum ScopeGroups {
  PROCESS_ORDERS = 'update_scope',
  VALIDATION = 'update_validation_scope',
  PAYMENT_CUSTOMIZATION = 'update_payment_scope',
  READ_CONTENT = 'update_read_content_scope',
  DELIVERY_CUSTOMIZATION = 'update_delivery_scope',
  WEB_PIXEL = 'update_webpixel_scope',
}
