import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly minus35Start: number;
  readonly minus35Length: number;
  readonly minus10Start: number;
  readonly minimumGap: number;
  readonly maximumGap: number;
}>;
export type Output = Readonly<{
  readonly interBoxGapBp: number;
  readonly withinSpacing: boolean;
}>;
export const calculate = (input: Input): Output => {
  [
    input.minus35Start,
    input.minus10Start,
    input.minimumGap,
    input.maximumGap,
  ].forEach((v) => count(v, "minus35Start"));
  count(input.minus35Length, "minus35Length", 1);
  if (
    input.maximumGap < input.minimumGap ||
    input.minus10Start < input.minus35Start + input.minus35Length
  )
    simpleError(
      "minus10Start",
      "Ordered nonoverlapping promoter boxes and gap limits required.",
    );
  const interBoxGapBp =
    input.minus10Start - input.minus35Start - input.minus35Length;
  return {
    interBoxGapBp,
    withinSpacing:
      interBoxGapBp >= input.minimumGap && interBoxGapBp <= input.maximumGap,
  };
};
export const exampleInput = {
  minus35Start: 0,
  minus35Length: 6,
  minus10Start: 23,
  minimumGap: 16,
  maximumGap: 18,
} satisfies Input;
export const exampleOutput = {
  interBoxGapBp: 17,
  withinSpacing: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/bacterial-promoter-spacing",
  title: "Bacterial Promoter Spacing",
  description:
    "Check the inter-box gap between supplied bacterial minus-35 and minus-10 promoter motifs.",
  inputs: [
    { id: "minus35Start", label: "Minus 35 start", kind: "number" },
    { id: "minus35Length", label: "Minus 35 length", kind: "integer" },
    { id: "minus10Start", label: "Minus 10 start", kind: "number" },
    { id: "minimumGap", label: "Minimum gap", kind: "number" },
    { id: "maximumGap", label: "Maximum gap", kind: "number" },
  ],
  outputs: [
    { id: "interBoxGapBp", label: "Inter box gap bp", kind: "number" },
    { id: "withinSpacing", label: "Within spacing", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      minus35Start: value.minus35Start as number,
      minus35Length: value.minus35Length as number,
      minus10Start: value.minus10Start as number,
      minimumGap: value.minimumGap as number,
      maximumGap: value.maximumGap as number,
    }),
});
export const run = tool.execute;
export default tool;
