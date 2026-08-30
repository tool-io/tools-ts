import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import {scanHtmlTokens} from "../tag-counter/tool.js";
// Method reference: https://html.spec.whatwg.org/multipage/parsing.html#tokenization
export type TagStripperInput = {
  readonly html: string;
};
export type TagStripperOutput = {
  readonly text: string;
};
export const tagStripperInputSchema = {"type":"object","additionalProperties":false,"properties":{"html":{"type":"string","maxLength":1000000,"description":"HTML source."}},"required":["html"]} as const satisfies ToolJsonSchema;
export const tagStripperOutputSchema = {"type":"object","additionalProperties":false,"properties":{"text":{"type":"string","maxLength":1000000,"description":"Text left after removing lexical markup."}},"required":["text"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateTagStripper = (input: unknown): ToolResult<TagStripperOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = tagStripperInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, tagStripperInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["html"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: TagStripperInput = {
    html: values.html as string
  };
  const output: TagStripperOutput = {text:scanHtmlTokens(x.html).filter(token => token.kind === "text").map(token => token.raw).join("")};
  if (!matchesToolJsonSchema(output, tagStripperOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const tagStripperTool = defineTool<TagStripperInput, TagStripperOutput>({
  id: "html/tag-stripper", title: "HTML Tag Stripper", description: "Remove lexical HTML tags, comments, and declarations while retaining raw text and character references; the result is not sanitized markup.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateTagStripper,
  inputSchema: tagStripperInputSchema, outputSchema: tagStripperOutputSchema,
  ports: {inputs: [{"id":"html","label":"HTML source","description":"HTML source.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"text","label":"Text left after removing lexical markup","description":"Text left after removing lexical markup.","valueType":{"type":"string"}}]},
});
export const runTagStripper = tagStripperTool.execute;
export const example = {"input":{"html":"<p>Hello <b>world</b> &amp; friends</p>"},"output":{"text":"Hello world &amp; friends"}} satisfies ToolExample<TagStripperInput, TagStripperOutput>;
export default tagStripperTool;
