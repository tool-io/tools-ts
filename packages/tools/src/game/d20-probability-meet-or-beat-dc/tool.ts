import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../shared.js";
export type Input = Readonly<{
  readonly targetDifficulty: number;
  readonly flatRollModifier: number;
  readonly rollMode: string;
}>;
export type Output = Readonly<{
  readonly successfulNaturalFaces: number;
  readonly exactSuccessProbability: number;
}>;
const inputFields = [
  { id: "targetDifficulty", label: "Target difficulty", kind: "number" },
  { id: "flatRollModifier", label: "Flat roll modifier", kind: "number" },
  { id: "rollMode", label: "Roll mode", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !Number.isSafeInteger(input.targetDifficulty) ||
    !Number.isSafeInteger(input.flatRollModifier) ||
    Math.abs(input.targetDifficulty) > 1000000 ||
    Math.abs(input.flatRollModifier) > 1000000 ||
    !["normal", "advantage", "disadvantage"].includes(input.rollMode)
  )
    simpleError(
      "roll",
      "Bounded integer DC/modifier and normal/advantage/disadvantage required.",
    );
  const faces = Math.max(
      0,
      Math.min(20, 21 - input.targetDifficulty + input.flatRollModifier),
    ),
    p = faces / 20;
  return {
    successfulNaturalFaces: faces,
    exactSuccessProbability:
      input.rollMode === "advantage"
        ? 1 - (1 - p) ** 2
        : input.rollMode === "disadvantage"
          ? p * p
          : p,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  targetDifficulty: 15,
  flatRollModifier: 2,
  rollMode: "advantage",
} satisfies Input;
export const exampleOutput = {
  successfulNaturalFaces: 8,
  exactSuccessProbability: 0.64,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/d20-probability-meet-or-beat-dc",
  title: "d20 Meet-or-Beat DC Probability",
  description:
    "Compute exact d20 meet-or-beat chance with explicit modifier and max/min-of-two mode; natural 1/20 have no automatic failure/success in this generic check contract.",
  inputs: inputFields,
  outputs: [
    {
      id: "successfulNaturalFaces",
      label: "Successful natural faces",
      kind: "number",
    },
    {
      id: "exactSuccessProbability",
      label: "Exact success probability",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      targetDifficulty: value.targetDifficulty as number,
      flatRollModifier: value.flatRollModifier as number,
      rollMode: value.rollMode as string,
    }),
});
export const run = tool.execute;
export default tool;
