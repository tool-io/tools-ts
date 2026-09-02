import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["paymentHistory", "amountsOwed", "length", "newCredit", "mix"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        paymentHistory:
          "Payment history:approximately 35 percent in the general explanatory breakdown.",
        amountsOwed: "Amounts owed:approximately 30 percent.",
        length: "Length of credit history:approximately 15 percent.",
        newCredit: "New credit:approximately 10 percent.",
        mix: "Credit mix:approximately 10 percent.",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { topic: "paymentHistory" },
  output: {
    result: {
      text: "Payment history:approximately 35 percent in the general explanatory breakdown.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/fico-score-composition-weights-35-30-15-10-map",
  title: "FICO Score Composition Weights35/30/15/10 Map",
  description:
    "Bounded offline reference: FICO consumer materials describe approximate general-population factor weights, not a reproducible score formula. Source: FICO, What is in my FICO Scores. Weights vary by profile/model; not an actual score computation. Supported topic keys: paymentHistory, amountsOwed, length, newCredit, mix. No complete external corpus or live policy implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
