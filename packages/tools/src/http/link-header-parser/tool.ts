import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import {splitHeaderValue, parseHeaderParameter} from "../content-type-parser/tool.js";
// Method reference: https://www.rfc-editor.org/rfc/rfc8288.html#section-3
export type LinkHeaderParserInput = {
  readonly header: string;
};
export type LinkHeaderParserOutput = {
  readonly links: readonly {readonly target: string; readonly parameters: readonly { readonly name: string; readonly value: string }[]}[];
};
export const linkHeaderParserInputSchema = {"type":"object","additionalProperties":false,"properties":{"header":{"type":"string","maxLength":1000000,"description":"Link field value."}},"required":["header"]} as const satisfies ToolJsonSchema;
export const linkHeaderParserOutputSchema = {"type":"object","additionalProperties":false,"properties":{"links":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"target":{"type":"string","maxLength":1000000},"parameters":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"name":{"type":"string","maxLength":1000000},"value":{"type":"string","maxLength":1000000}},"required":["name","value"]},"minItems":0,"maxItems":100000}},"required":["target","parameters"]},"minItems":0,"maxItems":100000,"description":"Links in header order."}},"required":["links"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateLinkHeaderParser = (input: unknown): ToolResult<LinkHeaderParserOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = linkHeaderParserInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, linkHeaderParserInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["header"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: LinkHeaderParserInput = {
    header: values.header as string
  };
  const groups = splitHeaderValue(x.header,",");
  if (!groups) return fail("header", "Unbalanced Link header.", "malformed_header");
  const links: {target: string; parameters: {name: string; value: string}[]}[] = [];
  for (const group of groups) {
    if (group === "") continue;
    const match = /^<([^<>\s]*)>\s*(.*)$/.exec(group);
    if (!match) return fail("header", "Each link target must be enclosed in angle brackets.", "malformed_header");
    const parameters: {name:string; value:string}[] = [];
    if (match[2] !== "") {
      if (!match[2].startsWith(";")) return fail("header", "Link parameters must follow a semicolon.", "malformed_header");
      const parts = splitHeaderValue(match[2].slice(1),";");
      if (!parts) return fail("header", "Malformed Link parameters.", "malformed_header");
      for (const part of parts) { const p = parseHeaderParameter(part); if (!p) return fail("header", "Malformed Link parameter.", "malformed_header"); parameters.push(p); }
    }
    links.push({target:match[1],parameters});
  }
  const output: LinkHeaderParserOutput = {links};
  if (!matchesToolJsonSchema(output, linkHeaderParserOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const linkHeaderParserTool = defineTool<LinkHeaderParserInput, LinkHeaderParserOutput>({
  id: "http/link-header-parser", title: "HTTP Link Header Parser", description: "Parse RFC 8288 link targets and parameters while retaining quoted delimiters and repeated relation parameters.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateLinkHeaderParser,
  inputSchema: linkHeaderParserInputSchema, outputSchema: linkHeaderParserOutputSchema,
  ports: {inputs: [{"id":"header","label":"Link field value","description":"Link field value.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"links","label":"Links in header order","description":"Links in header order.","valueType":{"type":"list","items":{"type":"object"}}}]},
});
export const runLinkHeaderParser = linkHeaderParserTool.execute;
export const example = {"input":{"header":"</next?page=2>; rel=\"next\"; title=\"Next, page\", <https://example.com/help>; rel=help"},"output":{"links":[{"target":"/next?page=2","parameters":[{"name":"rel","value":"next"},{"name":"title","value":"Next, page"}]},{"target":"https://example.com/help","parameters":[{"name":"rel","value":"help"}]}]}} satisfies ToolExample<LinkHeaderParserInput, LinkHeaderParserOutput>;
export default linkHeaderParserTool;
