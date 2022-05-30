yarn gqlg --schemaFilePath src/schema.gql --destDirPath tempgql
yarn graphql-codegen --config codegen.yml
yarn prettier --write src/schema-nodes.ts
rm -rf tempgql
