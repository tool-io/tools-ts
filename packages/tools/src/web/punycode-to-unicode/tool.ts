import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://www.rfc-editor.org/rfc/rfc3492.html
export type PunycodeToUnicodeInput = {
  readonly domain: string;
};
export type PunycodeToUnicodeOutput = {
  readonly domain: string;
};
export const punycodeToUnicodeInputSchema = {"type":"object","additionalProperties":false,"properties":{"domain":{"type":"string","maxLength":1000000,"description":"ASCII domain name with optional xn-- labels."}},"required":["domain"]} as const satisfies ToolJsonSchema;
export const punycodeToUnicodeOutputSchema = {"type":"object","additionalProperties":false,"properties":{"domain":{"type":"string","maxLength":1000000,"description":"Domain with Punycode labels decoded."}},"required":["domain"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

const adaptBias=(delta:number,points:number,first:boolean):number=>{delta=first?Math.floor(delta/700):Math.floor(delta/2);delta+=Math.floor(delta/points);let k=0;while(delta>455){delta=Math.floor(delta/35);k+=36;}return k+Math.floor(36*delta/(delta+38));};
export const decodePunycodeLabel=(label:string):string|null=>{
  const values:number[]=[],last=label.lastIndexOf("-");let at=last<0?0:last+1;
  if(last>=0){for(const char of label.slice(0,last)){const code=char.codePointAt(0);if(code===undefined||code>=128)return null;values.push(code);}}
  let n=128,index=0,bias=72;
  while(at<label.length){const old=index;let weight=1;
    for(let k=36;;k+=36){if(at>=label.length)return null;const code=label.charCodeAt(at++),digit=code>=48&&code<=57?code-22:code>=65&&code<=90?code-65:code>=97&&code<=122?code-97:-1;if(digit<0)return null;index+=digit*weight;if(!Number.isSafeInteger(index))return null;const t=k<=bias?1:k>=bias+26?26:k-bias;if(digit<t)break;weight*=36-t;if(!Number.isSafeInteger(weight))return null;}
    const size=values.length+1;bias=adaptBias(index-old,size,old===0);n+=Math.floor(index/size);index%=size;if(n>0x10ffff||(n>=0xd800&&n<=0xdfff))return null;values.splice(index,0,n);index++;
  }
  return values.map(value=>String.fromCodePoint(value)).join("");
};

export const calculatePunycodeToUnicode = (input: unknown): ToolResult<PunycodeToUnicodeOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = punycodeToUnicodeInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, punycodeToUnicodeInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["domain"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: PunycodeToUnicodeInput = {
    domain: values.domain as string
  };
  if(!/^[A-Za-z0-9.-]+$/.test(x.domain))return fail("domain","Provide an ASCII domain name.","invalid_domain");
  const labels=x.domain.split("."),decoded:string[]=[];
  for(const label of labels){if(/^xn--/i.test(label)){const value=decodePunycodeLabel(label.slice(4));if(!value)return fail("domain","Malformed Punycode label.","malformed_punycode");decoded.push(value);}else decoded.push(label);}
  const output: PunycodeToUnicodeOutput = {domain:decoded.join(".")};
  if (!matchesToolJsonSchema(output, punycodeToUnicodeOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const punycodeToUnicodeTool = defineTool<PunycodeToUnicodeInput, PunycodeToUnicodeOutput>({
  id: "web/punycode-to-unicode", title: "Punycode Domain Decoder", description: "Decode xn-- domain labels using RFC 3492 without claiming DNS registration or Unicode confusable safety.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculatePunycodeToUnicode,
  inputSchema: punycodeToUnicodeInputSchema, outputSchema: punycodeToUnicodeOutputSchema,
  ports: {inputs: [{"id":"domain","label":"ASCII domain name with optional xn-- labels","description":"ASCII domain name with optional xn-- labels.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"domain","label":"Domain with Punycode labels decoded","description":"Domain with Punycode labels decoded.","valueType":{"type":"string"}}]},
});
export const runPunycodeToUnicode = punycodeToUnicodeTool.execute;
export const example = {"input":{"domain":"xn--bcher-kva.example"},"output":{"domain":"bücher.example"}} satisfies ToolExample<PunycodeToUnicodeInput, PunycodeToUnicodeOutput>;
export default punycodeToUnicodeTool;
