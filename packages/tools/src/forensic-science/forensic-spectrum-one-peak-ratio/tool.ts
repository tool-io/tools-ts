import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly targetPeak: number;
  readonly referencePeak: number;
  readonly targetBaseline: number;
  readonly referenceBaseline: number;
};
export type Output = {
  readonly correctedTarget: number;
  readonly correctedReference: number;
  readonly ratio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetPeak: { type: "number" },
    referencePeak: { type: "number" },
    targetBaseline: { type: "number" },
    referenceBaseline: { type: "number" },
  },
  required: [
    "targetPeak",
    "referencePeak",
    "targetBaseline",
    "referenceBaseline",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedTarget: { type: "number" },
    correctedReference: { type: "number" },
    ratio: { type: "number" },
  },
  required: ["correctedTarget", "correctedReference", "ratio"],
} as const;
/** Baseline-corrected peak ratio with explicit baselines, without a material-identification or likelihood interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { targetPeak, referencePeak, targetBaseline, referenceBaseline } =
    request;
  const compute = (): Output => {
    H.domain(referencePeak !== referenceBaseline);
    return {
      correctedTarget: targetPeak - targetBaseline,
      correctedReference: referencePeak - referenceBaseline,
      ratio:
        (targetPeak - targetBaseline) / (referencePeak - referenceBaseline),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    targetPeak: 12,
    referencePeak: 7,
    targetBaseline: 2,
    referenceBaseline: 2,
  },
  output: { correctedTarget: 10, correctedReference: 5, ratio: 2 },
} satisfies ToolExample<Input, Output>;
export const forensicSpectrumOnePeakRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "forensic-science/forensic-spectrum-one-peak-ratio",
    title: "Forensic Spectrum One Peak Ratio Tool",
    description:
      "Baseline-corrected peak ratio with explicit baselines, without a material-identification or likelihood interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetPeak: { type: "number" },
        referencePeak: { type: "number" },
        targetBaseline: { type: "number" },
        referenceBaseline: { type: "number" },
      },
      required: [
        "targetPeak",
        "referencePeak",
        "targetBaseline",
        "referenceBaseline",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedTarget: { type: "number" },
        correctedReference: { type: "number" },
        ratio: { type: "number" },
      },
      required: ["correctedTarget", "correctedReference", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "targetPeak",
          label: "Target Peak",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePeak",
          label: "Reference Peak",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetBaseline",
          label: "Target Baseline",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceBaseline",
          label: "Reference Baseline",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedTarget",
          label: "Corrected Target",
          valueType: { type: "number" },
        },
        {
          id: "correctedReference",
          label: "Corrected Reference",
          valueType: { type: "number" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = forensicSpectrumOnePeakRatioTool.execute;
export default forensicSpectrumOnePeakRatioTool;
