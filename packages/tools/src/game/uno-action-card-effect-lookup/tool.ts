import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly card: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "card", label: "Card", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  return {
    reference: pick(
      i.card,
      {
        skip: "Next player loses a turn under the standard direction of play.",
        reverse:
          "Reverse direction; two-player behavior depends on current rules.",
        "draw-two":
          "Next player draws two and loses a turn; stacking not assumed.",
        wild: "Player chooses the next color.",
        "wild-draw-four":
          "Choose color, next player draws four and loses turn; play restrictions/challenge procedure apply.",
      },
      "card",
    ),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { card: "skip" },
  output: {
    result: {
      reference:
        "Next player loses a turn under the standard direction of play.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/uno-action-card-effect-lookup",
  title: "UNO Action Card Effect Lookup",
  description:
    "Bounded classic UNO action effects; edition/house-rule differences and full move legality excluded.",
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
