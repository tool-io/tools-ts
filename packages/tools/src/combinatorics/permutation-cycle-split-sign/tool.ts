import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalCycleCount: number;
  readonly resultingCycleCount: number;
};
export type Output = {
  readonly cycleCountChange: number;
  readonly relativeSign: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalCycleCount: { type: "integer", minimum: 0 },
    resultingCycleCount: { type: "integer", minimum: 0 },
  },
  required: ["originalCycleCount", "resultingCycleCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cycleCountChange: { type: "integer" },
    relativeSign: { type: "integer" },
  },
  required: ["cycleCountChange", "relativeSign"],
} as const;
/** Relative permutation sign from a supplied change in cycle count on the same underlying elements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalCycleCount, resultingCycleCount } = request;
  const compute = (): Output => {
    H.integer(originalCycleCount, 0);
    H.integer(resultingCycleCount, 0);
    return {
      cycleCountChange: resultingCycleCount - originalCycleCount,
      relativeSign:
        Math.abs(resultingCycleCount - originalCycleCount) % 2 === 0 ? 1 : -1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { originalCycleCount: 1, resultingCycleCount: 2 },
  output: { cycleCountChange: 1, relativeSign: -1 },
} satisfies ToolExample<Input, Output>;
export const permutationCycleSplitSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "combinatorics/permutation-cycle-split-sign",
    title: "Permutation Cycle Split Sign Tool",
    description:
      "Relative permutation sign from a supplied change in cycle count on the same underlying elements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalCycleCount: { type: "integer", minimum: 0 },
        resultingCycleCount: { type: "integer", minimum: 0 },
      },
      required: ["originalCycleCount", "resultingCycleCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cycleCountChange: { type: "integer" },
        relativeSign: { type: "integer" },
      },
      required: ["cycleCountChange", "relativeSign"],
    },
    ports: {
      inputs: [
        {
          id: "originalCycleCount",
          label: "Original Cycle Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "resultingCycleCount",
          label: "Resulting Cycle Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "cycleCountChange",
          label: "Cycle Count Change",
          valueType: { type: "integer" },
        },
        {
          id: "relativeSign",
          label: "Relative Sign",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = permutationCycleSplitSignTool.execute;
export default permutationCycleSplitSignTool;
