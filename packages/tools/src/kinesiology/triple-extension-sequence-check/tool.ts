import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly hipPeakMilliseconds: number;
  readonly kneePeakMilliseconds: number;
  readonly anklePeakMilliseconds: number;
  readonly minimumGapMilliseconds: number;
}>;
export type Output = Readonly<{
  readonly proximalToDistal: boolean;
  readonly hipKneeGapMilliseconds: number;
  readonly kneeAnkleGapMilliseconds: number;
  readonly meetsGapCriterion: boolean;
}>;

export const calculate = (input: Input): Output => {
  const hipKneeGapMilliseconds =
    input.kneePeakMilliseconds - input.hipPeakMilliseconds;
  const kneeAnkleGapMilliseconds =
    input.anklePeakMilliseconds - input.kneePeakMilliseconds;
  const proximalToDistal =
    hipKneeGapMilliseconds > 0 && kneeAnkleGapMilliseconds > 0;
  return {
    proximalToDistal,
    hipKneeGapMilliseconds,
    kneeAnkleGapMilliseconds,
    meetsGapCriterion:
      proximalToDistal &&
      hipKneeGapMilliseconds >= input.minimumGapMilliseconds &&
      kneeAnkleGapMilliseconds >= input.minimumGapMilliseconds,
  };
};

export const exampleInput = {
  hipPeakMilliseconds: 100,
  kneePeakMilliseconds: 150,
  anklePeakMilliseconds: 210,
  minimumGapMilliseconds: 30,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  hipPeakMilliseconds: 150,
  kneePeakMilliseconds: 130,
  anklePeakMilliseconds: 210,
  minimumGapMilliseconds: 30,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      hipPeakMilliseconds: input.hipPeakMilliseconds as number,
      kneePeakMilliseconds: input.kneePeakMilliseconds as number,
      anklePeakMilliseconds: input.anklePeakMilliseconds as number,
      minimumGapMilliseconds: input.minimumGapMilliseconds as number,
    }),
  description:
    "Check hip, knee, and ankle peak timing against caller-defined sequencing criteria.",
  id: "kinesiology/triple-extension-sequence-check",
  inputs: [
    {
      id: "hipPeakMilliseconds",
      label: "Hip peak time",
      kind: "number",
      minimum: 0,
      unit: "ms",
    },
    {
      id: "kneePeakMilliseconds",
      label: "Knee peak time",
      kind: "number",
      minimum: 0,
      unit: "ms",
    },
    {
      id: "anklePeakMilliseconds",
      label: "Ankle peak time",
      kind: "number",
      minimum: 0,
      unit: "ms",
    },
    {
      id: "minimumGapMilliseconds",
      label: "Minimum phase gap",
      kind: "number",
      minimum: 0,
      unit: "ms",
    },
  ],
  outputs: [
    {
      id: "proximalToDistal",
      label: "Proximal-to-distal order",
      kind: "boolean",
    },
    {
      id: "hipKneeGapMilliseconds",
      label: "Hip-knee gap",
      kind: "number",
      unit: "ms",
    },
    {
      id: "kneeAnkleGapMilliseconds",
      label: "Knee-ankle gap",
      kind: "number",
      unit: "ms",
    },
    { id: "meetsGapCriterion", label: "Meets gap criterion", kind: "boolean" },
  ],
  title: "Triple Extension Sequence Check",
});

export const run = tool.execute;
export default tool;
