import { defineConfig } from 'orval'

const openApiUrl = process.env.OPENAPI_URL ?? 'http://localhost:8080/v3/api-docs'

export default defineConfig({
  api: {
    input: {
      target: openApiUrl,
    },
    output: {
      mode: 'tags-split',
      target: './src/api/generated',
      schemas: './src/api/model',
      client: 'react-query',
      httpClient: 'fetch',
      clean: true,
      override: {
        mutator: {
          path: './src/api/httpClient.ts',
          name: 'apiClient',
        },
        query: {
          signal: true,
        },
        fetch: {
          includeHttpResponseReturnType: false,
        },
      },
    },
  },
})
