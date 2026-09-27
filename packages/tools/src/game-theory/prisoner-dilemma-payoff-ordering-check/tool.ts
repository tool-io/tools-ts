import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  reward: number;
  temptation: number;
  punishment: number;
  sucker: number;
  requireCooperationEfficiency: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "reward", label: "Reward", kind: "number" },
  { id: "temptation", label: "Temptation", kind: "number" },
  { id: "punishment", label: "Punishment", kind: "number" },
  { id: "sucker", label: "Sucker", kind: "number" },
  {
    id: "requireCooperationEfficiency",
    label: "Require cooperation efficiency",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    strictPrisonersDilemma:
      i.temptation > i.reward &&
      i.reward > i.punishment &&
      i.punishment > i.sucker,
    cooperationEfficient: 2 * i.reward > i.temptation + i.sucker,
    accepted:
      i.temptation > i.reward &&
      i.reward > i.punishment &&
      i.punishment > i.sucker &&
      (!i.requireCooperationEfficiency ||
        2 * i.reward > i.temptation + i.sucker),
  });
};
export const example = {
  input: {
    reward: 3,
    temptation: 5,
    punishment: 1,
    sucker: 0,
    requireCooperationEfficiency: true,
  },
  output: {
    result: {
      strictPrisonersDilemma: true,
      cooperationEfficient: true,
      accepted: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game-theory/prisoner-dilemma-payoff-ordering-check",
  title: "Game Theory: Prisoner Dilemma Payoff Ordering Check Tool",
  description:
    "Check supplied symmetric prisoners-dilemma payoff inequalities and an explicit optional 2R>T+S efficiency condition; no equilibrium solver or advice.",
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
          accepted: { type: "boolean" },
          cooperationEfficient: { type: "boolean" },
          strictPrisonersDilemma: { type: "boolean" },
        },
        required: [
          "accepted",
          "cooperationEfficient",
          "strictPrisonersDilemma",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
