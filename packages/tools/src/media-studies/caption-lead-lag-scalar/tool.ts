import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly captionOnset: number;
  readonly speechOnset: number;
  readonly suppliedCaptionClockOffset: number;
};
export type Output = { readonly lag: number; readonly leads: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    captionOnset: { type: "number" },
    speechOnset: { type: "number" },
    suppliedCaptionClockOffset: { type: "number" },
  },
  required: ["captionOnset", "speechOnset", "suppliedCaptionClockOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lag: { type: "number" }, leads: { type: "boolean" } },
  required: ["lag", "leads"],
} as const;
/** Compare supplied caption/speech onset times after explicit clock normalization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { captionOnset, speechOnset, suppliedCaptionClockOffset } = request;
  const compute = (): Output => {
    return {
      lag: captionOnset - suppliedCaptionClockOffset - speechOnset,
      leads: captionOnset - suppliedCaptionClockOffset < speechOnset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { captionOnset: 12, speechOnset: 10, suppliedCaptionClockOffset: 1 },
  output: { lag: 1, leads: false },
} satisfies ToolExample<Input, Output>;
export const captionLeadLagScalarTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "media-studies/caption-lead-lag-scalar",
    title: "Caption Lead Lag Scalar Tool",
    description:
      "Compare supplied caption/speech onset times after explicit clock normalization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        captionOnset: { type: "number" },
        speechOnset: { type: "number" },
        suppliedCaptionClockOffset: { type: "number" },
      },
      required: ["captionOnset", "speechOnset", "suppliedCaptionClockOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { lag: { type: "number" }, leads: { type: "boolean" } },
      required: ["lag", "leads"],
    },
    ports: {
      inputs: [
        {
          id: "captionOnset",
          label: "Caption Onset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "speechOnset",
          label: "Speech Onset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCaptionClockOffset",
          label: "Supplied Caption Clock Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "lag", label: "Lag", valueType: { type: "number" } },
        { id: "leads", label: "Leads", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = captionLeadLagScalarTool.execute;
export default captionLeadLagScalarTool;
