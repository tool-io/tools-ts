import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly probabilities: readonly number[];
  readonly expectedMass: number;
};
export type Output = { readonly mass: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probabilities: { type: "array", maxItems: 256, items: { type: "number" } },
    expectedMass: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["probabilities", "expectedMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { mass: { type: "number" }, gap: { type: "number" } },
  required: ["mass", "gap"],
} as const;
/** Calculate cell state probability mass gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { probabilities, expectedMass } = request;
  const compute = (): Output => {
    H.domain(
      probabilities.every((x) => x >= 0 && x <= 1) &&
        expectedMass >= 0 &&
        expectedMass <= 1,
    );
    return {
      mass: probabilities.reduce((a, b) => a + b, 0),
      gap: probabilities.reduce((a, b) => a + b, 0) - expectedMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { probabilities: [0.25, 0.5], expectedMass: 1 },
  output: { mass: 0.75, gap: -0.25 },
} satisfies ToolExample<Input, Output>;
export const cellStateProbabilityMassGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-biology/cell-state-probability-mass-gap",
    title: "Cell State Probability Mass Gap Tool",
    description:
      "Calculate cell state probability mass gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        probabilities: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        expectedMass: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["probabilities", "expectedMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { mass: { type: "number" }, gap: { type: "number" } },
      required: ["mass", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "probabilities",
          label: "Probabilities",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "expectedMass",
          label: "Expected Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "mass", label: "Mass", valueType: { type: "number" } },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cellStateProbabilityMassGapTool.execute;
export default cellStateProbabilityMassGapTool;
