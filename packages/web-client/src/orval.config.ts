module.exports = {
  "petstore-client": {
    input: "../../shared/open-api/schema.yaml",
    output: {
      client: "swr",
      override: {
        mutator: {
          path: "libs/fetcher.ts",
          name: "customFetcher",
        },
      },
      target: "generated/endpoints.ts",
      mock: true,
    },
  },
};
