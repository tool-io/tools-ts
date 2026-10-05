import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signalTimestampSeconds: number;
  readonly responseTimestampSeconds: number;
};
export type Output = { readonly delaySeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signalTimestampSeconds: { type: "number" },
    responseTimestampSeconds: { type: "number" },
  },
  required: ["signalTimestampSeconds", "responseTimestampSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { delaySeconds: { type: "number" } },
  required: ["delaySeconds"],
} as const;
/** Measure a recorded protective-drill signal-to-response interval on one shared time scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signalTimestampSeconds, responseTimestampSeconds } = request;
  const compute = (): Output => {
    H.domain(
      responseTimestampSeconds >= signalTimestampSeconds,
      "responseTimestampSeconds",
    );
    return { delaySeconds: responseTimestampSeconds - signalTimestampSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signalTimestampSeconds: 100, responseTimestampSeconds: 112 },
  output: { delaySeconds: 12 },
} satisfies ToolExample<Input, Output>;
export const protectiveDrillResponseDelayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "security-studies/protective-drill-response-delay",
    title: "Protective Drill Response Delay Tool",
    description:
      "Measure a recorded protective-drill signal-to-response interval on one shared time scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signalTimestampSeconds: { type: "number" },
        responseTimestampSeconds: { type: "number" },
      },
      required: ["signalTimestampSeconds", "responseTimestampSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { delaySeconds: { type: "number" } },
      required: ["delaySeconds"],
    },
    ports: {
      inputs: [
        {
          id: "signalTimestampSeconds",
          label: "Signal Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "responseTimestampSeconds",
          label: "Response Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "delaySeconds",
          label: "Delay Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = protectiveDrillResponseDelayTool.execute;
export default protectiveDrillResponseDelayTool;
