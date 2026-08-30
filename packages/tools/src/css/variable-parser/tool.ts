import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://drafts.csswg.org/css-variables-1/#defining-variables
export type VariableParserInput = {
  readonly declarations: string;
};
export type VariableParserOutput = {
  readonly variables: readonly {readonly name:string;readonly value:string}[];
};
export const variableParserInputSchema = {"type":"object","additionalProperties":false,"properties":{"declarations":{"type":"string","maxLength":1000000,"description":"CSS declaration list without a surrounding selector block."}},"required":["declarations"]} as const satisfies ToolJsonSchema;
export const variableParserOutputSchema = {"type":"object","additionalProperties":false,"properties":{"variables":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"name":{"type":"string","maxLength":1000000},"value":{"type":"string","maxLength":1000000}},"required":["name","value"]},"minItems":0,"maxItems":100000,"description":"Custom properties in declaration order."}},"required":["variables"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

// Split at top level only; strings, escapes, comments and nested blocks stay intact.
export const stripCssComments = (css:string):string|null => {let result="",quote="";for(let i=0;i<css.length;i++){const c=css[i];if(c==="\\"){result+=c+(css[++i]??"");continue;}if(quote){result+=c;if(c===quote)quote="";continue;}if(c==='"'||c==="'"){quote=c;result+=c;continue;}if(c==="/"&&css[i+1]==="*"){const end=css.indexOf("*/",i+2);if(end<0)return null;result+=" ";i=end+1;}else result+=c;}return quote?null:result;};

export const splitCssTopLevel = (value:string, delimiter:string):string[]|null => {
  const result:string[]=[], stack:string[]=[];let start=0,quote="";
  for(let i=0;i<value.length;i++) {
    const c=value[i];
    if(c==="\\") {i++;continue;}
    if(quote) {if(c===quote)quote="";continue;}
    if(c==='"'||c==="'"){quote=c;continue;}
    if(c==="/"&&value[i+1]==="*"){const end=value.indexOf("*/",i+2);if(end<0)return null;i=end+1;continue;}
    if("([{ ".trim().includes(c)){stack.push(c);continue;}
    if(")] }".replaceAll(" ","").includes(c)){const expected:{[key:string]:string}={")":"(","]":"[","}":"{"};if(stack.pop()!==expected[c])return null;continue;}
    if(stack.length===0 && (delimiter==="whitespace"?/\s/.test(c):c===delimiter)){result.push(value.slice(start,i).trim());start=i+1;}
  }
  if(quote || stack.length>0)return null;result.push(value.slice(start).trim());return result;
};

export const calculateVariableParser = (input: unknown): ToolResult<VariableParserOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = variableParserInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, variableParserInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["declarations"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: VariableParserInput = {
    declarations: values.declarations as string
  };
  const parts=splitCssTopLevel(x.declarations,";");
  if(!parts)return fail("declarations","Unbalanced CSS value syntax.","malformed_css");
  const variables:{name:string;value:string}[]=[];
  for(const part of parts) {
    const cleaned=stripCssComments(part);if(cleaned===null)return fail("declarations","Unclosed CSS comment or string.","malformed_css");const stripped=cleaned.trim();const colon=stripped.indexOf(":");if(colon<0){if(stripped.startsWith("--"))return fail("declarations","Custom properties need a colon.","malformed_css");continue;}
    const name=stripped.slice(0,colon).trim();if(!name.startsWith("--"))continue;
    if(!/^--(?:[A-Za-z0-9_-]|[^\x00-\x7f])+$/.test(name))return fail("declarations","This parser requires an unescaped custom-property name.","unsupported_identifier");
    variables.push({name,value:stripped.slice(colon+1).trim()});
  }
  const output: VariableParserOutput = {variables};
  if (!matchesToolJsonSchema(output, variableParserOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const variableParserTool = defineTool<VariableParserInput, VariableParserOutput>({
  id: "css/variable-parser", title: "CSS Custom Property Parser", description: "Extract custom-property declarations from a CSS declaration list, preserving nested value syntax and duplicate declarations.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateVariableParser,
  inputSchema: variableParserInputSchema, outputSchema: variableParserOutputSchema,
  ports: {inputs: [{"id":"declarations","label":"CSS declaration list without a surrounding selector block","description":"CSS declaration list without a surrounding selector block.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"variables","label":"Custom properties in declaration order","description":"Custom properties in declaration order.","valueType":{"type":"list","items":{"type":"object"}}}]},
});
export const runVariableParser = variableParserTool.execute;
export const example = {"input":{"declarations":"--brand: #336699; color: var(--brand); --font: \"a;b\"; --brand: rgb(1 2 3 / .5);"},"output":{"variables":[{"name":"--brand","value":"#336699"},{"name":"--font","value":"\"a;b\""},{"name":"--brand","value":"rgb(1 2 3 / .5)"}]}} satisfies ToolExample<VariableParserInput, VariableParserOutput>;
export default variableParserTool;
