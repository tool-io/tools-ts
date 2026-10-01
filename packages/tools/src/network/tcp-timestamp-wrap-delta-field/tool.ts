import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly previous: number; readonly current: number };
export type Output = { readonly delta: number; readonly ambiguous: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previous: { type: "integer", minimum: 0, maximum: 4294967295 },
    current: { type: "integer", minimum: 0, maximum: 4294967295 },
  },
  required: ["previous", "current"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { delta: { type: "integer" }, ambiguous: { type: "boolean" } },
  required: ["delta", "ambiguous"],
} as const;
/** Calculate tcp timestamp wrap delta field from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previous, current } = request;
  const compute = (): Output => {
    H.integer(previous, 0, 4294967295);
    H.integer(current, 0, 4294967295);
    const delta = H.mod(current - previous, 4294967296);
    return { delta, ambiguous: delta >= 2147483648 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previous: 4294967290, current: 4 },
  output: { delta: 10, ambiguous: false },
} satisfies ToolExample<Input, Output>;
export const tcpTimestampWrapDeltaFieldTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "network/tcp-timestamp-wrap-delta-field",
    title: "TCP Timestamp Wrap Delta Field Tool",
    description:
      "Calculate tcp timestamp wrap delta field from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previous: { type: "integer", minimum: 0, maximum: 4294967295 },
        current: { type: "integer", minimum: 0, maximum: 4294967295 },
      },
      required: ["previous", "current"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        delta: { type: "integer" },
        ambiguous: { type: "boolean" },
      },
      required: ["delta", "ambiguous"],
    },
    ports: {
      inputs: [
        {
          id: "previous",
          label: "Previous",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "current",
          label: "Current",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "delta", label: "Delta", valueType: { type: "integer" } },
        { id: "ambiguous", label: "Ambiguous", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = tcpTimestampWrapDeltaFieldTool.execute;
export default tcpTimestampWrapDeltaFieldTool;
