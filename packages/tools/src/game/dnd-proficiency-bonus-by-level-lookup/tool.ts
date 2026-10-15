import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch52-shared.js";
export type Input = Readonly<{ readonly characterLevel: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "characterLevel", label: "Character level", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  bounded(i.characterLevel, "level", 1, 20);
  return { proficiencyBonus: 2 + Math.floor((i.characterLevel - 1) / 4) };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { characterLevel: 5 },
  output: { result: { proficiencyBonus: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/dnd-proficiency-bonus-by-level-lookup",
  title: "D&D Proficiency Bonus By Level Lookup",
  description:
    "D&D fifth-edition character-level proficiency bonus 1–20; not monster challenge rating or alternate systems.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { proficiencyBonus: { type: "number" } },
        required: ["proficiencyBonus"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
