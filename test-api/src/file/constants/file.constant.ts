export const SchemaUploadBodySwagger = {
  type: 'object',
  properties: {
    image: {
      type: 'string',
      format: 'binary',
    },
    shop: { type: 'string' },
  },
};
