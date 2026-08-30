import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import {scanHtmlTokens} from "../../html/tag-counter/tool.js";
import {getHtmlAttribute} from "../../html/attribute-parser/tool.js";
import {decodeSyntaxReferences} from "../../html/text-extractor/tool.js";
// Method reference: https://www.rfc-editor.org/rfc/rfc6596.html
export type CanonicalExtractorInput = {
  readonly html: string;
};
export type CanonicalExtractorOutput = {
  readonly hrefs: readonly string[];
};
export const canonicalExtractorInputSchema = {"type":"object","additionalProperties":false,"properties":{"html":{"type":"string","maxLength":1000000,"description":"HTML source."}},"required":["html"]} as const satisfies ToolJsonSchema;
export const canonicalExtractorOutputSchema = {"type":"object","additionalProperties":false,"properties":{"hrefs":{"type":"array","items":{"type":"string","maxLength":1000000},"minItems":0,"maxItems":100000,"description":"Canonical href references in document order."}},"required":["hrefs"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateCanonicalExtractor = (input: unknown): ToolResult<CanonicalExtractorOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = canonicalExtractorInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, canonicalExtractorInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["html"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: CanonicalExtractorInput = {
    html: values.html as string
  };
  const hrefs:string[]=[];
  for(const token of scanHtmlTokens(x.html)) if(token.kind === "start" && token.name === "link" && token.tag) {
    const rel=getHtmlAttribute(token.tag,"rel") ?? "", href=getHtmlAttribute(token.tag,"href");
    if(href !== undefined && rel.toLowerCase().split(/[\t\n\f\r ]+/).includes("canonical")) hrefs.push(decodeSyntaxReferences(href));
  }
  const output: CanonicalExtractorOutput = {hrefs};
  if (!matchesToolJsonSchema(output, canonicalExtractorOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const canonicalExtractorTool = defineTool<CanonicalExtractorInput, CanonicalExtractorOutput>({
  id: "web/canonical-extractor", title: "Canonical Link Extractor", description: "Extract canonical-link href values from HTML source, preserving source order and resolving no URLs implicitly.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateCanonicalExtractor,
  inputSchema: canonicalExtractorInputSchema, outputSchema: canonicalExtractorOutputSchema,
  ports: {inputs: [{"id":"html","label":"HTML source","description":"HTML source.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"hrefs","label":"Canonical href references in document order","description":"Canonical href references in document order.","valueType":{"type":"list","items":{"type":"string"}}}]},
});
export const runCanonicalExtractor = canonicalExtractorTool.execute;
export const example = {"input":{"html":"<link rel=\"alternate canonical\" href=\"/article?a=1&amp;b=2\">"},"output":{"hrefs":["/article?a=1&b=2"]}} satisfies ToolExample<CanonicalExtractorInput, CanonicalExtractorOutput>;
export default canonicalExtractorTool;
