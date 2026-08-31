import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded } from "../shared.js";
export type Input = Readonly<{ readonly abilityScores: readonly number[] }>;
export type Output = Readonly<{ readonly abilityModifiers: readonly number[] }>;
const inputFields = [
  { id: "abilityScores", label: "Ability scores", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.abilityScores.length)
    simpleError(
      "scores",
      "Nonempty observed integer ability-score list required.",
    );
  input.abilityScores.forEach((v) => bounded(v, "ability", 1, 1000));
  return {
    abilityModifiers: input.abilityScores.map((v) => Math.floor((v - 10) / 2)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  abilityScores: [9, 10, 11, 12, 18],
} satisfies Input;
export const exampleOutput = {
  abilityModifiers: [-1, 0, 0, 1, 4],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/dnd-ability-modifier-floor-half-minus-5",
  title: "D&D Ability Modifier floor((score−10)/2)",
  description:
    "Resolve signed floor-based D&D ability modifiers for actual bounded score ledger, including odd scores below ten; no edition-specific ability cap or total character proficiency inference.",
  inputs: inputFields,
  outputs: [
    { id: "abilityModifiers", label: "Ability modifiers", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({ abilityScores: value.abilityScores as readonly number[] }),
});
export const run = tool.execute;
export default tool;
