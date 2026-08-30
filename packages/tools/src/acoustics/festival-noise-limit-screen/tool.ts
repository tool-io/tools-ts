import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly limitDecibels: number;
  readonly measuredLevelDecibels: number;
  readonly positiveUncertaintyDecibels: number;
}>;
export type Output = Readonly<{
  readonly conservativeAssessmentLevelDecibels: number;
  readonly marginToLimitDecibels: number;
  readonly withinCallerLimit: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    !Number.isFinite(input.limitDecibels) ||
    !Number.isFinite(input.measuredLevelDecibels) ||
    !Number.isFinite(input.positiveUncertaintyDecibels) ||
    input.positiveUncertaintyDecibels < 0
  )
    simpleError(
      "measuredLevelDecibels",
      "Levels must be finite and uncertainty nonnegative.",
      "invalid_level",
    );
  const conservativeAssessmentLevelDecibels =
    input.measuredLevelDecibels + input.positiveUncertaintyDecibels;
  const marginToLimitDecibels =
    input.limitDecibels - conservativeAssessmentLevelDecibels;
  if (
    !Number.isFinite(conservativeAssessmentLevelDecibels) ||
    !Number.isFinite(marginToLimitDecibels)
  )
    simpleError(
      "measuredLevelDecibels",
      "Assessment level or margin is out of range.",
      "numeric_overflow",
    );
  return {
    conservativeAssessmentLevelDecibels,
    marginToLimitDecibels,
    withinCallerLimit: marginToLimitDecibels >= 0,
  };
};

export const example = {
  input: {
    limitDecibels: 65,
    measuredLevelDecibels: 61,
    positiveUncertaintyDecibels: 2,
  },
  output: {
    conservativeAssessmentLevelDecibels: 63,
    marginToLimitDecibels: 2,
    withinCallerLimit: true,
  },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: {
    limitDecibels: 65,
    measuredLevelDecibels: 64,
    positiveUncertaintyDecibels: 2,
  },
  output: {
    conservativeAssessmentLevelDecibels: 66,
    marginToLimitDecibels: -1,
    withinCallerLimit: false,
  },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      limitDecibels: input.limitDecibels as number,
      measuredLevelDecibels: input.measuredLevelDecibels as number,
      positiveUncertaintyDecibels: input.positiveUncertaintyDecibels as number,
    }),
  description:
    "Compare an offsite measured level plus explicit positive uncertainty with a caller-supplied limit.",
  id: "acoustics/festival-noise-limit-screen",
  inputs: [
    {
      id: "limitDecibels",
      kind: "number",
      label: "Caller-supplied limit",
      unit: "dB",
    },
    {
      id: "measuredLevelDecibels",
      kind: "number",
      label: "Measured level",
      unit: "dB",
    },
    {
      id: "positiveUncertaintyDecibels",
      kind: "number",
      label: "Positive uncertainty",
      minimum: 0,
      unit: "dB",
    },
  ],
  outputs: [
    {
      id: "conservativeAssessmentLevelDecibels",
      kind: "number",
      label: "Conservative assessment level",
      unit: "dB",
    },
    {
      id: "marginToLimitDecibels",
      kind: "number",
      label: "Margin to limit",
      unit: "dB",
    },
    { id: "withinCallerLimit", kind: "boolean", label: "Within caller limit" },
  ],
  title: "Festival Noise Limit Screen",
});

export const run = tool.execute;
export default tool;
