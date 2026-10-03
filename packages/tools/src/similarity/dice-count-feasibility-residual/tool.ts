import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly intersection: number;
  readonly leftSize: number;
  readonly rightSize: number;
};
export type Output = {
  readonly feasible: boolean;
  readonly excess: number;
  readonly denominator: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intersection: { type: "integer", minimum: 0 },
    leftSize: { type: "integer", minimum: 0 },
    rightSize: { type: "integer", minimum: 0 },
  },
  required: ["intersection", "leftSize", "rightSize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    feasible: { type: "boolean" },
    excess: { type: "integer" },
    denominator: { type: "integer" },
  },
  required: ["feasible", "excess", "denominator"],
} as const;
/** Compute dice count feasibility residual from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { intersection, leftSize, rightSize } = input;
  const compute = (): Output => {
    integer(intersection);
    integer(leftSize);
    integer(rightSize);
    const excess = Math.max(0, intersection - Math.min(leftSize, rightSize));
    return {
      feasible: excess === 0,
      excess,
      denominator: leftSize + rightSize,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { intersection: 3, leftSize: 2, rightSize: 5 },
  output: { feasible: false, excess: 1, denominator: 7 },
} satisfies ToolExample<Input, Output>;
export const diceCountFeasibilityResidualTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "similarity/dice-count-feasibility-residual",
  title: "Dice Count Feasibility Residual Tool",
  description:
    "Compute dice count feasibility residual from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "intersection",
        label: "Intersection",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "leftSize",
        label: "Left Size",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "rightSize",
        label: "Right Size",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "feasible", label: "Feasible", valueType: { type: "boolean" } },
      { id: "excess", label: "Excess", valueType: { type: "integer" } },
      {
        id: "denominator",
        label: "Denominator",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = diceCountFeasibilityResidualTool.execute;
export default diceCountFeasibilityResidualTool;
