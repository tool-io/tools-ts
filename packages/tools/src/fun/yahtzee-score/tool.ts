import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  sum,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualFiveDice: readonly number[];
  readonly actualCategory: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualFiveDice", label: "Actual five dice", kind: "numberList" },
  { id: "actualCategory", label: "Actual category", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (input.actualFiveDice.length !== 5) simpleError("dice", "Exactlyfive.");
  input.actualFiveDice.forEach((v) => bounded(v, "die", 1, 6));
  const a = input.actualFiveDice,
    s = sum(a),
    c = Array.from(
      { length: 6 },
      (_, i) => a.filter((v) => v === i + 1).length,
    );
  const k = input.actualCategory;
  let score = 0;
  if (["ones", "twos", "threes", "fours", "fives", "sixes"].includes(k)) {
    const i = ["ones", "twos", "threes", "fours", "fives", "sixes"].indexOf(k);
    score = c[i] * (i + 1);
  } else if (k === "three-kind") score = Math.max(...c) >= 3 ? s : 0;
  else if (k === "four-kind") score = Math.max(...c) >= 4 ? s : 0;
  else if (k === "chance") score = s;
  else if (k === "yahtzee") score = Math.max(...c) === 5 ? 50 : 0;
  else
    simpleError(
      "category",
      "Explicitupper/kind/chance/yahtzee categories only;other existingfullhouse/straight tools separate.",
    );
  return { categoryScore: score };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualFiveDice: [1, 1, 1, 1, 1], actualCategory: "yahtzee" },
  output: { result: { categoryScore: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/yahtzee-score",
  title: "Yahtzee Score Checker",
  description:
    "ExplicitboundedYahtzeecategoryscoreinventory,nojoker/reroll/bonus/othercategoryinference. Boundedoffline arithmetic/sampling only;not gambling advice,fair physical randomness,secure randomness or predictive certainty.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
