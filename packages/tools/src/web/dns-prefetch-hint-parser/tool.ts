import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import {scanHtmlTokens} from "../../html/tag-counter/tool.js";
import {getHtmlAttribute} from "../../html/attribute-parser/tool.js";
import {decodeSyntaxReferences} from "../../html/text-extractor/tool.js";
// Method reference: https://www.w3.org/TR/resource-hints/
export type DnsPrefetchHintParserInput = {
  readonly html: string;
};
export type DnsPrefetchHintParserOutput = {
  readonly hrefs: readonly string[];
};
export const dnsPrefetchHintParserInputSchema = {"type":"object","additionalProperties":false,"properties":{"html":{"type":"string","maxLength":1000000,"description":"HTML source."}},"required":["html"]} as const satisfies ToolJsonSchema;
export const dnsPrefetchHintParserOutputSchema = {"type":"object","additionalProperties":false,"properties":{"hrefs":{"type":"array","items":{"type":"string","maxLength":1000000},"minItems":0,"maxItems":100000,"description":"Matching link hrefs in document order."}},"required":["hrefs"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateDnsPrefetchHintParser = (input: unknown): ToolResult<DnsPrefetchHintParserOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = dnsPrefetchHintParserInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, dnsPrefetchHintParserInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["html"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: DnsPrefetchHintParserInput = {
    html: values.html as string
  };
  const hrefs:string[]=[];
  for(const token of scanHtmlTokens(x.html)) if(token.kind === "start" && token.name === "link" && token.tag) {
    const rel=getHtmlAttribute(token.tag,"rel") ?? "", href=getHtmlAttribute(token.tag,"href");
    if(href !== undefined && rel.toLowerCase().split(/[\t\n\f\r ]+/).includes("dns-prefetch")) hrefs.push(decodeSyntaxReferences(href));
  }
  const output: DnsPrefetchHintParserOutput = {hrefs};
  if (!matchesToolJsonSchema(output, dnsPrefetchHintParserOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const dnsPrefetchHintParserTool = defineTool<DnsPrefetchHintParserInput, DnsPrefetchHintParserOutput>({
  id: "web/dns-prefetch-hint-parser", title: "DnsPrefetchHintParser", description: "Extract dns-prefetch link hints from HTML source without fetching, validating browser support, or resolving their hrefs.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateDnsPrefetchHintParser,
  inputSchema: dnsPrefetchHintParserInputSchema, outputSchema: dnsPrefetchHintParserOutputSchema,
  ports: {inputs: [{"id":"html","label":"HTML source","description":"HTML source.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"hrefs","label":"Matching link hrefs in document order","description":"Matching link hrefs in document order.","valueType":{"type":"list","items":{"type":"string"}}}]},
});
export const runDnsPrefetchHintParser = dnsPrefetchHintParserTool.execute;
export const example = {"input":{"html":"<link rel=\"DNS-PREFETCH\" href=\"/app.js\"><link rel=\"stylesheet\" href=\"/style.css\">"},"output":{"hrefs":["/app.js"]}} satisfies ToolExample<DnsPrefetchHintParserInput, DnsPrefetchHintParserOutput>;
export default dnsPrefetchHintParserTool;
