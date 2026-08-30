import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly componentNames: readonly string[];
  readonly componentLengthsBp: readonly number[];
  readonly maximumGenomeBp: number;
}>;
export type Output = Readonly<{
  readonly totalGenomeBp: number;
  readonly remainingCapacityBp: number;
  readonly withinPackagingBudget: boolean;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.componentNames, input.componentLengthsBp, "componentNames");
  input.componentLengthsBp.forEach((v) => count(v, "componentLengthsBp"));
  count(input.maximumGenomeBp, "maximumGenomeBp", 1);
  if (new Set(input.componentNames).size !== input.componentNames.length)
    simpleError(
      "componentNames",
      "Distinct annotated cassette components required.",
    );
  const totalGenomeBp = input.componentLengthsBp.reduce((a, b) => a + b, 0);
  count(totalGenomeBp, "componentLengthsBp");
  return {
    totalGenomeBp,
    remainingCapacityBp: input.maximumGenomeBp - totalGenomeBp,
    withinPackagingBudget: totalGenomeBp <= input.maximumGenomeBp,
  };
};
export const exampleInput = {
  componentNames: ["ITRs", "promoter", "transgene"],
  componentLengthsBp: [290, 500, 3500],
  maximumGenomeBp: 4700,
} satisfies Input;
export const exampleOutput = {
  totalGenomeBp: 4290,
  remainingCapacityBp: 410,
  withinPackagingBudget: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/aav-cassette-packaging-budget",
  title: "AAV Cassette Packaging Budget",
  description:
    "Audit a component-level AAV cassette budget, including ITRs if present; caller supplies the applicable genome capacity.",
  inputs: [
    { id: "componentNames", label: "Component names", kind: "stringList" },
    {
      id: "componentLengthsBp",
      label: "Component lengths bp",
      kind: "numberList",
    },
    {
      id: "maximumGenomeBp",
      label: "Maximum genome bp",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    { id: "totalGenomeBp", label: "Total genome bp", kind: "number" },
    {
      id: "remainingCapacityBp",
      label: "Remaining capacity bp",
      kind: "number",
    },
    {
      id: "withinPackagingBudget",
      label: "Within packaging budget",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      componentNames: value.componentNames as readonly string[],
      componentLengthsBp: value.componentLengthsBp as readonly number[],
      maximumGenomeBp: value.maximumGenomeBp as number,
    }),
});
export const run = tool.execute;
export default tool;
