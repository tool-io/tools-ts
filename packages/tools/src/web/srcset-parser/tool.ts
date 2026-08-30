import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://html.spec.whatwg.org/multipage/images.html#parsing-a-srcset-attribute
export type SrcsetParserInput = {
  readonly srcset: string;
};
export type SrcsetParserOutput = {
  readonly candidates: readonly {readonly url:string;readonly descriptor:string;readonly kind:"density"|"width";readonly value:number}[];
};
export const srcsetParserInputSchema = {"type":"object","additionalProperties":false,"properties":{"srcset":{"type":"string","maxLength":1000000,"description":"Image srcset attribute value."}},"required":["srcset"]} as const satisfies ToolJsonSchema;
export const srcsetParserOutputSchema = {"type":"object","additionalProperties":false,"properties":{"candidates":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"url":{"type":"string","maxLength":1000000},"descriptor":{"type":"string","maxLength":1000000},"kind":{"type":"string","enum":["density","width"]},"value":{"type":"number","exclusiveMinimum":0}},"required":["url","descriptor","kind","value"]},"minItems":0,"maxItems":100000,"description":"Image candidates in source order."}},"required":["candidates"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateSrcsetParser = (input: unknown): ToolResult<SrcsetParserOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = srcsetParserInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, srcsetParserInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["srcset"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: SrcsetParserInput = {
    srcset: values.srcset as string
  };
  const candidates:{url:string;descriptor:string;kind:"density"|"width";value:number}[]=[];let i=0,kind:"density"|"width"|null=null;
  while(i<x.srcset.length){while(/[\t\n\f\r ,]/.test(x.srcset[i]??"")&&i<x.srcset.length)i++;if(i>=x.srcset.length)break;
    const start=i;while(i<x.srcset.length&&!/[\t\n\f\r ]/.test(x.srcset[i]))i++;let url=x.srcset.slice(start,i),descriptor="";
    if(url.endsWith(","))url=url.replace(/,+$/,"");else{const begin=i;let depth=0;for(;i<x.srcset.length;i++){const c=x.srcset[i];if(c==="(")depth++;else if(c===")")depth--;else if(c===","&&depth===0)break;}descriptor=x.srcset.slice(begin,i).trim();if(x.srcset[i]===",")i++;}
    let candidateKind:"density"|"width"="density",value=1;
    if(descriptor){if(/^[1-9]\d*w$/.test(descriptor)){candidateKind="width";value=Number(descriptor.slice(0,-1));if(!Number.isSafeInteger(value))return fail("srcset","Width must be a safe positive integer.","invalid_descriptor");}
      else if(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?x$/.test(descriptor)){value=Number(descriptor.slice(0,-1));if(!Number.isFinite(value)||value<=0)return fail("srcset","Density must be positive and finite.","invalid_descriptor");}
      else return fail("srcset","Provide one width or density descriptor per candidate.","invalid_descriptor");}
    if(!url)return fail("srcset","Candidate URL cannot be empty.","invalid_descriptor");
    if(kind!==null&&kind!==candidateKind)return fail("srcset","Width and density candidates cannot be mixed.","mixed_descriptors");kind=candidateKind;
    if(candidates.some(candidate=>candidate.value===value))return fail("srcset","Descriptors must be unique.","duplicate_descriptor");
    candidates.push({url,descriptor,kind:candidateKind,value});
  }
  const output: SrcsetParserOutput = {candidates};
  if (!matchesToolJsonSchema(output, srcsetParserOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const srcsetParserTool = defineTool<SrcsetParserInput, SrcsetParserOutput>({
  id: "web/srcset-parser", title: "Image Srcset Parser", description: "Parse srcset candidates with positive width or density descriptors, rejecting mixed descriptor types and preserving commas within URL tokens.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateSrcsetParser,
  inputSchema: srcsetParserInputSchema, outputSchema: srcsetParserOutputSchema,
  ports: {inputs: [{"id":"srcset","label":"Image srcset attribute value","description":"Image srcset attribute value.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"candidates","label":"Image candidates in source order","description":"Image candidates in source order.","valueType":{"type":"list","items":{"type":"object"}}}]},
});
export const runSrcsetParser = srcsetParserTool.execute;
export const example = {"input":{"srcset":"small.png 1x, large.png 2x"},"output":{"candidates":[{"url":"small.png","descriptor":"1x","kind":"density","value":1},{"url":"large.png","descriptor":"2x","kind":"density","value":2}]}} satisfies ToolExample<SrcsetParserInput, SrcsetParserOutput>;
export default srcsetParserTool;
