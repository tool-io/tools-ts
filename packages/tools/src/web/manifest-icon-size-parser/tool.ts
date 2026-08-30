import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://html.spec.whatwg.org/multipage/links.html#attr-link-sizes
export type ManifestIconSizeParserInput = {
  readonly sizes: string;
};
export type ManifestIconSizeParserOutput = {
  readonly sizes: readonly {readonly width:number;readonly height:number}[];
  readonly any: boolean;
};
export const manifestIconSizeParserInputSchema = {"type":"object","additionalProperties":false,"properties":{"sizes":{"type":"string","maxLength":1000000,"description":"Space-separated icon sizes or any."}},"required":["sizes"]} as const satisfies ToolJsonSchema;
export const manifestIconSizeParserOutputSchema = {"type":"object","additionalProperties":false,"properties":{"sizes":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"width":{"type":"integer","minimum":1},"height":{"type":"integer","minimum":1}},"required":["width","height"]},"minItems":0,"maxItems":100000,"description":"Declared icon dimensions in pixels."},"any":{"type":"boolean","description":"Whether scalable size any is present."}},"required":["sizes","any"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateManifestIconSizeParser = (input: unknown): ToolResult<ManifestIconSizeParserOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = manifestIconSizeParserInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, manifestIconSizeParserInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["sizes"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: ManifestIconSizeParserInput = {
    sizes: values.sizes as string
  };
  const sizes:{width:number;height:number}[] = []; let any = false;
  for(const token of x.sizes.trim().split(/[\t\n\f\r ]+/)) {
    if(!token)continue; if(token.toLowerCase() === "any") {any=true;continue;}
    const match=/^([1-9]\d*)[xX]([1-9]\d*)$/.exec(token);
    if(!match || !Number.isSafeInteger(Number(match[1])) || !Number.isSafeInteger(Number(match[2]))) return fail("sizes", "Provide positive integer icon dimensions or any.", "invalid_size");
    sizes.push({width:Number(match[1]),height:Number(match[2])});
  }
  const output: ManifestIconSizeParserOutput = {sizes,any};
  if (!matchesToolJsonSchema(output, manifestIconSizeParserOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const manifestIconSizeParserTool = defineTool<ManifestIconSizeParserInput, ManifestIconSizeParserOutput>({
  id: "web/manifest-icon-size-parser", title: "Manifest Icon Size Parser", description: "Parse an icon sizes string into positive pixel dimensions and an explicit scalable any flag.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateManifestIconSizeParser,
  inputSchema: manifestIconSizeParserInputSchema, outputSchema: manifestIconSizeParserOutputSchema,
  ports: {inputs: [{"id":"sizes","label":"Space-separated icon sizes or any","description":"Space-separated icon sizes or any.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"sizes","label":"Declared icon dimensions in pixels","description":"Declared icon dimensions in pixels.","valueType":{"type":"list","items":{"type":"object"}}},{"id":"any","label":"Whether scalable size any is present","description":"Whether scalable size any is present.","valueType":{"type":"boolean"}}]},
});
export const runManifestIconSizeParser = manifestIconSizeParserTool.execute;
export const example = {"input":{"sizes":"192x192 512x512 any"},"output":{"sizes":[{"width":192,"height":192},{"width":512,"height":512}],"any":true}} satisfies ToolExample<ManifestIconSizeParserInput, ManifestIconSizeParserOutput>;
export default manifestIconSizeParserTool;
