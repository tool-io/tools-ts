import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { utf8Encode } from "../../core/encoding.js";
import { parseUrl } from "../../core/url.js";
import {decodeBase64Bytes} from "../../http/basic-auth-parser/tool.js";
// Method reference: https://www.rfc-editor.org/rfc/rfc2397.html
export type UrlDataParserInput = {
  readonly url: string;
};
export type UrlDataParserOutput = {
  readonly mediaType: string;
  readonly base64: boolean;
  readonly bytes: readonly number[];
};
export const urlDataParserInputSchema = {"type":"object","additionalProperties":false,"properties":{"url":{"type":"string","maxLength":1000000,"description":"Absolute data URL."}},"required":["url"]} as const satisfies ToolJsonSchema;
export const urlDataParserOutputSchema = {"type":"object","additionalProperties":false,"properties":{"mediaType":{"type":"string","maxLength":1000000,"description":"Declared media type or RFC 2397 default."},"base64":{"type":"boolean","description":"Whether Base64 encoding was declared."},"bytes":{"type":"array","items":{"type":"integer","minimum":0,"maximum":255},"minItems":0,"maxItems":1000000,"description":"Decoded payload bytes."}},"required":["mediaType","base64","bytes"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateUrlDataParser = (input: unknown): ToolResult<UrlDataParserOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = urlDataParserInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, urlDataParserInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["url"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: UrlDataParserInput = {
    url: values.url as string
  };
  let url;
  try {url=parseUrl(x.url);}catch(error){if(error instanceof TypeError)return fail("url","Provide a data URL.","malformed_url");throw error;}
  if(url.protocol!=="data:")return fail("url","The URL must use the data scheme.","not_data_url");
  const comma=url.pathname.indexOf(",");if(comma<0)return fail("url","Data URL is missing its comma.","malformed_data_url");
  let metadata=url.pathname.slice(0,comma), payload=url.pathname.slice(comma+1)+url.search;
  const base64=/;base64$/i.test(metadata);if(base64)metadata=metadata.slice(0,-7);
  const mediaType=metadata===""?"text/plain;charset=US-ASCII":metadata.startsWith(";")?"text/plain"+metadata:metadata;
  const bytes:number[]=[];
  for(let i=0;i<payload.length;i++) {
    if(payload[i]==="%" && /^[0-9A-Fa-f]{2}$/.test(payload.slice(i+1,i+3))) {bytes.push(Number.parseInt(payload.slice(i+1,i+3),16));i+=2;}
    else {const point=payload.codePointAt(i);if(point===undefined)break;bytes.push(...utf8Encode(String.fromCodePoint(point)));if(point>0xffff)i++;}
  }
  let decoded:readonly number[]=bytes;
  if(base64) {
    const encoded=bytes.map(byte=>String.fromCharCode(byte)).join("").replace(/[\t\n\f\r ]/g,"");
    const padded=encoded.length%4===2?encoded+"==":encoded.length%4===3?encoded+"=":encoded;
    const result=decodeBase64Bytes(padded);if(!result)return fail("url","Invalid Base64 payload.","malformed_base64");decoded=result;
  }
  const output: UrlDataParserOutput = {mediaType,base64,bytes:decoded};
  if (!matchesToolJsonSchema(output, urlDataParserOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const urlDataParserTool = defineTool<UrlDataParserInput, UrlDataParserOutput>({
  id: "web/url-data-parser", title: "Data URL Parser", description: "Parse a data URL into its media-type declaration, Base64 flag, and decoded byte sequence without guessing a text encoding.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateUrlDataParser,
  inputSchema: urlDataParserInputSchema, outputSchema: urlDataParserOutputSchema,
  ports: {inputs: [{"id":"url","label":"Absolute data URL","description":"Absolute data URL.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"mediaType","label":"Declared media type or RFC 2397 default","description":"Declared media type or RFC 2397 default.","valueType":{"type":"string"}},{"id":"base64","label":"Whether Base64 encoding was declared","description":"Whether Base64 encoding was declared.","valueType":{"type":"boolean"}},{"id":"bytes","label":"Decoded payload bytes","description":"Decoded payload bytes.","valueType":{"type":"list","items":{"type":"integer"}}}]},
});
export const runUrlDataParser = urlDataParserTool.execute;
export const example = {"input":{"url":"data:text/plain;base64,SGVsbG8="},"output":{"mediaType":"text/plain","base64":true,"bytes":[72,101,108,108,111]}} satisfies ToolExample<UrlDataParserInput, UrlDataParserOutput>;
export default urlDataParserTool;
