import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly solutionMass: number;
  readonly suppliedSolidsPercent: number;
};
export type Output = {
  readonly solidsMass: number;
  readonly remainingMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    solutionMass: { type: "number", minimum: 0 },
    suppliedSolidsPercent: { type: "number", minimum: 0, maximum: 100 },
  },
  required: ["solutionMass", "suppliedSolidsPercent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    solidsMass: { type: "number" },
    remainingMass: { type: "number" },
  },
  required: ["solidsMass", "remainingMass"],
} as const;
/** Mass calculation when the caller explicitly equates the supplied Brix reading with mass-percent solids. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { solutionMass, suppliedSolidsPercent } = request;
  const compute = (): Output => {
    H.domain(
      solutionMass >= 0 &&
        suppliedSolidsPercent >= 0 &&
        suppliedSolidsPercent <= 100,
    );
    return {
      solidsMass: (solutionMass * suppliedSolidsPercent) / 100,
      remainingMass: solutionMass * (1 - suppliedSolidsPercent / 100),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { solutionMass: 200, suppliedSolidsPercent: 15 },
  output: { solidsMass: 30, remainingMass: 170 },
} satisfies ToolExample<Input, Output>;
export const brixSuppliedSolidsMassFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-technology/brix-supplied-solids-mass-factor",
    title: "Brix Supplied Solids Mass Factor Tool",
    description:
      "Mass calculation when the caller explicitly equates the supplied Brix reading with mass-percent solids.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        solutionMass: { type: "number", minimum: 0 },
        suppliedSolidsPercent: { type: "number", minimum: 0, maximum: 100 },
      },
      required: ["solutionMass", "suppliedSolidsPercent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        solidsMass: { type: "number" },
        remainingMass: { type: "number" },
      },
      required: ["solidsMass", "remainingMass"],
    },
    ports: {
      inputs: [
        {
          id: "solutionMass",
          label: "Solution Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedSolidsPercent",
          label: "Supplied Solids Percent",
          required: true,
          valueType: { type: "number", unit: "%" },
        },
      ],
      outputs: [
        {
          id: "solidsMass",
          label: "Solids Mass",
          valueType: { type: "number" },
        },
        {
          id: "remainingMass",
          label: "Remaining Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = brixSuppliedSolidsMassFactorTool.execute;
export default brixSuppliedSolidsMassFactorTool;
