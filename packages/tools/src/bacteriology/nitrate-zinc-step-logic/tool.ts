import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly initialRed: boolean;
  readonly zincResult: string;
}>;
export type Output = Readonly<{
  readonly nitrateReductionPositive: boolean;
  readonly evidence: string;
}>;
export const calculate = (input: Input): Output => {
  if (
    !["not-performed", "red", "no-red"].includes(input.zincResult) ||
    (input.initialRed && input.zincResult !== "not-performed") ||
    (!input.initialRed && input.zincResult === "not-performed")
  )
    simpleError(
      "zincResult",
      "Zinc confirmation must follow an initially negative reaction and must not be applied to an initially red reaction.",
    );
  return {
    nitrateReductionPositive: input.initialRed || input.zincResult === "no-red",
    evidence: input.initialRed
      ? "nitrite-detected"
      : input.zincResult === "red"
        ? "unreduced-nitrate-confirmed"
        : "reduction-beyond-nitrite",
  };
};
export const exampleInput = {
  initialRed: false,
  zincResult: "no-red",
} satisfies Input;
export const exampleOutput = {
  nitrateReductionPositive: true,
  evidence: "reduction-beyond-nitrite",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/nitrate-zinc-step-logic",
  title: "Nitrate Zinc Step Logic",
  description:
    "Resolve the nitrate reduction confirmation sequence from initial reagent and zinc observations, without organism identification.",
  inputs: [
    { id: "initialRed", label: "Initial red", kind: "boolean" },
    { id: "zincResult", label: "Zinc result", kind: "string" },
  ],
  outputs: [
    {
      id: "nitrateReductionPositive",
      label: "Nitrate reduction positive",
      kind: "boolean",
    },
    { id: "evidence", label: "Evidence", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      initialRed: value.initialRed as boolean,
      zincResult: value.zincResult as string,
    }),
});
export const run = tool.execute;
export default tool;
