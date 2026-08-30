import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://html.spec.whatwg.org/multipage/server-sent-events.html#event-stream-interpretation
export type SseEventParserInput = {
  readonly stream: string;
};
export type SseEventParserOutput = {
  readonly events: readonly {readonly event:string;readonly data:string;readonly id:string}[];
  readonly lastEventId: string;
  readonly retryMs: number | null;
};
export const sseEventParserInputSchema = {"type":"object","additionalProperties":false,"properties":{"stream":{"type":"string","maxLength":1000000,"description":"Complete decoded UTF-8 event stream."}},"required":["stream"]} as const satisfies ToolJsonSchema;
export const sseEventParserOutputSchema = {"type":"object","additionalProperties":false,"properties":{"events":{"type":"array","items":{"type":"object","additionalProperties":false,"properties":{"event":{"type":"string","maxLength":1000000},"data":{"type":"string","maxLength":1000000},"id":{"type":"string","maxLength":1000000}},"required":["event","data","id"]},"minItems":0,"maxItems":100000,"description":"Dispatched events."},"lastEventId":{"type":"string","maxLength":1000000,"description":"Most recent valid event ID."},"retryMs":{"anyOf":[{"type":"integer","minimum":0},{"type":"null"}],"description":"Last safe reconnection interval, or null if no valid retry was supplied."}},"required":["events","lastEventId","retryMs"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);

export const calculateSseEventParser = (input: unknown): ToolResult<SseEventParserOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = sseEventParserInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, sseEventParserInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["stream"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: SseEventParserInput = {
    stream: values.stream as string
  };
  const events:{event:string;data:string;id:string}[]=[];
  let id="", event="",data:string[]=[],retryMs:number|null=null;
  const lines=x.stream.replace(/^\ufeff/,"").split(/\r\n|\r|\n/);
  // split creates a trailing fragment; only real terminated lines are processed.
  const count=lines.length-1;
  for(let i=0;i<count;i++) {
    const line=lines[i];
    if(line==="") {if(data.length>0)events.push({event:event||"message",data:data.join("\n"),id});data=[];event="";continue;}
    if(line.startsWith(":"))continue;const colon=line.indexOf(":"),name=colon<0?line:line.slice(0,colon);let value=colon<0?"":line.slice(colon+1);if(value.startsWith(" "))value=value.slice(1);
    if(name==="data")data.push(value);else if(name==="event")event=value;else if(name==="id"&&!value.includes("\0"))id=value;
    else if(name==="retry"&&/^\d+$/.test(value)&&Number.isSafeInteger(Number(value)))retryMs=Number(value);
  }
  const output: SseEventParserOutput = {events,lastEventId:id,retryMs};
  if (!matchesToolJsonSchema(output, sseEventParserOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const sseEventParserTool = defineTool<SseEventParserInput, SseEventParserOutput>({
  id: "web/sse-event-parser", title: "Server-Sent Event Parser", description: "Parse a complete Unicode event stream into dispatched events, preserving last-event IDs and discarding an unterminated final event.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateSseEventParser,
  inputSchema: sseEventParserInputSchema, outputSchema: sseEventParserOutputSchema,
  ports: {inputs: [{"id":"stream","label":"Complete decoded UTF-8 event stream","description":"Complete decoded UTF-8 event stream.","valueType":{"type":"string"},"required":true}], outputs: [{"id":"events","label":"Dispatched events","description":"Dispatched events.","valueType":{"type":"list","items":{"type":"object"}}},{"id":"lastEventId","label":"Most recent valid event ID","description":"Most recent valid event ID.","valueType":{"type":"string"}},{"id":"retryMs","label":"Last safe reconnection interval, or null if no valid retry was supplied","description":"Last safe reconnection interval, or null if no valid retry was supplied.","valueType":{"format":"nullable/integer","type":"integer"}}]},
});
export const runSseEventParser = sseEventParserTool.execute;
export const example = {"input":{"stream":"id: 7\nevent: update\ndata: first\ndata: second\n\nretry: 1500\n\n"},"output":{"events":[{"event":"update","data":"first\nsecond","id":"7"}],"lastEventId":"7","retryMs":1500}} satisfies ToolExample<SseEventParserInput, SseEventParserOutput>;
export default sseEventParserTool;
