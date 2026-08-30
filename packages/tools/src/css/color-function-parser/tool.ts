import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import {splitCssTopLevel, stripCssComments} from "../variable-parser/tool.js";
// Method reference: https://drafts.csswg.org/css-color-4/#rgb-functions
export type ColorFunctionParserInput = {
  readonly value: string;
};
export type ColorFunctionParserOutput = {
  readonly function: string;
  readonly channels: readonly string[];
  readonly alpha: string;
};
export const colorFunctionParserInputSchema = {"type":"object","additionalProperties":false,"properties":{"value":{"type":"string","maxLength":1000000,"description":"Functional RGB or HSL CSS color."}},"required":["value"]} as const satisfies ToolJsonSchema;
export const colorFunctionParserOutputSchema = {"type":"object","additionalProperties":false,"properties":{"function":{"type":"string","maxLength":1000000,"description":"Lowercase function name."},"channels":{"type":"array","items":{"type":"string","maxLength":1000000},"minItems":0,"maxItems":100000,"description":"Three channel tokens."},"alpha":{"type":"string","maxLength":1000000,"description":"Alpha token, defaulting to 1."}},"required":["function","channels","alpha"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateColorFunctionParser = (input: unknown): ToolResult<ColorFunctionParserOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = colorFunctionParserInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, colorFunctionParserInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["value"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: ColorFunctionParserInput = {
    value: values.value as string
  };
  const match=/^(rgb|rgba|hsl|hsla)\(([\s\S]*)\)$/i.exec(x.value.trim());if(!match)return fail("value","Provide an RGB or HSL function.","unsupported_function");
  const comma=splitCssTopLevel(match[2],",");if(!comma)return fail("value","Unbalanced color syntax.","malformed_css");
  let channels:string[],alpha="1";
  if(comma.length>1){if(comma.length!==3&&comma.length!==4||comma.some(value=>!value || value.includes("/")))return fail("value","Legacy colors need three or four comma-separated arguments.","malformed_css");channels=comma.slice(0,3);alpha=comma[3]??"1";}
  else {const slash=splitCssTopLevel(match[2],"/");if(!slash||slash.length>2)return fail("value","A color may have one alpha separator.","malformed_css");const parts=splitCssTopLevel(slash[0],"whitespace");if(!parts)return fail("value","Unbalanced color syntax.","malformed_css");channels=parts.filter(Boolean);alpha=slash[1]??"1";if(channels.length!==3||alpha==="")return fail("value","A color needs three channels and optional alpha.","malformed_css");}
  const output: ColorFunctionParserOutput = {function:match[1].toLowerCase(),channels,alpha};
  if (!matchesToolJsonSchema(output, colorFunctionParserOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const colorFunctionParserTool = defineTool<ColorFunctionParserInput, ColorFunctionParserOutput>({
  id: "css/color-function-parser", title: "CSS Color Function Parser", description: "Parse rgb, rgba, hsl, and hsla function channel tokens and alpha without converting color spaces or evaluating CSS expressions.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateColorFunctionParser,
  inputSchema: colorFunctionParserInputSchema, outputSchema: colorFunctionParserOutputSchema,
  ports: {inputs: [{"id":"value","label":"Functional RGB or HSL CSS color","description":"Functional RGB or HSL CSS color.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"function","label":"Lowercase function name","description":"Lowercase function name.","valueType":{"type":"string"}},{"id":"channels","label":"Three channel tokens","description":"Three channel tokens.","valueType":{"type":"list","items":{"type":"string"}}},{"id":"alpha","label":"Alpha token, defaulting to 1","description":"Alpha token, defaulting to 1.","valueType":{"type":"string"}}]},
});
export const runColorFunctionParser = colorFunctionParserTool.execute;
export const example = {"input":{"value":"rgb(10 20 30 / 50%)"},"output":{"function":"rgb","channels":["10","20","30"],"alpha":"50%"}} satisfies ToolExample<ColorFunctionParserInput, ColorFunctionParserOutput>;
export default colorFunctionParserTool;
