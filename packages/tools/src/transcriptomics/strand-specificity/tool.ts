import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly senseReads: number;
  readonly antisenseReads: number;
  readonly minimumSensePercent: number;
}>;
export type Output = Readonly<{
  readonly sensePercent: number;
  readonly senseAntisenseRatio: number;
  readonly strandSpecific: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.senseReads < 0 ||
    input.antisenseReads < 0 ||
    input.senseReads + input.antisenseReads <= 0
  )
    simpleError(
      "senseReads",
      "Nonnegative reads with positive total required.",
    );
  const sensePercent =
    (input.senseReads / (input.senseReads + input.antisenseReads)) * 100;
  return {
    sensePercent,
    senseAntisenseRatio:
      input.antisenseReads === 0
        ? input.senseReads
        : input.senseReads / input.antisenseReads,
    strandSpecific: sensePercent >= input.minimumSensePercent,
  };
};

export const exampleInput = {
  senseReads: 80,
  antisenseReads: 20,
  minimumSensePercent: 75,
} satisfies Input;
export const exampleOutput = {
  sensePercent: 80,
  senseAntisenseRatio: 4,
  strandSpecific: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/strand-specificity",
  title: "Strand Specificity",
  description: "Check library strandedness using sense-versus-antisense reads.",
  inputs: [
    { id: "senseReads", kind: "number", label: "Sense reads" },
    { id: "antisenseReads", kind: "number", label: "Antisense reads" },
    {
      id: "minimumSensePercent",
      kind: "number",
      label: "Minimum sense percent",
    },
  ],
  outputs: [
    { id: "sensePercent", kind: "number", label: "Sense percent" },
    {
      id: "senseAntisenseRatio",
      kind: "number",
      label: "Sense antisense ratio",
    },
    { id: "strandSpecific", kind: "boolean", label: "Strand specific" },
  ],
  calculate: (value) =>
    calculate({
      senseReads: value.senseReads as number,
      antisenseReads: value.antisenseReads as number,
      minimumSensePercent: value.minimumSensePercent as number,
    }),
});
export const run = tool.execute;
export default tool;
