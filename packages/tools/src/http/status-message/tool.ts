import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

// Method reference: https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
export type StatusMessageInput = {
  readonly status: number;
};
export type StatusMessageOutput = {
  readonly message: string;
  readonly known: boolean;
};
export const statusMessageInputSchema = {"type":"object","additionalProperties":false,"properties":{"status":{"type":"integer","minimum":100,"maximum":599,"description":"HTTP status code."}},"required":["status"]} as const satisfies ToolJsonSchema;
export const statusMessageOutputSchema = {"type":"object","additionalProperties":false,"properties":{"message":{"type":"string","maxLength":1000000,"description":"Registry description, empty for an unassigned code."},"known":{"type":"boolean","description":"Whether the snapshot assigns this status."}},"required":["message","known"]} as const satisfies ToolJsonSchema;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const fail = (field: string, message: string, code = "invalid_value"): ToolResult<never> =>
  invalidInput([{code, field, message}]);
const statusDescriptions: Readonly<Record<number,string>> = {"100":"Continue","101":"Switching Protocols","102":"Processing","103":"Early Hints","104":"Upload Resumption Supported","200":"OK","201":"Created","202":"Accepted","203":"Non-Authoritative Information","204":"No Content","205":"Reset Content","206":"Partial Content","207":"Multi-Status","208":"Already Reported","226":"IM Used","300":"Multiple Choices","301":"Moved Permanently","302":"Found","303":"See Other","304":"Not Modified","305":"Use Proxy","306":"(Unused)","307":"Temporary Redirect","308":"Permanent Redirect","400":"Bad Request","401":"Unauthorized","402":"Payment Required","403":"Forbidden","404":"Not Found","405":"Method Not Allowed","406":"Not Acceptable","407":"Proxy Authentication Required","408":"Request Timeout","409":"Conflict","410":"Gone","411":"Length Required","412":"Precondition Failed","413":"Content Too Large","414":"URI Too Long","415":"Unsupported Media Type","416":"Range Not Satisfiable","417":"Expectation Failed","418":"(Unused)","421":"Misdirected Request","422":"Unprocessable Content","423":"Locked","424":"Failed Dependency","425":"Too Early","426":"Upgrade Required","428":"Precondition Required","429":"Too Many Requests","431":"Request Header Fields Too Large","451":"Unavailable For Legal Reasons","500":"Internal Server Error","501":"Not Implemented","502":"Bad Gateway","503":"Service Unavailable","504":"Gateway Timeout","505":"HTTP Version Not Supported","506":"Variant Also Negotiates","507":"Insufficient Storage","508":"Loop Detected","510":"Not Extended","511":"Network Authentication Required"};
export const calculateStatusMessage = (input: unknown): ToolResult<StatusMessageOutput> => {
  if (!isRecord(input))
    return fail("", "Input must be an object.", "object_required");
  const values: Readonly<Record<string, unknown>> = input;
  const schemas: Readonly<Record<string, ToolJsonSchema>> = statusMessageInputSchema.properties;
  for (const key of Object.keys(input))
    if (!Object.hasOwn(schemas, key)) return fail(key, "This input field is not supported.", "unknown_field");
  if (!matchesToolJsonSchema(input, statusMessageInputSchema)) {
    for (const [field, schema] of Object.entries(schemas))
      if ((["status"].includes(field) || Object.hasOwn(input, field)) &&
          !matchesToolJsonSchema(Reflect.get(input, field), schema))
        return fail(field, "Provide a value matching the field's schema.", "invalid_field");
    return fail("", "Input does not match the declared schema.", "invalid_input");
  }
  const x: StatusMessageInput = {
    status: values.status as number
  };
  const message=statusDescriptions[x.status] ?? "";
  const output: StatusMessageOutput = {message,known:message!==""};
  if (!matchesToolJsonSchema(output, statusMessageOutputSchema))
    return fail("", "The result cannot be represented by the output schema.", "invalid_output");
  return toolSuccess(output);
};
export const statusMessageTool = defineTool<StatusMessageInput, StatusMessageOutput>({
  id: "http/status-message", title: "HTTP Status Message", description: "Look up a status-code description in the IANA 2025-09-15 registry snapshot, with an explicit unknown result for unassigned codes.", contractVersion: 1,
  execution: {kind: "pure"}, execute: calculateStatusMessage,
  inputSchema: statusMessageInputSchema, outputSchema: statusMessageOutputSchema,
  ports: {inputs: [{"id":"status","label":"HTTP status code","description":"HTTP status code.","valueType":{"type":"integer"},"required":true}], outputs: [{"id":"message","label":"Registry description, empty for an unassigned code","description":"Registry description, empty for an unassigned code.","valueType":{"type":"string"}},{"id":"known","label":"Whether the snapshot assigns this status","description":"Whether the snapshot assigns this status.","valueType":{"type":"boolean"}}]},
});
export const runStatusMessage = statusMessageTool.execute;
export const example = {"input":{"status":422},"output":{"message":"Unprocessable Content","known":true}} satisfies ToolExample<StatusMessageInput, StatusMessageOutput>;
export default statusMessageTool;
