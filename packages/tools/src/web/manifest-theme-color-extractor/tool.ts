import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://www.w3.org/TR/appmanifest/#theme-color-member
export type ManifestThemeColorExtractorInput = {
  readonly manifest: string;
};
export type ManifestThemeColorExtractorOutput = {
  readonly value: string;
  readonly found: boolean;
};
export const manifestThemeColorExtractorInputSchema = {"type":"object","additionalProperties":false,"properties":{"manifest":{"type":"string","maxLength":1000000,"description":"Web application manifest JSON."}},"required":["manifest"]} as const satisfies ToolJsonSchema;
export const manifestThemeColorExtractorOutputSchema = {"type":"object","additionalProperties":false,"properties":{"value":{"type":"string","maxLength":1000000,"description":"Raw manifest member, empty when absent."},"found":{"type":"boolean","description":"Whether a string member was present."}},"required":["value","found"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateManifestThemeColorExtractor = (input: unknown): ToolResult<ManifestThemeColorExtractorOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = manifestThemeColorExtractorInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, manifestThemeColorExtractorInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["manifest"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: ManifestThemeColorExtractorInput = {
    manifest: values.manifest as string
  };
  let manifest: unknown;
  try {manifest = JSON.parse(x.manifest);} catch (error) {if (error instanceof SyntaxError) return fail("manifest", "Provide valid JSON.", "malformed_json"); throw error;}
  if (!isRecord(manifest)) return fail("manifest", "A manifest must be a JSON object.", "object_required");
const value = manifest.theme_color;
  if (value !== undefined && typeof value !== "string") return fail("manifest", "theme_color must be a string.", "invalid_member");
  const output: ManifestThemeColorExtractorOutput = {value: typeof value === "string" ? value : "", found: typeof value === "string"};
  if (!matchesToolJsonSchema(output, manifestThemeColorExtractorOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const manifestThemeColorExtractorTool = defineTool<ManifestThemeColorExtractorInput, ManifestThemeColorExtractorOutput>({
  id: "web/manifest-theme-color-extractor", title: "ManifestThemeColorExtractor", description: "Extract the raw theme_color string from manifest JSON, reporting whether it is present without applying browser fallback behavior.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateManifestThemeColorExtractor,
  inputSchema: manifestThemeColorExtractorInputSchema, outputSchema: manifestThemeColorExtractorOutputSchema,
  ports: {inputs: [{"id":"manifest","label":"Web application manifest JSON","description":"Web application manifest JSON.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"value","label":"Raw manifest member, empty when absent","description":"Raw manifest member, empty when absent.","valueType":{"type":"string"}},{"id":"found","label":"Whether a string member was present","description":"Whether a string member was present.","valueType":{"type":"boolean"}}]},
});
export const runManifestThemeColorExtractor = manifestThemeColorExtractorTool.execute;
export const example = {"input":{"manifest":"{\"theme_color\":\"#336699\"}"},"output":{"value":"#336699","found":true}} satisfies ToolExample<ManifestThemeColorExtractorInput, ManifestThemeColorExtractorOutput>;
export default manifestThemeColorExtractorTool;
