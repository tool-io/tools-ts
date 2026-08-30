import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://html.spec.whatwg.org/multipage/parsing.html#tokenization
export type AttributeParserInput = {
  readonly tag: string;
};
export type AttributeParserOutput = {
  readonly name: string;
  readonly attributes: readonly {readonly name:string;readonly value:string}[];
};
export const attributeParserInputSchema = {"type":"object","additionalProperties":false,"properties":{"tag":{"type":"string","maxLength":1000000,"description":"One complete HTML start tag."}},"required":["tag"]} as const satisfies ToolJsonSchema;
export const attributeParserOutputSchema = {"type":"object","additionalProperties":false,"properties":{"name":{"type":"string","maxLength":1000000,"description":"Lowercase tag name."},"attributes":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"name":{"type":"string","maxLength":1000000},"value":{"type":"string","maxLength":1000000}},"required":["name","value"]},"minItems":0,"maxItems":100000,"description":"Attributes with raw values in source order."}},"required":["name","attributes"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export type ParsedHtmlTag = {readonly name:string;readonly attributes: readonly {readonly name:string;readonly value:string}[]};
// This lexical parser deliberately does not construct or repair an HTML tree.
export const parseHtmlStartTag = (tag: string): ParsedHtmlTag | null => {
  const start = /^<([A-Za-z][A-Za-z0-9:-]*)/.exec(tag); if (!start) return null;
  let i = start[0].length; const attributes: {name:string;value:string}[] = [], names = new Set<string>();
  while (i < tag.length) {
    const beforeSpace = i;
    while (/[\t\n\f\r ]/.test(tag[i] ?? "") && i < tag.length) i++;
    if (tag[i] === ">" || (tag[i] === "/" && tag[i+1] === ">")) {
      const end = i + (tag[i] === "/" ? 2 : 1); return end === tag.length ? {name:start[1].toLowerCase(),attributes} : null;
    }
    if (beforeSpace === i) return null;
    const attr = /^[^\t\n\f\r /=>"'<>`]+/.exec(tag.slice(i)); if (!attr) return null;
    const name = attr[0].toLowerCase(); i += attr[0].length; const afterName = i;
    while (/[\t\n\f\r ]/.test(tag[i] ?? "") && i < tag.length) i++;
    let value = "", hasEquals = false;
    if (tag[i] === "=") {
      hasEquals = true;
      i++; while (/[\t\n\f\r ]/.test(tag[i] ?? "") && i < tag.length) i++;
      if (tag[i] === '"' || tag[i] === "'") {
        const quote = tag[i++]; const end = tag.indexOf(quote,i); if (end < 0) return null;
        value = tag.slice(i,end); i = end+1;
      } else {
        const raw = /^[^\t\n\f\r >"'<=`]+/.exec(tag.slice(i)); if (!raw) return null;
        value = raw[0]; i += value.length;
      }
    }
    if (!hasEquals) i = afterName;
    if (!names.has(name)) {names.add(name); attributes.push({name,value});}
  }
  return null;
};
export const getHtmlAttribute = (tag: ParsedHtmlTag, name: string): string | undefined =>
  tag.attributes.find(attribute => attribute.name === name.toLowerCase())?.value;

export const calculateAttributeParser = (input: unknown): ToolResult<AttributeParserOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = attributeParserInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, attributeParserInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["tag"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: AttributeParserInput = {
    tag: values.tag as string
  };
  const parsed = parseHtmlStartTag(x.tag);
  if (!parsed) return fail("tag", "Provide one complete HTML start tag.", "malformed_tag");
  const output: AttributeParserOutput = parsed;
  if (!matchesToolJsonSchema(output, attributeParserOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const attributeParserTool = defineTool<AttributeParserInput, AttributeParserOutput>({
  id: "html/attribute-parser", title: "HTML Attribute Parser", description: "Lexically parse one HTML start tag into its lowercase name and attributes, retaining raw character references and the first duplicate attribute.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateAttributeParser,
  inputSchema: attributeParserInputSchema, outputSchema: attributeParserOutputSchema,
  ports: {inputs: [{"id":"tag","label":"One complete HTML start tag","description":"One complete HTML start tag.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"name","label":"Lowercase tag name","description":"Lowercase tag name.","valueType":{"type":"string"}},{"id":"attributes","label":"Attributes with raw values in source order","description":"Attributes with raw values in source order.","valueType":{"type":"list","items":{"type":"object"}}}]},
});
export const runAttributeParser = attributeParserTool.execute;
export const example = {"input":{"tag":"<INPUT disabled value=\"a > b\" DATA-ID=42>"},"output":{"name":"input","attributes":[{"name":"disabled","value":""},{"name":"value","value":"a > b"},{"name":"data-id","value":"42"}]}} satisfies ToolExample<AttributeParserInput, AttributeParserOutput>;
export default attributeParserTool;
