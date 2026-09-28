import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDiameter: number;
  readonly secondDiameter: number;
};
export type Output = { readonly phiDifference: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDiameter: { type: "number", exclusiveMinimum: 0 },
    secondDiameter: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstDiameter", "secondDiameter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { phiDifference: { type: "number" } },
  required: ["phiDifference"],
} as const;
/** Compute the phi-scale change −log2(d2/d1) for compatible positive grain diameters. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDiameter, secondDiameter } = request;
  const compute = (): Output => {
    H.positive(firstDiameter);
    H.positive(secondDiameter);
    const r = (firstDiameter - secondDiameter) / secondDiameter;
    return {
      phiDifference:
        Number.isFinite(r) && r > -1
          ? Math.log1p(r) / Math.LN2
          : Math.log2(firstDiameter) - Math.log2(secondDiameter),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstDiameter: 2, secondDiameter: 1 },
  output: { phiDifference: 1 },
} satisfies ToolExample<Input, Output>;
export const grainSizePhiStepTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "geomorphology/grain-size-phi-step",
    title: "Grain Size Phi Step Tool",
    description:
      "Compute the phi-scale change −log2(d2/d1) for compatible positive grain diameters.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDiameter: { type: "number", exclusiveMinimum: 0 },
        secondDiameter: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstDiameter", "secondDiameter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { phiDifference: { type: "number" } },
      required: ["phiDifference"],
    },
    ports: {
      inputs: [
        {
          id: "firstDiameter",
          label: "First Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDiameter",
          label: "Second Diameter",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "phiDifference",
          label: "Phi Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = grainSizePhiStepTool.execute;
export default grainSizePhiStepTool;
