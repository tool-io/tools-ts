import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, aligned } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualAdvantageousDeckCountsByBlock: readonly number[];
  readonly actualDisadvantageousDeckCountsByBlock: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualAdvantageousDeckCountsByBlock",
    label: "Actual advantageous deck counts by block",
    kind: "numberList",
  },
  {
    id: "actualDisadvantageousDeckCountsByBlock",
    label: "Actual dis advantageous deck counts by block",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualAdvantageousDeckCountsByBlock,
    input.actualDisadvantageousDeckCountsByBlock,
    "blocks",
  );
  [
    ...input.actualAdvantageousDeckCountsByBlock,
    ...input.actualDisadvantageousDeckCountsByBlock,
  ].forEach((v) => bounded(v, "trials", 0, 1000000));
  return {
    observedNetScoresByBlock: input.actualAdvantageousDeckCountsByBlock.map(
      (v, i) => v - input.actualDisadvantageousDeckCountsByBlock[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualAdvantageousDeckCountsByBlock: [3, 4],
    actualDisadvantageousDeckCountsByBlock: [2, 5],
  },
  output: { result: { observedNetScoresByBlock: [1, -1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/igt-net-score-by-block",
  title: "IGT Net Score By Block Calculator",
  description:
    "Actual IowaGamblingTaskindependently coded advantageous minus dis advantageous deck counts per block, not infer adaptive choice, cause or diagnosis.",
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
