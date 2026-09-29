import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ crossoverProbability: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "crossoverProbability",
    label: "Crossover probability",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.crossoverProbability, 0, 1);
  return H.finish({
    complementaryCrossoverProbability: 1 - i.crossoverProbability,
    symmetryRepresentative: Math.min(
      i.crossoverProbability,
      1 - i.crossoverProbability,
    ),
    outputRelabelingRequired: i.crossoverProbability > 0.5,
  });
};
export const example = {
  input: { crossoverProbability: 0.75 },
  output: {
    result: {
      complementaryCrossoverProbability: 0.25,
      symmetryRepresentative: 0.25,
      outputRelabelingRequired: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "information/binary-channel-crossover-symmetry",
  title: "Information: Binary Channel Crossover Symmetry Tool",
  description:
    "Report the output-relabeling symmetry of a binary symmetric channel crossover probability, not its capacity or a fitted channel.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          complementaryCrossoverProbability: { type: "number" },
          outputRelabelingRequired: { type: "boolean" },
          symmetryRepresentative: { type: "number" },
        },
        required: [
          "complementaryCrossoverProbability",
          "outputRelabelingRequired",
          "symmetryRepresentative",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
