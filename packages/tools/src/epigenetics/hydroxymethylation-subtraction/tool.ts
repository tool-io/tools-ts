import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly bsMethylationPercent: number;
  readonly oxbsMethylationPercent: number;
}>;
export type Output = Readonly<{
  readonly hydroxymethylationPercent: number;
  readonly methylcytosinePercent: number;
  readonly consistent: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.bsMethylationPercent < 0 ||
    input.bsMethylationPercent > 100 ||
    input.oxbsMethylationPercent < 0 ||
    input.oxbsMethylationPercent > 100
  )
    simpleError(
      "bsMethylationPercent",
      "Methylation percentages must be within 0–100.",
    );
  return {
    hydroxymethylationPercent: Math.max(
      0,
      input.bsMethylationPercent - input.oxbsMethylationPercent,
    ),
    methylcytosinePercent: input.oxbsMethylationPercent,
    consistent: input.bsMethylationPercent >= input.oxbsMethylationPercent,
  };
};

export const exampleInput = {
  bsMethylationPercent: 70,
  oxbsMethylationPercent: 40,
} satisfies Input;
export const exampleOutput = {
  hydroxymethylationPercent: 30,
  methylcytosinePercent: 40,
  consistent: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "epigenetics/hydroxymethylation-subtraction",
  title: "Hydroxymethylation Subtraction",
  description: "Subtract oxBS from BS methylation to estimate 5hmC.",
  inputs: [
    {
      id: "bsMethylationPercent",
      kind: "number",
      label: "Bs methylation percent",
    },
    {
      id: "oxbsMethylationPercent",
      kind: "number",
      label: "Oxbs methylation percent",
    },
  ],
  outputs: [
    {
      id: "hydroxymethylationPercent",
      kind: "number",
      label: "Hydroxymethylation percent",
    },
    {
      id: "methylcytosinePercent",
      kind: "number",
      label: "Methylcytosine percent",
    },
    { id: "consistent", kind: "boolean", label: "Consistent" },
  ],
  calculate: (value) =>
    calculate({
      bsMethylationPercent: value.bsMethylationPercent as number,
      oxbsMethylationPercent: value.oxbsMethylationPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
