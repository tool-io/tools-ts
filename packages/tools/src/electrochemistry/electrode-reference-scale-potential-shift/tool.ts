import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredPotential: number;
  readonly sourceReferenceVsCommon: number;
  readonly targetReferenceVsCommon: number;
  readonly junctionCorrection: number;
};
export type Output = { readonly targetPotential: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredPotential: { type: "number" },
    sourceReferenceVsCommon: { type: "number" },
    targetReferenceVsCommon: { type: "number" },
    junctionCorrection: { type: "number" },
  },
  required: [
    "measuredPotential",
    "sourceReferenceVsCommon",
    "targetReferenceVsCommon",
    "junctionCorrection",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { targetPotential: { type: "number" } },
  required: ["targetPotential"],
} as const;
/** Convert electrode potentials using explicit reference offsets relative to the same common scale and an additive junction correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    measuredPotential,
    sourceReferenceVsCommon,
    targetReferenceVsCommon,
    junctionCorrection,
  } = request;
  const compute = (): Output => {
    return {
      targetPotential:
        measuredPotential +
        sourceReferenceVsCommon -
        targetReferenceVsCommon +
        junctionCorrection,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredPotential: 0.3,
    sourceReferenceVsCommon: 0.2,
    targetReferenceVsCommon: 0.1,
    junctionCorrection: -0.01,
  },
  output: { targetPotential: 0.39 },
} satisfies ToolExample<Input, Output>;
export const electrodeReferenceScalePotentialShiftTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electrochemistry/electrode-reference-scale-potential-shift",
      title: "Electrode Reference Scale Potential Shift Tool",
      description:
        "Convert electrode potentials using explicit reference offsets relative to the same common scale and an additive junction correction.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          measuredPotential: { type: "number" },
          sourceReferenceVsCommon: { type: "number" },
          targetReferenceVsCommon: { type: "number" },
          junctionCorrection: { type: "number" },
        },
        required: [
          "measuredPotential",
          "sourceReferenceVsCommon",
          "targetReferenceVsCommon",
          "junctionCorrection",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { targetPotential: { type: "number" } },
        required: ["targetPotential"],
      },
      ports: {
        inputs: [
          {
            id: "measuredPotential",
            label: "Measured Potential",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sourceReferenceVsCommon",
            label: "Source Reference Vs Common",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "targetReferenceVsCommon",
            label: "Target Reference Vs Common",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "junctionCorrection",
            label: "Junction Correction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "targetPotential",
            label: "Target Potential",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = electrodeReferenceScalePotentialShiftTool.execute;
export default electrodeReferenceScalePotentialShiftTool;
