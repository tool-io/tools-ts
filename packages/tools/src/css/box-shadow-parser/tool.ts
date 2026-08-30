import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import {splitCssTopLevel, stripCssComments} from "../variable-parser/tool.js";
// Method reference: https://drafts.csswg.org/css-backgrounds-3/#box-shadow
export type BoxShadowParserInput = {
  readonly value: string;
};
export type BoxShadowParserOutput = {
  readonly shadows: readonly {readonly inset:boolean;readonly offsetX:string;readonly offsetY:string;readonly blur:string;readonly spread:string;readonly color:string}[];
};
export const boxShadowParserInputSchema = {"type":"object","additionalProperties":false,"properties":{"value":{"type":"string","maxLength":1000000,"description":"Box-shadow CSS value."}},"required":["value"]} as const satisfies ToolJsonSchema;
export const boxShadowParserOutputSchema = {"type":"object","additionalProperties":false,"properties":{"shadows":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"inset":{"type":"boolean"},"offsetX":{"type":"string","maxLength":1000000},"offsetY":{"type":"string","maxLength":1000000},"blur":{"type":"string","maxLength":1000000},"spread":{"type":"string","maxLength":1000000},"color":{"type":"string","maxLength":1000000}},"required":["inset","offsetX","offsetY","blur","spread","color"]},"minItems":0,"maxItems":100000,"description":"Parsed shadows in source order."}},"required":["shadows"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateBoxShadowParser = (input: unknown): ToolResult<BoxShadowParserOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = boxShadowParserInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, boxShadowParserInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["value"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: BoxShadowParserInput = {
    value: values.value as string
  };
  const shadows:{inset:boolean;offsetX:string;offsetY:string;blur:string;spread:string;color:string}[]=[];
  if(x.value.trim().toLowerCase()!=="none") {
    const groups=splitCssTopLevel(x.value,",");if(!groups)return fail("value","Unbalanced shadow syntax.","malformed_css");
    for(const group of groups){const parts=splitCssTopLevel(group,"whitespace");if(!parts)return fail("value","Unbalanced shadow syntax.","malformed_css");
      const lengths:string[]=[];let inset=false,color="currentcolor",seenColor=false;
      for(const token of parts.filter(Boolean)) {
        if(token.toLowerCase()==="inset"){if(inset)return fail("value","Repeated inset keyword.","malformed_css");inset=true;}
        else if(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?(?:px|em|rem|ex|ch|lh|rlh|vw|vh|vmin|vmax|cm|mm|q|in|pt|pc)?$/i.test(token)){
          if(!/[a-z]$/i.test(token)&&Number(token)!==0)return fail("value","Only zero may omit its length unit.","invalid_length");lengths.push(token);
        } else {if(seenColor||/^calc\(/i.test(token))return fail("value","Provide one color and literal length values.","unsupported_value");color=token;seenColor=true;}
      }
      if(lengths.length<2||lengths.length>4)return fail("value","A shadow needs two to four lengths.","malformed_css");
      if(lengths[2]!==undefined && Number.parseFloat(lengths[2])<0)return fail("value","Blur radius cannot be negative.","invalid_blur");
      shadows.push({inset,offsetX:lengths[0],offsetY:lengths[1],blur:lengths[2]??"0",spread:lengths[3]??"0",color});
    }
  }
  const output: BoxShadowParserOutput = {shadows};
  if (!matchesToolJsonSchema(output, boxShadowParserOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const boxShadowParserTool = defineTool<BoxShadowParserInput, BoxShadowParserOutput>({
  id: "css/box-shadow-parser", title: "CSS Box Shadow Parser", description: "Parse box-shadow lists with literal CSS lengths and one color token, preserving units and rejecting unsupported calculated lengths.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateBoxShadowParser,
  inputSchema: boxShadowParserInputSchema, outputSchema: boxShadowParserOutputSchema,
  ports: {inputs: [{"id":"value","label":"Box-shadow CSS value","description":"Box-shadow CSS value.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"shadows","label":"Parsed shadows in source order","description":"Parsed shadows in source order.","valueType":{"type":"list","items":{"type":"object"}}}]},
});
export const runBoxShadowParser = boxShadowParserTool.execute;
export const example = {"input":{"value":"inset 2px 3px 4px -1px rgb(0 0 0 / .5), 0 1px blue"},"output":{"shadows":[{"inset":true,"offsetX":"2px","offsetY":"3px","blur":"4px","spread":"-1px","color":"rgb(0 0 0 / .5)"},{"inset":false,"offsetX":"0","offsetY":"1px","blur":"0","spread":"0","color":"blue"}]}} satisfies ToolExample<BoxShadowParserInput, BoxShadowParserOutput>;
export default boxShadowParserTool;
