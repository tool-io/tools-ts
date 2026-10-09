import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestedOnset: number;
  readonly suppliedScanoutDelay: number;
};
export type Output = { readonly estimatedDisplayOnset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestedOnset: { type: "number" },
    suppliedScanoutDelay: { type: "number", minimum: 0 },
  },
  required: ["requestedOnset", "suppliedScanoutDelay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { estimatedDisplayOnset: { type: "number" } },
  required: ["estimatedDisplayOnset"],
} as const;
/** Add an explicitly supplied monitor scanout delay to a requested stimulus onset without measuring display latency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestedOnset, suppliedScanoutDelay } = request;
  const compute = (): Output => {
    H.domain(suppliedScanoutDelay >= 0, "suppliedScanoutDelay");
    return { estimatedDisplayOnset: requestedOnset + suppliedScanoutDelay };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requestedOnset: 100, suppliedScanoutDelay: 8 },
  output: { estimatedDisplayOnset: 108 },
} satisfies ToolExample<Input, Output>;
export const stimulusMonitorScanoutOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/stimulus-monitor-scanout-offset",
    title: "Stimulus Monitor Scanout Offset Tool",
    description:
      "Add an explicitly supplied monitor scanout delay to a requested stimulus onset without measuring display latency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestedOnset: { type: "number" },
        suppliedScanoutDelay: { type: "number", minimum: 0 },
      },
      required: ["requestedOnset", "suppliedScanoutDelay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { estimatedDisplayOnset: { type: "number" } },
      required: ["estimatedDisplayOnset"],
    },
    ports: {
      inputs: [
        {
          id: "requestedOnset",
          label: "Requested Onset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedScanoutDelay",
          label: "Supplied Scanout Delay",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "estimatedDisplayOnset",
          label: "Estimated Display Onset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = stimulusMonitorScanoutOffsetTool.execute;
export default stimulusMonitorScanoutOffsetTool;
