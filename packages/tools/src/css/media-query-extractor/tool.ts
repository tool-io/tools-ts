import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import {stripCssComments} from "../variable-parser/tool.js";
// Method reference: https://drafts.csswg.org/css-conditional-3/#at-media
export type MediaQueryExtractorInput = {
  readonly css: string;
};
export type MediaQueryExtractorOutput = {
  readonly queries: readonly string[];
};
export const mediaQueryExtractorInputSchema = {"type":"object","additionalProperties":false,"properties":{"css":{"type":"string","maxLength":1000000,"description":"CSS stylesheet source."}},"required":["css"]} as const satisfies ToolJsonSchema;
export const mediaQueryExtractorOutputSchema = {"type":"object","additionalProperties":false,"properties":{"queries":{"type":"array","items":{"type":"string","maxLength":1000000},"minItems":0,"maxItems":100000,"description":"Media query preludes in source order."}},"required":["queries"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);



export const calculateMediaQueryExtractor = (input: unknown): ToolResult<MediaQueryExtractorOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = mediaQueryExtractorInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, mediaQueryExtractorInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["css"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: MediaQueryExtractorInput = {
    css: values.css as string
  };
  const css=stripCssComments(x.css);if(css===null)return fail("css","Unclosed comment or string.","malformed_css");
  const queries:string[]=[];let quote="";
  for(let i=0;i<css.length;i++) {
    const c=css[i];if(c==="\\"){i++;continue;}if(quote){if(c===quote)quote="";continue;}if(c==='"'||c==="'"){quote=c;continue;}
    if(css.slice(i,i+6).toLowerCase()==="@media"&&!/[A-Za-z0-9_-]/.test(css[i+6]??"")){
      let j=i+6,depth=0,inner="";for(;j<css.length;j++){const d=css[j];if(d==="\\"){j++;continue;}if(inner){if(d===inner)inner="";continue;}if(d==='"'||d==="'")inner=d;else if(d==="(")depth++;else if(d===")")depth--;else if(d==="{"&&depth===0)break;}
      if(j===css.length||depth!==0||inner)return fail("css","An @media prelude must end with an opening brace.","malformed_css");
      queries.push(css.slice(i+6,j).trim());i=j;
    }
  }
  const output: MediaQueryExtractorOutput = {queries};
  if (!matchesToolJsonSchema(output, mediaQueryExtractorOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const mediaQueryExtractorTool = defineTool<MediaQueryExtractorInput, MediaQueryExtractorOutput>({
  id: "css/media-query-extractor", title: "CSS Media Query Extractor", description: "Extract lexical @media query preludes from CSS while ignoring quoted strings and comments, without evaluating conditions.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateMediaQueryExtractor,
  inputSchema: mediaQueryExtractorInputSchema, outputSchema: mediaQueryExtractorOutputSchema,
  ports: {inputs: [{"id":"css","label":"CSS stylesheet source","description":"CSS stylesheet source.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"queries","label":"Media query preludes in source order","description":"Media query preludes in source order.","valueType":{"type":"list","items":{"type":"string"}}}]},
});
export const runMediaQueryExtractor = mediaQueryExtractorTool.execute;
export const example = {"input":{"css":"/* @media fake{} */ @media screen and (min-width: 40em) {a{color:red}} @media print {b{color:black}}"},"output":{"queries":["screen and (min-width: 40em)","print"]}} satisfies ToolExample<MediaQueryExtractorInput, MediaQueryExtractorOutput>;
export default mediaQueryExtractorTool;
