import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly slantCode: string;
  readonly buttCode: string;
  readonly gasObserved: boolean;
  readonly sulfideObserved: boolean;
}>;
export type Output = Readonly<{
  readonly reactionCode: string;
  readonly glucoseFermentation: boolean;
  readonly additionalSugarFermentation: boolean;
  readonly gasPositive: boolean;
  readonly sulfidePositive: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    !["A", "K", "NC"].includes(input.slantCode) ||
    !["A", "K", "NC", "blackened"].includes(input.buttCode) ||
    (input.buttCode === "blackened" && !input.sulfideObserved)
  )
    simpleError(
      "buttCode",
      "Use A, K, NC or sulfide-confirmed blackened butt observations.",
    );
  const butt = input.buttCode === "blackened" ? "A" : input.buttCode;
  if (
    (input.sulfideObserved && butt !== "A") ||
    (input.slantCode === "A" && butt !== "A")
  )
    simpleError(
      "buttCode",
      "Sulfide or an acid slant requires an acid butt in this valid TSI decoder.",
    );
  return {
    reactionCode: `${input.slantCode}/${butt}`,
    glucoseFermentation: butt === "A",
    additionalSugarFermentation: input.slantCode === "A" && butt === "A",
    gasPositive: input.gasObserved,
    sulfidePositive: input.sulfideObserved,
  };
};
export const exampleInput = {
  slantCode: "K",
  buttCode: "blackened",
  gasObserved: true,
  sulfideObserved: true,
} satisfies Input;
export const exampleOutput = {
  reactionCode: "K/A",
  glucoseFermentation: true,
  additionalSugarFermentation: false,
  gasPositive: true,
  sulfidePositive: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/tsi-slant-butt-logic",
  title: "TSI Slant Butt Logic",
  description:
    "Interpret valid TSI reaction pairs with acid-butt inference under sulfide blackening; not a species identification.",
  inputs: [
    { id: "slantCode", label: "Slant code", kind: "string" },
    { id: "buttCode", label: "Butt code", kind: "string" },
    { id: "gasObserved", label: "Gas observed", kind: "boolean" },
    { id: "sulfideObserved", label: "Sulfide observed", kind: "boolean" },
  ],
  outputs: [
    { id: "reactionCode", label: "Reaction code", kind: "string" },
    {
      id: "glucoseFermentation",
      label: "Glucose fermentation",
      kind: "boolean",
    },
    {
      id: "additionalSugarFermentation",
      label: "Additional sugar fermentation",
      kind: "boolean",
    },
    { id: "gasPositive", label: "Gas positive", kind: "boolean" },
    { id: "sulfidePositive", label: "Sulfide positive", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      slantCode: value.slantCode as string,
      buttCode: value.buttCode as string,
      gasObserved: value.gasObserved as boolean,
      sulfideObserved: value.sulfideObserved as boolean,
    }),
});
export const run = tool.execute;
export default tool;
