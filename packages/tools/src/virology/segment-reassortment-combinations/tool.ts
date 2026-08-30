import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly segmentCount: number;
  readonly parentalStrainCount: number;
}>;
export type Output = Readonly<{
  readonly segmentSourceCombinations: number;
  readonly nonparentalCombinations: number;
}>;
export const calculate = (input: Input): Output => {
  count(input.segmentCount, "segmentCount", 1);
  count(input.parentalStrainCount, "parentalStrainCount", 1);
  if (
    input.parentalStrainCount > 1 &&
    input.segmentCount * Math.log2(input.parentalStrainCount) > 53
  )
    simpleError(
      "segmentCount",
      "Reassortment combinations exceed the exact integer budget.",
    );
  const segmentSourceCombinations =
    input.parentalStrainCount ** input.segmentCount;
  count(segmentSourceCombinations, "segmentCount", 1);
  return {
    segmentSourceCombinations,
    nonparentalCombinations:
      segmentSourceCombinations - input.parentalStrainCount,
  };
};
export const exampleInput = {
  segmentCount: 3,
  parentalStrainCount: 2,
} satisfies Input;
export const exampleOutput = {
  segmentSourceCombinations: 8,
  nonparentalCombinations: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/segment-reassortment-combinations",
  title: "Segment Reassortment Combinations",
  description:
    "Count independent segment-source combinations from parental strains; viability and packaging compatibility are not implied.",
  inputs: [
    { id: "segmentCount", label: "Segment count", kind: "integer", minimum: 1 },
    {
      id: "parentalStrainCount",
      label: "Parental strain count",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "segmentSourceCombinations",
      label: "Segment source combinations",
      kind: "number",
    },
    {
      id: "nonparentalCombinations",
      label: "Nonparental combinations",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      segmentCount: value.segmentCount as number,
      parentalStrainCount: value.parentalStrainCount as number,
    }),
});
export const run = tool.execute;
export default tool;
