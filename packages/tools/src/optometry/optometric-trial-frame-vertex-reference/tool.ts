import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lensPower: number;
  readonly lensToReferenceMeters: number;
};
export type Output = {
  readonly effectivePower: number;
  readonly denominator: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lensPower: { type: "number" },
    lensToReferenceMeters: { type: "number" },
  },
  required: ["lensPower", "lensToReferenceMeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectivePower: { type: "number" },
    denominator: { type: "number" },
  },
  required: ["effectivePower", "denominator"],
} as const;
/** Paraxial thin-lens vergence transfer F/(1-dF) through signed distance d, without a patient vertex-distance prescription. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lensPower, lensToReferenceMeters } = request;
  const compute = (): Output => {
    H.domain(1 - lensToReferenceMeters * lensPower !== 0);
    return {
      effectivePower: lensPower / (1 - lensToReferenceMeters * lensPower),
      denominator: 1 - lensToReferenceMeters * lensPower,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lensPower: 10, lensToReferenceMeters: 0.01 },
  output: { effectivePower: 11.11111111111111, denominator: 0.9 },
} satisfies ToolExample<Input, Output>;
export const optometricTrialFrameVertexReferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "optometry/optometric-trial-frame-vertex-reference",
      title: "Optometric Trial Frame Vertex Reference Tool",
      description:
        "Paraxial thin-lens vergence transfer F/(1-dF) through signed distance d, without a patient vertex-distance prescription.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lensPower: { type: "number" },
          lensToReferenceMeters: { type: "number" },
        },
        required: ["lensPower", "lensToReferenceMeters"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          effectivePower: { type: "number" },
          denominator: { type: "number" },
        },
        required: ["effectivePower", "denominator"],
      },
      ports: {
        inputs: [
          {
            id: "lensPower",
            label: "Lens Power",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lensToReferenceMeters",
            label: "Lens To Reference Meters",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "effectivePower",
            label: "Effective Power",
            valueType: { type: "number" },
          },
          {
            id: "denominator",
            label: "Denominator",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = optometricTrialFrameVertexReferenceTool.execute;
export default optometricTrialFrameVertexReferenceTool;
