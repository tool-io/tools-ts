import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly noTemplateCt: number;
  readonly maximumContaminationCt: number;
  readonly undetectedCt: number;
}>;
export type Output = Readonly<{
  readonly contaminationFlag: boolean;
  readonly detected: boolean;
  readonly cyclesAfterThreshold: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.undetectedCt <= 0 || input.maximumContaminationCt < 0)
    simpleError("undetectedCt", "Ct sentinel and threshold must be valid.");
  const detected = input.noTemplateCt < input.undetectedCt;
  return {
    contaminationFlag:
      detected && input.noTemplateCt <= input.maximumContaminationCt,
    detected,
    cyclesAfterThreshold: input.noTemplateCt - input.maximumContaminationCt,
  };
};

export const exampleInput = {
  noTemplateCt: 38,
  maximumContaminationCt: 35,
  undetectedCt: 45,
} satisfies Input;
export const exampleOutput = {
  contaminationFlag: false,
  detected: true,
  cyclesAfterThreshold: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/ntc-contamination-gate",
  title: "NTC Contamination Gate",
  description:
    "Flag early no-template-control amplification against caller-supplied Ct limits.",
  inputs: [
    { id: "noTemplateCt", kind: "number", label: "No template ct" },
    {
      id: "maximumContaminationCt",
      kind: "number",
      label: "Maximum contamination ct",
    },
    { id: "undetectedCt", kind: "number", label: "Undetected ct" },
  ],
  outputs: [
    { id: "contaminationFlag", kind: "boolean", label: "Contamination flag" },
    { id: "detected", kind: "boolean", label: "Detected" },
    {
      id: "cyclesAfterThreshold",
      kind: "number",
      label: "Cycles after threshold",
    },
  ],
  calculate: (value) =>
    calculate({
      noTemplateCt: value.noTemplateCt as number,
      maximumContaminationCt: value.maximumContaminationCt as number,
      undetectedCt: value.undetectedCt as number,
    }),
});
export const run = tool.execute;
export default tool;
