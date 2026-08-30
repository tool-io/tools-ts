import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import {scanHtmlTokens} from "../tag-counter/tool.js";
// Method reference: https://drafts.csswg.org/css-text-3/#white-space-processing
export type WhitespaceCollapserInput = {
  readonly html: string;
};
export type WhitespaceCollapserOutput = {
  readonly html: string;
};
export const whitespaceCollapserInputSchema = {"type":"object","additionalProperties":false,"properties":{"html":{"type":"string","maxLength":1000000,"description":"HTML source."}},"required":["html"]} as const satisfies ToolJsonSchema;
export const whitespaceCollapserOutputSchema = {"type":"object","additionalProperties":false,"properties":{"html":{"type":"string","maxLength":1000000,"description":"Source with text-node ASCII whitespace collapsed."}},"required":["html"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateWhitespaceCollapser = (input: unknown): ToolResult<WhitespaceCollapserOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = whitespaceCollapserInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, whitespaceCollapserInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["html"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: WhitespaceCollapserInput = {
    html: values.html as string
  };
  const preserve:string[]=[]; const parts:string[]=[];
  const special = new Set(["pre","textarea","script","style","title","xmp","iframe","noembed","noframes"]);
  for (const token of scanHtmlTokens(x.html)) {
    if (token.kind === "start" && special.has(token.name)) preserve.push(token.name);
    parts.push(token.kind === "text" && preserve.length === 0 ? token.raw.replace(/[\t\n\f\r ]+/g," ") : token.raw);
    if(token.kind === "end" && token.name === preserve[preserve.length-1]) preserve.pop();
  }
  const output: WhitespaceCollapserOutput = {html:parts.join("")};
  if (!matchesToolJsonSchema(output, whitespaceCollapserOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const whitespaceCollapserTool = defineTool<WhitespaceCollapserInput, WhitespaceCollapserOutput>({
  id: "html/whitespace-collapser", title: "HTML Whitespace Collapser", description: "Collapse ASCII whitespace in lexical text nodes while preserving tags, attributes, comments, and preformatted or raw-text element contents.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateWhitespaceCollapser,
  inputSchema: whitespaceCollapserInputSchema, outputSchema: whitespaceCollapserOutputSchema,
  ports: {inputs: [{"id":"html","label":"HTML source","description":"HTML source.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"html","label":"Source with text-node ASCII whitespace collapsed","description":"Source with text-node ASCII whitespace collapsed.","valueType":{"type":"string"}}]},
});
export const runWhitespaceCollapser = whitespaceCollapserTool.execute;
export const example = {"input":{"html":"<p title=\"a  b\">hello\n   world</p><pre>a  b\n c</pre>"},"output":{"html":"<p title=\"a  b\">hello world</p><pre>a  b\n c</pre>"}} satisfies ToolExample<WhitespaceCollapserInput, WhitespaceCollapserOutput>;
export default whitespaceCollapserTool;
