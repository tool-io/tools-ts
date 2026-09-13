import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualRiasecScores: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRiasecScores",
    label: "Actual riasec scores",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.actualRiasecScores.length !== 6)
    simpleError("RIASEC", "Six independently scoredR, I, A, S, E, Cvalues.");
  const labels = ["R", "I", "A", "S", "E", "C"],
    ii = labels
      .map((_, i) => i)
      .sort(
        (a, b) =>
          input.actualRiasecScores[b] - input.actualRiasecScores[a] || a - b,
      );
  return {
    orderedTopThreeCode: ii
      .slice(0, 3)
      .map((i) => labels[i])
      .join(""),
    cutoffTiedLetters: ii
      .filter(
        (i) => input.actualRiasecScores[i] === input.actualRiasecScores[ii[2]],
      )
      .map((i) => labels[i]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualRiasecScores: [1, 2, 3, 4, 5, 6] },
  output: { result: { orderedTopThreeCode: "CES", cutoffTiedLetters: ["S"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/holland-code-riasec-top-three",
  title: "Holland RIASEC Top-Three Code Tool",
  description:
    "Independent Holland RIASEC score top three with stable RIASEC tie ordering and all third cutoff ties explicit, not a normed vocational recommendation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
