import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly diameterMm: number;
  readonly minusMm: number;
  readonly plusMm: number;
};
export type Output = {
  readonly phi: number;
  readonly lowerPhi: number;
  readonly upperPhi: number;
  readonly phiWidth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diameterMm: { type: "number", exclusiveMinimum: 0 },
    minusMm: { type: "number", minimum: 0 },
    plusMm: { type: "number", minimum: 0 },
  },
  required: ["diameterMm", "minusMm", "plusMm"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phi: { type: "number" },
    lowerPhi: { type: "number" },
    upperPhi: { type: "number" },
    phiWidth: { type: "number" },
  },
  required: ["phi", "lowerPhi", "upperPhi", "phiWidth"],
} as const;
/** Exact asymmetric uncertainty transform under phi=-log2(diameter in mm), with reversed interval order. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { diameterMm, minusMm, plusMm } = request;
  const compute = (): Output => {
    H.positive(diameterMm);
    H.domain(minusMm >= 0 && minusMm < diameterMm && plusMm >= 0);
    return {
      phi: -Math.log2(diameterMm),
      lowerPhi: -Math.log2(diameterMm + plusMm),
      upperPhi: -Math.log2(diameterMm - minusMm),
      phiWidth: Math.log2((diameterMm + plusMm) / (diameterMm - minusMm)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { diameterMm: 2, minusMm: 1, plusMm: 2 },
  output: { phi: -1, lowerPhi: -2, upperPhi: 0, phiWidth: 2 },
} satisfies ToolExample<Input, Output>;
export const grainSizePhiUncertaintyWidthTransformTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geomorphology/grain-size-phi-uncertainty-width-transform",
      title: "Grain Size Phi Uncertainty Width Transform Tool",
      description:
        "Exact asymmetric uncertainty transform under phi=-log2(diameter in mm), with reversed interval order.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          diameterMm: { type: "number", exclusiveMinimum: 0 },
          minusMm: { type: "number", minimum: 0 },
          plusMm: { type: "number", minimum: 0 },
        },
        required: ["diameterMm", "minusMm", "plusMm"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          phi: { type: "number" },
          lowerPhi: { type: "number" },
          upperPhi: { type: "number" },
          phiWidth: { type: "number" },
        },
        required: ["phi", "lowerPhi", "upperPhi", "phiWidth"],
      },
      ports: {
        inputs: [
          {
            id: "diameterMm",
            label: "Diameter Mm",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "minusMm",
            label: "Minus Mm",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "plusMm",
            label: "Plus Mm",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "phi", label: "Phi", valueType: { type: "number" } },
          { id: "lowerPhi", label: "Lower Phi", valueType: { type: "number" } },
          { id: "upperPhi", label: "Upper Phi", valueType: { type: "number" } },
          { id: "phiWidth", label: "Phi Width", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = grainSizePhiUncertaintyWidthTransformTool.execute;
export default grainSizePhiUncertaintyWidthTransformTool;
