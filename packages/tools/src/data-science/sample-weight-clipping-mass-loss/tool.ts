import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly weight: number;
  readonly cap: number;
  readonly totalWeight: number;
};
export type Output = {
  readonly clipped: number;
  readonly lostMass: number;
  readonly lostTotalFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weight: { type: "number", minimum: 0 },
    cap: { type: "number", minimum: 0 },
    totalWeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["weight", "cap", "totalWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clipped: { type: "number" },
    lostMass: { type: "number" },
    lostTotalFraction: { type: "number" },
  },
  required: ["clipped", "lostMass", "lostTotalFraction"],
} as const;
/** Calculate sample weight clipping mass loss from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weight, cap, totalWeight } = request;
  const compute = (): Output => {
    H.domain(weight >= 0 && cap >= 0);
    H.positive(totalWeight);
    H.domain(weight <= totalWeight);
    return {
      clipped: Math.min(weight, cap),
      lostMass: Math.max(0, weight - cap),
      lostTotalFraction: Math.max(0, weight - cap) / totalWeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { weight: 12, cap: 5, totalWeight: 100 },
  output: { clipped: 5, lostMass: 7, lostTotalFraction: 0.07 },
} satisfies ToolExample<Input, Output>;
export const sampleWeightClippingMassLossTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/sample-weight-clipping-mass-loss",
    title: "Sample Weight Clipping Mass Loss Tool",
    description:
      "Calculate sample weight clipping mass loss from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weight: { type: "number", minimum: 0 },
        cap: { type: "number", minimum: 0 },
        totalWeight: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["weight", "cap", "totalWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        clipped: { type: "number" },
        lostMass: { type: "number" },
        lostTotalFraction: { type: "number" },
      },
      required: ["clipped", "lostMass", "lostTotalFraction"],
    },
    ports: {
      inputs: [
        {
          id: "weight",
          label: "Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cap",
          label: "Cap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalWeight",
          label: "Total Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "clipped", label: "Clipped", valueType: { type: "number" } },
        { id: "lostMass", label: "Lost Mass", valueType: { type: "number" } },
        {
          id: "lostTotalFraction",
          label: "Lost Total Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sampleWeightClippingMassLossTool.execute;
export default sampleWeightClippingMassLossTool;
