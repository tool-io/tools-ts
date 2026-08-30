import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly leadPositionsBp: readonly number[];
  readonly halfWindowBp: number;
  readonly chromosomeLengthBp: number;
}>;
export type Output = Readonly<{
  readonly windowStarts: readonly number[];
  readonly windowEnds: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  count(input.halfWindowBp, "halfWindowBp");
  count(input.chromosomeLengthBp, "chromosomeLengthBp", 1);
  input.leadPositionsBp.forEach((v) => {
    count(v, "leadPositionsBp");
    if (v >= input.chromosomeLengthBp)
      simpleError(
        "leadPositionsBp",
        "Lead SNP positions must fit in the chromosome.",
      );
  });
  return {
    windowStarts: input.leadPositionsBp.map((v) =>
      Math.max(0, v - input.halfWindowBp),
    ),
    windowEnds: input.leadPositionsBp.map((v) =>
      Math.min(input.chromosomeLengthBp, v + input.halfWindowBp + 1),
    ),
  };
};
export const exampleInput = {
  leadPositionsBp: [1000, 2000],
  halfWindowBp: 100,
  chromosomeLengthBp: 3000,
} satisfies Input;
export const exampleOutput = {
  windowStarts: [900, 1900],
  windowEnds: [1101, 2101],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/lead-snp-region-windows",
  title: "Lead SNP Region Windows",
  description:
    "Build chromosome-clipped zero-based half-open lead-SNP windows including both radius boundaries.",
  inputs: [
    {
      id: "leadPositionsBp",
      label: "Lead positions bp",
      kind: "numberList",
      description:
        "Zero-based chromosome positions; output windows are half-open.",
    },
    { id: "halfWindowBp", label: "Half window bp", kind: "integer" },
    {
      id: "chromosomeLengthBp",
      label: "Chromosome length bp",
      kind: "integer",
    },
  ],
  outputs: [
    { id: "windowStarts", label: "Window starts", kind: "numberList" },
    { id: "windowEnds", label: "Window ends", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      leadPositionsBp: value.leadPositionsBp as readonly number[],
      halfWindowBp: value.halfWindowBp as number,
      chromosomeLengthBp: value.chromosomeLengthBp as number,
    }),
});
export const run = tool.execute;
export default tool;
