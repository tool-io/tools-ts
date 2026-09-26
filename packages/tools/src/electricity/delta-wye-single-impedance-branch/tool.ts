import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly adjacentFirst: number;
  readonly adjacentSecond: number;
  readonly opposite: number;
};
export type Output = { readonly branch: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    adjacentFirst: { type: "number" },
    adjacentSecond: { type: "number" },
    opposite: { type: "number" },
  },
  required: ["adjacentFirst", "adjacentSecond", "opposite"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { branch: { type: "number" } },
  required: ["branch"],
} as const;
/** Convert one real-valued delta branch pair to its wye branch using the sum of all three delta impedances. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { adjacentFirst, adjacentSecond, opposite } = input;
  const compute = (): Output => {
    const sum = adjacentFirst + adjacentSecond + opposite;
    H.domain(sum !== 0);
    return { branch: (adjacentFirst * adjacentSecond) / sum };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { adjacentFirst: 3, adjacentSecond: 6, opposite: 9 },
  output: { branch: 1 },
} satisfies ToolExample<Input, Output>;
export const deltaWyeSingleImpedanceBranchTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/delta-wye-single-impedance-branch",
    title: "Delta Wye Single Impedance Branch Tool",
    description:
      "Convert one real-valued delta branch pair to its wye branch using the sum of all three delta impedances.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        adjacentFirst: { type: "number" },
        adjacentSecond: { type: "number" },
        opposite: { type: "number" },
      },
      required: ["adjacentFirst", "adjacentSecond", "opposite"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { branch: { type: "number" } },
      required: ["branch"],
    },
    ports: {
      inputs: [
        {
          id: "adjacentFirst",
          label: "Adjacent First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "adjacentSecond",
          label: "Adjacent Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "opposite",
          label: "Opposite",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "branch", label: "Branch", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = deltaWyeSingleImpedanceBranchTool.execute;
export default deltaWyeSingleImpedanceBranchTool;
