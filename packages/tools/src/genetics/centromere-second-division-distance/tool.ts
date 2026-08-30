import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly secondDivisionTetrads: number;
  readonly totalOrderedTetrads: number;
}>;
export type Output = Readonly<{
  readonly secondDivisionPercent: number;
  readonly centromereDistanceCm: number;
}>;
export const calculate = (input: Input): Output => {
  count(input.secondDivisionTetrads, "secondDivisionTetrads");
  count(input.totalOrderedTetrads, "totalOrderedTetrads", 1);
  if (input.secondDivisionTetrads > input.totalOrderedTetrads)
    simpleError(
      "secondDivisionTetrads",
      "Second-division counts cannot exceed total ordered tetrads.",
    );
  const secondDivisionPercent =
    (100 * input.secondDivisionTetrads) / input.totalOrderedTetrads;
  return {
    secondDivisionPercent,
    centromereDistanceCm: secondDivisionPercent / 2,
  };
};
export const exampleInput = {
  secondDivisionTetrads: 20,
  totalOrderedTetrads: 100,
} satisfies Input;
export const exampleOutput = {
  secondDivisionPercent: 20,
  centromereDistanceCm: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/centromere-second-division-distance",
  title: "Centromere Second Division Distance",
  description:
    "Estimate gene-to-centromere distance as half the ordered-tetrad second-division percentage.",
  inputs: [
    {
      id: "secondDivisionTetrads",
      label: "Second division tetrads",
      kind: "integer",
    },
    {
      id: "totalOrderedTetrads",
      label: "Total ordered tetrads",
      kind: "integer",
    },
  ],
  outputs: [
    {
      id: "secondDivisionPercent",
      label: "Second division percent",
      kind: "number",
    },
    {
      id: "centromereDistanceCm",
      label: "Centromere distance cm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      secondDivisionTetrads: value.secondDivisionTetrads as number,
      totalOrderedTetrads: value.totalOrderedTetrads as number,
    }),
});
export const run = tool.execute;
export default tool;
