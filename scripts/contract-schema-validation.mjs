import Ajv2020 from "ajv/dist/2020.js";

const formatErrors = (errors) =>
  (errors ?? [])
    .map(
      ({ instancePath, message, schemaPath }) =>
        `${instancePath || "/"}: ${message ?? "schema validation failed"} (${schemaPath})`,
    )
    .join("\n");

export const assertContractCollectionMatchesSchema = ({
  collection,
  collectionSchema,
  toolSchema,
}) => {
  const ajv = new Ajv2020({
    allErrors: true,
    strict: true,
    strictRequired: false,
    validateFormats: false,
  });
  ajv.addSchema(toolSchema);
  const validate = ajv.compile(collectionSchema);
  if (!validate(collection))
    throw new Error(
      `Generated portable contracts do not match the public JSON Schema:\n${formatErrors(validate.errors)}`,
    );
};
