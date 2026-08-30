import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly sulfideBlackening: boolean;
  readonly indoleRedRing: boolean;
  readonly diffuseGrowth: boolean;
  readonly motilityReadable: boolean;
}>;
export type Output = Readonly<{
  readonly sulfideResult: string;
  readonly indoleResult: string;
  readonly motilityResult: string;
}>;
export const calculate = (input: Input): Output => {
  if (!input.motilityReadable && !input.sulfideBlackening)
    simpleError(
      "motilityReadable",
      "This decoder only accepts sulfide-blackening as the supplied reason for unreadable motility.",
    );
  return {
    sulfideResult: input.sulfideBlackening ? "positive" : "negative",
    indoleResult: input.indoleRedRing ? "positive" : "negative",
    motilityResult: !input.motilityReadable
      ? "unreadable"
      : input.diffuseGrowth
        ? "positive"
        : "negative",
  };
};
export const exampleInput = {
  sulfideBlackening: true,
  indoleRedRing: false,
  diffuseGrowth: true,
  motilityReadable: false,
} satisfies Input;
export const exampleOutput = {
  sulfideResult: "positive",
  indoleResult: "negative",
  motilityResult: "unreadable",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/sim-masked-indole-motility",
  title: "SIM Masked Indole Motility",
  description:
    "Decode SIM observations while preserving sulfide-masked motility as unreadable rather than falsely negative.",
  inputs: [
    { id: "sulfideBlackening", label: "Sulfide blackening", kind: "boolean" },
    { id: "indoleRedRing", label: "Indole red ring", kind: "boolean" },
    { id: "diffuseGrowth", label: "Diffuse growth", kind: "boolean" },
    { id: "motilityReadable", label: "Motility readable", kind: "boolean" },
  ],
  outputs: [
    { id: "sulfideResult", label: "Sulfide result", kind: "string" },
    { id: "indoleResult", label: "Indole result", kind: "string" },
    { id: "motilityResult", label: "Motility result", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      sulfideBlackening: value.sulfideBlackening as boolean,
      indoleRedRing: value.indoleRedRing as boolean,
      diffuseGrowth: value.diffuseGrowth as boolean,
      motilityReadable: value.motilityReadable as boolean,
    }),
});
export const run = tool.execute;
export default tool;
