import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredMass: number;
  readonly expectedMass: number;
};
export type Output = { readonly difference: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredMass: { type: "number", minimum: 0 },
    expectedMass: { type: "number", minimum: 0 },
  },
  required: ["measuredMass", "expectedMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { difference: { type: "number" } },
  required: ["difference"],
} as const;
/** Calculate expected yield mass difference from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredMass, expectedMass } = request;
  const compute = (): Output => {
    H.domain(measuredMass >= 0 && expectedMass >= 0);
    return { difference: measuredMass - expectedMass };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredMass: 98, expectedMass: 100 },
  output: { difference: -2 },
} satisfies ToolExample<Input, Output>;
export const expectedYieldMassDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gmp/expected-yield-mass-difference",
    title: "Expected Yield Mass Difference Tool",
    description:
      "Calculate expected yield mass difference from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredMass: { type: "number", minimum: 0 },
        expectedMass: { type: "number", minimum: 0 },
      },
      required: ["measuredMass", "expectedMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { difference: { type: "number" } },
      required: ["difference"],
    },
    ports: {
      inputs: [
        {
          id: "measuredMass",
          label: "Measured Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "expectedMass",
          label: "Expected Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = expectedYieldMassDifferenceTool.execute;
export default expectedYieldMassDifferenceTool;
