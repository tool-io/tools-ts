import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import {scanHtmlTokens} from "../tag-counter/tool.js";
// Method reference: https://html.spec.whatwg.org/multipage/parsing.html#tokenization
export type CommentRemoverInput = {
  readonly html: string;
};
export type CommentRemoverOutput = {
  readonly html: string;
};
export const commentRemoverInputSchema = {"type":"object","additionalProperties":false,"properties":{"html":{"type":"string","maxLength":1000000,"description":"HTML source."}},"required":["html"]} as const satisfies ToolJsonSchema;
export const commentRemoverOutputSchema = {"type":"object","additionalProperties":false,"properties":{"html":{"type":"string","maxLength":1000000,"description":"Source with lexical comments removed."}},"required":["html"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateCommentRemover = (input: unknown): ToolResult<CommentRemoverOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = commentRemoverInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, commentRemoverInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["html"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: CommentRemoverInput = {
    html: values.html as string
  };
  const output: CommentRemoverOutput = {html:scanHtmlTokens(x.html).filter(token => token.kind !== "comment").map(token => token.raw).join("")};
  if (!matchesToolJsonSchema(output, commentRemoverOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const commentRemoverTool = defineTool<CommentRemoverInput, CommentRemoverOutput>({
  id: "html/comment-remover", title: "HTML Comment Remover", description: "Remove lexical HTML comments while preserving comment-like text inside script, style, title, and textarea elements.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateCommentRemover,
  inputSchema: commentRemoverInputSchema, outputSchema: commentRemoverOutputSchema,
  ports: {inputs: [{"id":"html","label":"HTML source","description":"HTML source.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"html","label":"Source with lexical comments removed","description":"Source with lexical comments removed.","valueType":{"type":"string"}}]},
});
export const runCommentRemover = commentRemoverTool.execute;
export const example = {"input":{"html":"<p>A</p><!-- hidden --><p>B</p>"},"output":{"html":"<p>A</p><p>B</p>"}} satisfies ToolExample<CommentRemoverInput, CommentRemoverOutput>;
export default commentRemoverTool;
