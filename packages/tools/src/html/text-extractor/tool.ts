import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import {scanHtmlTokens} from "../tag-counter/tool.js";
// Method reference: https://html.spec.whatwg.org/multipage/parsing.html#tokenization
export type TextExtractorInput = {
  readonly html: string;
};
export type TextExtractorOutput = {
  readonly text: string;
};
export const textExtractorInputSchema = {"type":"object","additionalProperties":false,"properties":{"html":{"type":"string","maxLength":1000000,"description":"HTML source."}},"required":["html"]} as const satisfies ToolJsonSchema;
export const textExtractorOutputSchema = {"type":"object","additionalProperties":false,"properties":{"text":{"type":"string","maxLength":1000000,"description":"Extracted text without presentation layout."}},"required":["text"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

const syntaxEntities: Readonly<Record<string,string>> = {amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:"\u00a0"};
export const decodeSyntaxReferences = (value:string):string => value.replace(/&(#x[0-9a-fA-F]+|#\d+|amp|lt|gt|quot|apos|nbsp);/g, (raw:string,key:string) => {
  if(!key.startsWith("#")) return syntaxEntities[key];
  const code=Number.parseInt(key.slice(key[1]==="x"?2:1),key[1]==="x"?16:10);
  if(code===0 || code>0x10ffff || (code>=0xd800&&code<=0xdfff)) return "\ufffd";
  return String.fromCodePoint(code);
});

export const calculateTextExtractor = (input: unknown): ToolResult<TextExtractorOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = textExtractorInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, textExtractorInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["html"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: TextExtractorInput = {
    html: values.html as string
  };
  let hidden = ""; const parts:string[]=[];
  for (const token of scanHtmlTokens(x.html)) {
    if(token.kind === "start" && ["script","style"].includes(token.name)) hidden=token.name;
    else if(token.kind === "end" && token.name === hidden) hidden="";
    else if(token.kind === "text" && hidden === "") parts.push(decodeSyntaxReferences(token.raw));
  }
  const output: TextExtractorOutput = {text:parts.join("")};
  if (!matchesToolJsonSchema(output, textExtractorOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const textExtractorTool = defineTool<TextExtractorInput, TextExtractorOutput>({
  id: "html/text-extractor", title: "HTML Text Extractor", description: "Extract lexical HTML text while excluding script and style contents, decoding numeric and common syntax references, and preserving unknown named references.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateTextExtractor,
  inputSchema: textExtractorInputSchema, outputSchema: textExtractorOutputSchema,
  ports: {inputs: [{"id":"html","label":"HTML source","description":"HTML source.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"text","label":"Extracted text without presentation layout","description":"Extracted text without presentation layout.","valueType":{"type":"string"}}]},
});
export const runTextExtractor = textExtractorTool.execute;
export const example = {"input":{"html":"<p>Tom &amp; Jerry &#x1F600;</p><script>secret()</script>"},"output":{"text":"Tom & Jerry 😀"}} satisfies ToolExample<TextExtractorInput, TextExtractorOutput>;
export default textExtractorTool;
