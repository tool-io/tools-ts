import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly bet: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "bet", label: "Bet", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  return {
    reference: pick(
      i.bet,
      {
        "standard-pass-line-no-odds":
          "7/495 = approximately 1.414141% expected loss per resolved initial pass-line bet.",
      },
      "bet",
    ),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { bet: "standard-pass-line-no-odds" },
  output: {
    result: {
      reference:
        "7/495 = approximately 1.414141% expected loss per resolved initial pass-line bet.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/craps-pass-line-house-edge-lookup",
  title: "Craps Pass Line House Edge Lookup",
  description:
    "Exact standard craps pass-line house-edge reference, no odds bets or alternate rules; not a winning strategy.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { reference: { type: "string" } },
        required: ["reference"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
