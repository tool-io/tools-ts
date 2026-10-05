import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly priorityToken: string };
export type Output = {
  readonly priority: number;
  readonly facility: number;
  readonly severity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { priorityToken: { type: "string", maxLength: 8192 } },
  required: ["priorityToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    priority: { type: "integer" },
    facility: { type: "integer" },
    severity: { type: "integer" },
  },
  required: ["priority", "facility", "severity"],
} as const;
/** Parse exactly one RFC 5424 PRI token, with facility and severity numeric fields and no surrounding message. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { priorityToken } = request;
  const compute = (): Output => {
    H.domain(
      /^<(?:0|[1-9]\d{0,2})>(?![\s\S])/.test(priorityToken),
      "priorityToken",
    );
    const priority = Number(priorityToken.slice(1, -1));
    H.domain(priority >= 0 && priority <= 191, "priorityToken");
    return {
      priority,
      facility: Math.floor(priority / 8),
      severity: priority % 8,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { priorityToken: "<165>" },
  output: { priority: 165, facility: 20, severity: 5 },
} satisfies ToolExample<Input, Output>;
export const syslogPrivalSingleFieldTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "parse/syslog-prival-single-field",
    title: "Syslog Prival Single Field Tool",
    description:
      "Parse exactly one RFC 5424 PRI token, with facility and severity numeric fields and no surrounding message.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { priorityToken: { type: "string", maxLength: 8192 } },
      required: ["priorityToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        priority: { type: "integer" },
        facility: { type: "integer" },
        severity: { type: "integer" },
      },
      required: ["priority", "facility", "severity"],
    },
    ports: {
      inputs: [
        {
          id: "priorityToken",
          label: "Priority Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "priority", label: "Priority", valueType: { type: "integer" } },
        { id: "facility", label: "Facility", valueType: { type: "integer" } },
        { id: "severity", label: "Severity", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = syslogPrivalSingleFieldTool.execute;
export default syslogPrivalSingleFieldTool;
