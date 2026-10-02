import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedDepth: number;
  readonly quantum: number;
  readonly repeatabilityHalfWidth: number;
};
export type Output = {
  readonly resolutionHalfWidth: number;
  readonly lower: number;
  readonly upper: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedDepth: { type: "number" },
    quantum: { type: "number", minimum: 0 },
    repeatabilityHalfWidth: { type: "number", minimum: 0 },
  },
  required: ["recordedDepth", "quantum", "repeatabilityHalfWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resolutionHalfWidth: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
  },
  required: ["resolutionHalfWidth", "lower", "upper"],
} as const;
/** Bound a supplied research depth using nearest-step resolution plus an independently supplied bounded repeatability term; no disease grading. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedDepth, quantum, repeatabilityHalfWidth } = request;
  const compute = (): Output => {
    H.domain(quantum >= 0 && repeatabilityHalfWidth >= 0);
    return {
      resolutionHalfWidth: quantum / 2,
      lower: recordedDepth - quantum / 2 - repeatabilityHalfWidth,
      upper: recordedDepth + quantum / 2 + repeatabilityHalfWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedDepth: 3, quantum: 1, repeatabilityHalfWidth: 0.25 },
  output: { resolutionHalfWidth: 0.5, lower: 2.25, upper: 3.75 },
} satisfies ToolExample<Input, Output>;
export const researchSiteDepthResolutionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "periodontology/research-site-depth-resolution",
    title: "Research Site Depth Resolution Tool",
    description:
      "Bound a supplied research depth using nearest-step resolution plus an independently supplied bounded repeatability term; no disease grading.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedDepth: { type: "number" },
        quantum: { type: "number", minimum: 0 },
        repeatabilityHalfWidth: { type: "number", minimum: 0 },
      },
      required: ["recordedDepth", "quantum", "repeatabilityHalfWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resolutionHalfWidth: { type: "number" },
        lower: { type: "number" },
        upper: { type: "number" },
      },
      required: ["resolutionHalfWidth", "lower", "upper"],
    },
    ports: {
      inputs: [
        {
          id: "recordedDepth",
          label: "Recorded Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantum",
          label: "Quantum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "repeatabilityHalfWidth",
          label: "Repeatability Half Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "resolutionHalfWidth",
          label: "Resolution Half Width",
          valueType: { type: "number" },
        },
        { id: "lower", label: "Lower", valueType: { type: "number" } },
        { id: "upper", label: "Upper", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = researchSiteDepthResolutionTool.execute;
export default researchSiteDepthResolutionTool;
