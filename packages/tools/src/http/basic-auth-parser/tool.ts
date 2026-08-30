import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://www.rfc-editor.org/rfc/rfc7617.html#section-2
export type BasicAuthParserInput = {
  readonly header: string;
};
export type BasicAuthParserOutput = {
  readonly usernameBytes: readonly number[];
  readonly passwordBytes: readonly number[];
};
export const basicAuthParserInputSchema = {"type":"object","additionalProperties":false,"properties":{"header":{"type":"string","maxLength":1000000,"description":"Authorization field value."}},"required":["header"]} as const satisfies ToolJsonSchema;
export const basicAuthParserOutputSchema = {"type":"object","additionalProperties":false,"properties":{"usernameBytes":{"type":"array","items":{"type":"integer","minimum":0,"maximum":255},"minItems":0,"maxItems":100000,"description":"Username bytes."},"passwordBytes":{"type":"array","items":{"type":"integer","minimum":0,"maximum":255},"minItems":0,"maxItems":100000,"description":"Password bytes."}},"required":["usernameBytes","passwordBytes"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

const BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
export const decodeBase64Bytes = (text:string): readonly number[] | null => {
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(text)) return null;
  const bytes:number[]=[];
  for(let i=0;i<text.length;i+=4) {
    const a=BASE64.indexOf(text[i]),b=BASE64.indexOf(text[i+1]),c=text[i+2]==="="?0:BASE64.indexOf(text[i+2]),d=text[i+3]==="="?0:BASE64.indexOf(text[i+3]);
    if(text[i+2]==="=" && (b&15)!==0 || text[i+3]==="=" && text[i+2]!=="=" && (c&3)!==0)return null;
    bytes.push((a<<2)|(b>>4));if(text[i+2]!=="=")bytes.push(((b&15)<<4)|(c>>2));if(text[i+3]!=="=")bytes.push(((c&3)<<6)|d);
  }
  return bytes;
};
export const encodeBase64Bytes = (bytes:readonly number[]):string => {
  let result="";
  for(let i=0;i<bytes.length;i+=3) {
    const a=bytes[i],b=bytes[i+1]??0,c=bytes[i+2]??0;
    result+=BASE64[a>>2]+BASE64[((a&3)<<4)|(b>>4)]+(i+1<bytes.length?BASE64[((b&15)<<2)|(c>>6)]:"=")+(i+2<bytes.length?BASE64[c&63]:"=");
  }
  return result;
};

export const calculateBasicAuthParser = (input: unknown): ToolResult<BasicAuthParserOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = basicAuthParserInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, basicAuthParserInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["header"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: BasicAuthParserInput = {
    header: values.header as string
  };
  const match=/^Basic[\t ]+([A-Za-z0-9+/]*={0,2})[\t ]*$/i.exec(x.header);
  if(!match) return fail("header", "Provide Basic authorization credentials.", "malformed_authorization");
  const bytes=decodeBase64Bytes(match[1]);
  if(!bytes) return fail("header", "Invalid Base64 credential bytes.", "malformed_base64");
  const colon=bytes.indexOf(58);
  if(colon<0 || bytes.some(byte => byte<32 || byte===127)) return fail("header", "Credentials must contain a colon and no control bytes.", "malformed_credentials");
  const output: BasicAuthParserOutput = {usernameBytes:bytes.slice(0,colon),passwordBytes:bytes.slice(colon+1)};
  if (!matchesToolJsonSchema(output, basicAuthParserOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const basicAuthParserTool = defineTool<BasicAuthParserInput, BasicAuthParserOutput>({
  id: "http/basic-auth-parser", title: "HTTP Basic Authentication Parser", description: "Decode strict Base64 Basic credentials as byte values and separate the first colon, leaving character-set interpretation to the caller.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateBasicAuthParser,
  inputSchema: basicAuthParserInputSchema, outputSchema: basicAuthParserOutputSchema,
  ports: {inputs: [{"id":"header","label":"Authorization field value","description":"Authorization field value.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"usernameBytes","label":"Username bytes","description":"Username bytes.","valueType":{"type":"list","items":{"type":"integer"}}},{"id":"passwordBytes","label":"Password bytes","description":"Password bytes.","valueType":{"type":"list","items":{"type":"integer"}}}]},
});
export const runBasicAuthParser = basicAuthParserTool.execute;
export const example = {"input":{"header":"Basic dXNlcjpwYXNz"},"output":{"usernameBytes":[117,115,101,114],"passwordBytes":[112,97,115,115]}} satisfies ToolExample<BasicAuthParserInput, BasicAuthParserOutput>;
export default basicAuthParserTool;
