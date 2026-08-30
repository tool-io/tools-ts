import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly lowerPercent: number;
  readonly upperPercent: number;
  readonly renderedRange: string;
  readonly separator: string;
}>;
export type Output = Readonly<{
  readonly expectedRange: string;
  readonly matchesExpected: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.lowerPercent > input.upperPercent)
    simpleError(
      "lowerPercent",
      "Lower percentage cannot exceed upper percentage.",
      "invalid_range",
    );
  const expectedRange = `${input.lowerPercent}%${input.separator}${input.upperPercent}%`;
  return {
    expectedRange,
    matchesExpected: input.renderedRange.trim() === expectedRange,
  };
};

export const exampleInput = {
  lowerPercent: 10,
  upperPercent: 20,
  renderedRange: "10%–20%",
  separator: "–",
} satisfies Input;
export const exampleOutput = {
  expectedRange: "10%–20%",
  matchesExpected: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      lowerPercent: input.lowerPercent as number,
      upperPercent: input.upperPercent as number,
      renderedRange: input.renderedRange as string,
      separator: input.separator as string,
    }),
  description:
    "Validate percentage-range punctuation and repeated percent signs.",
  id: "journalism/percent-range-style",
  inputs: [
    { id: "lowerPercent", label: "Lower percentage", kind: "number" },
    { id: "upperPercent", label: "Upper percentage", kind: "number" },
    { id: "renderedRange", label: "Rendered percentage range", kind: "string" },
    { id: "separator", label: "Required range separator", kind: "string" },
  ],
  outputs: [
    { id: "expectedRange", label: "Expected percentage range", kind: "string" },
    { id: "matchesExpected", label: "Matches expected range", kind: "boolean" },
  ],
  title: "Percent Range Style",
});

export const run = tool.execute;
export default tool;
