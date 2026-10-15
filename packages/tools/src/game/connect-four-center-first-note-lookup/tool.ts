import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly ruleset: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "ruleset", label: "Ruleset", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  return {
    reference: pick(
      i.ruleset,
      {
        "standard-7x6":
          "Center openings control more potential four-in-a-row lines; this heuristic does not evaluate arbitrary positions.",
      },
      "ruleset",
    ),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { ruleset: "standard-7x6" },
  output: {
    result: {
      reference:
        "Center openings control more potential four-in-a-row lines; this heuristic does not evaluate arbitrary positions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/connect-four-center-first-note-lookup",
  title: "Connect Four Center-First Note",
  description:
    "Bounded center-control heuristic for standard Connect Four; no solver or guaranteed result.",
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
