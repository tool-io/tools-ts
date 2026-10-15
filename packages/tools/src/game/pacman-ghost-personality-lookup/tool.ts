import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly ghost: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "ghost", label: "Ghost", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  return {
    reference: pick(
      i.ghost,
      {
        Blinky: "chases Pac-Man in classic arcade targeting behavior",
        Pinky: "targets ahead of Pac-Man, with original implementation quirks",
        Inky: "uses a target dependent on Pac-Man and Blinky",
        Clyde: "switches between chasing and retreating based on proximity",
      },
      "ghost",
    ),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { ghost: "Blinky" },
  output: {
    result: {
      reference: "chases Pac-Man in classic arcade targeting behavior",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/pacman-ghost-personality-lookup",
  title: "Pac-Man Ghost Personality Lookup",
  description:
    "Bounded classic arcade Pac-Man ghost targeting summary; remakes, modes and exact AI timing excluded.",
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
