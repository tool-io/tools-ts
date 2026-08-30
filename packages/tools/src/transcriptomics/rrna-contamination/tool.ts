import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly rrnaAlignedReads: number;
  readonly mappedReads: number;
  readonly maximumRrnaPercent: number;
}>;
export type Output = Readonly<{
  readonly rrnaPercent: number;
  readonly contaminationFlag: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.mappedReads <= 0 ||
    input.rrnaAlignedReads < 0 ||
    input.rrnaAlignedReads > input.mappedReads
  )
    simpleError(
      "rrnaAlignedReads",
      "rRNA reads cannot exceed positive mapped reads.",
    );
  const rrnaPercent = (input.rrnaAlignedReads / input.mappedReads) * 100;
  return {
    rrnaPercent,
    contaminationFlag: rrnaPercent > input.maximumRrnaPercent,
  };
};

export const exampleInput = {
  rrnaAlignedReads: 8,
  mappedReads: 100,
  maximumRrnaPercent: 5,
} satisfies Input;
export const exampleOutput = {
  rrnaPercent: 8,
  contaminationFlag: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/rrna-contamination",
  title: "RRNA Contamination",
  description: "Flag rRNA contamination in a sequenced RNA library.",
  inputs: [
    { id: "rrnaAlignedReads", kind: "number", label: "rRNA aligned reads" },
    { id: "mappedReads", kind: "number", label: "Mapped reads" },
    {
      id: "maximumRrnaPercent",
      kind: "number",
      label: "Maximum rrna percent",
    },
  ],
  outputs: [
    { id: "rrnaPercent", kind: "number", label: "rRNA percent" },
    { id: "contaminationFlag", kind: "boolean", label: "Contamination flag" },
  ],
  calculate: (value) =>
    calculate({
      rrnaAlignedReads: value.rrnaAlignedReads as number,
      mappedReads: value.mappedReads as number,
      maximumRrnaPercent: value.maximumRrnaPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
