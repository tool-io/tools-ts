import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly structuralDifferenceCm: number;
  readonly functionalDifferenceCm: number;
  readonly toleranceCm: number;
}>;
export type Output = Readonly<{
  readonly totalDifferenceCm: number;
  readonly discrepancyType: string;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.structuralDifferenceCm < 0 ||
    input.functionalDifferenceCm < 0 ||
    input.toleranceCm < 0
  )
    simpleError(
      "structuralDifferenceCm",
      "Nonnegative structural, functional, and tolerance lengths required.",
    );
  const structural = input.structuralDifferenceCm > input.toleranceCm,
    functional = input.functionalDifferenceCm > input.toleranceCm;
  return {
    totalDifferenceCm:
      input.structuralDifferenceCm + input.functionalDifferenceCm,
    discrepancyType:
      structural && functional
        ? "mixed"
        : structural
          ? "structural"
          : functional
            ? "functional"
            : "none",
  };
};
export const exampleInput = {
  structuralDifferenceCm: 1,
  functionalDifferenceCm: 1,
  toleranceCm: 0.2,
} satisfies Input;
export const exampleOutput = {
  totalDifferenceCm: 2,
  discrepancyType: "mixed",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/leg-length-discrepancy",
  title: "Leg Length Discrepancy",
  description:
    "Classify measured structural and functional leg-length components separately.",
  inputs: [
    {
      id: "structuralDifferenceCm",
      label: "Structural difference cm",
      kind: "number",
    },
    {
      id: "functionalDifferenceCm",
      label: "Functional difference cm",
      kind: "number",
    },
    { id: "toleranceCm", label: "Tolerance cm", kind: "number" },
  ],
  outputs: [
    { id: "totalDifferenceCm", label: "Total difference cm", kind: "number" },
    { id: "discrepancyType", label: "Discrepancy type", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      structuralDifferenceCm: value.structuralDifferenceCm as number,
      functionalDifferenceCm: value.functionalDifferenceCm as number,
      toleranceCm: value.toleranceCm as number,
    }),
});
export const run = tool.execute;
export default tool;
