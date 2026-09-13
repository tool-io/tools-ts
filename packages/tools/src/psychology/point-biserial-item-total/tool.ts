import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualCorrectGroupMean: number;
  readonly actualIncorrectGroupMean: number;
  readonly actualTotalScorePopulationSd: number;
  readonly actualCorrectFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCorrectGroupMean",
    label: "Actual correct group mean",
    kind: "number",
  },
  {
    id: "actualIncorrectGroupMean",
    label: "Actual incorrect group mean",
    kind: "number",
  },
  {
    id: "actualTotalScorePopulationSd",
    label: "Actual total score population sd",
    kind: "number",
  },
  {
    id: "actualCorrectFraction",
    label: "Actual correct fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualTotalScorePopulationSd, "actualTotalScorePopulationSd");
  fraction(input.actualCorrectFraction, "actualCorrectFraction");
  return {
    value:
      ((input.actualCorrectGroupMean - input.actualIncorrectGroupMean) /
        input.actualTotalScorePopulationSd) *
      Math.sqrt(
        input.actualCorrectFraction * (1 - input.actualCorrectFraction),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualCorrectGroupMean: 3,
    actualIncorrectGroupMean: 1,
    actualTotalScorePopulationSd: 2,
    actualCorrectFraction: 0.5,
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/point-biserial-item-total",
  title: "Point-Biserial Item-Total Correlation Calculator",
  description:
    "Point biserial from actual conditional means, POPU lationtotal-scoreSD, and correct fraction; item excluded/total convention independent. Not ordinary sample SD substitution. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
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
