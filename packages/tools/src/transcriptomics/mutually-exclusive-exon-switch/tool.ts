import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly controlExonOne: number;
  readonly controlExonTwo: number;
  readonly treatmentExonOne: number;
  readonly treatmentExonTwo: number;
  readonly minimumSwitchPoints: number;
}>;
export type Output = Readonly<{
  readonly exonOneUsageShift: number;
  readonly exonTwoUsageShift: number;
  readonly mutuallyExclusiveSwitch: boolean;
}>;

export const calculate = (input: Input): Output => {
  const a = input.controlExonOne + input.controlExonTwo,
    b = input.treatmentExonOne + input.treatmentExonTwo;
  if (
    a <= 0 ||
    b <= 0 ||
    Math.min(
      input.controlExonOne,
      input.controlExonTwo,
      input.treatmentExonOne,
      input.treatmentExonTwo,
    ) < 0
  )
    simpleError("controlExonOne", "Nonnegative paired exon counts required.");
  const exonOneUsageShift =
      (input.treatmentExonOne / b - input.controlExonOne / a) * 100,
    exonTwoUsageShift = -exonOneUsageShift;
  return {
    exonOneUsageShift,
    exonTwoUsageShift,
    mutuallyExclusiveSwitch:
      Math.abs(exonOneUsageShift) >= input.minimumSwitchPoints &&
      exonOneUsageShift * exonTwoUsageShift < 0,
  };
};

export const exampleInput = {
  controlExonOne: 80,
  controlExonTwo: 20,
  treatmentExonOne: 30,
  treatmentExonTwo: 70,
  minimumSwitchPoints: 20,
} satisfies Input;
export const exampleOutput = {
  exonOneUsageShift: -50,
  exonTwoUsageShift: 50,
  mutuallyExclusiveSwitch: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/mutually-exclusive-exon-switch",
  title: "Mutually Exclusive Exon Switch",
  description:
    "Identify reciprocal switching between mutually exclusive exons.",
  inputs: [
    { id: "controlExonOne", kind: "number", label: "Control exon one" },
    { id: "controlExonTwo", kind: "number", label: "Control exon two" },
    { id: "treatmentExonOne", kind: "number", label: "Treatment exon one" },
    { id: "treatmentExonTwo", kind: "number", label: "Treatment exon two" },
    {
      id: "minimumSwitchPoints",
      kind: "number",
      label: "Minimum switch points",
    },
  ],
  outputs: [
    { id: "exonOneUsageShift", kind: "number", label: "Exon one usage shift" },
    { id: "exonTwoUsageShift", kind: "number", label: "Exon two usage shift" },
    {
      id: "mutuallyExclusiveSwitch",
      kind: "boolean",
      label: "Mutually exclusive switch",
    },
  ],
  calculate: (value) =>
    calculate({
      controlExonOne: value.controlExonOne as number,
      controlExonTwo: value.controlExonTwo as number,
      treatmentExonOne: value.treatmentExonOne as number,
      treatmentExonTwo: value.treatmentExonTwo as number,
      minimumSwitchPoints: value.minimumSwitchPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
