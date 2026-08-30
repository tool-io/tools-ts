import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import {scanHtmlTokens} from "../../html/tag-counter/tool.js";
import {getHtmlAttribute} from "../../html/attribute-parser/tool.js";
import {decodeSyntaxReferences} from "../../html/text-extractor/tool.js";
// Method reference: https://html.spec.whatwg.org/multipage/semantics.html#the-meta-element
export type MetaTagParserInput = {
  readonly html: string;
};
export type MetaTagParserOutput = {
  readonly entries: readonly {readonly key:string;readonly content:string}[];
};
export const metaTagParserInputSchema = {"type":"object","additionalProperties":false,"properties":{"html":{"type":"string","maxLength":1000000,"description":"HTML source."}},"required":["html"]} as const satisfies ToolJsonSchema;
export const metaTagParserOutputSchema = {"type":"object","additionalProperties":false,"properties":{"entries":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"key":{"type":"string","maxLength":1000000},"content":{"type":"string","maxLength":1000000}},"required":["key","content"]},"minItems":0,"maxItems":100000,"description":"Metadata keys and decoded content values."}},"required":["entries"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateMetaTagParser = (input: unknown): ToolResult<MetaTagParserOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = metaTagParserInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, metaTagParserInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["html"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: MetaTagParserInput = {
    html: values.html as string
  };
  const entries: {key:string;content:string}[] = [];
  for (const token of scanHtmlTokens(x.html)) if(token.kind === "start" && token.name === "meta" && token.tag) {
    const key=getHtmlAttribute(token.tag,"property") ?? getHtmlAttribute(token.tag,"name") ?? getHtmlAttribute(token.tag,"http-equiv");
    const content=getHtmlAttribute(token.tag,"content");
    if(key !== undefined && content !== undefined && true) entries.push({key:decodeSyntaxReferences(key),content:decodeSyntaxReferences(content)});
  }
  const output: MetaTagParserOutput = {entries};
  if (!matchesToolJsonSchema(output, metaTagParserOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const metaTagParserTool = defineTool<MetaTagParserInput, MetaTagParserOutput>({
  id: "web/meta-tag-parser", title: "Meta Tag Parser", description: "Extract named meta entries from HTML source in document order, preserving repeated keys.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateMetaTagParser,
  inputSchema: metaTagParserInputSchema, outputSchema: metaTagParserOutputSchema,
  ports: {inputs: [{"id":"html","label":"HTML source","description":"HTML source.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"entries","label":"Metadata keys and decoded content values","description":"Metadata keys and decoded content values.","valueType":{"type":"list","items":{"type":"object"}}}]},
});
export const runMetaTagParser = metaTagParserTool.execute;
export const example = {"input":{"html":"<meta name=\"description\" content=\"A &amp; B\"><meta property=\"og:title\" content=\"Example\"><meta name=\"twitter:card\" content=\"summary\">"},"output":{"entries":[{"key":"description","content":"A & B"},{"key":"og:title","content":"Example"},{"key":"twitter:card","content":"summary"}]}} satisfies ToolExample<MetaTagParserInput, MetaTagParserOutput>;
export default metaTagParserTool;
