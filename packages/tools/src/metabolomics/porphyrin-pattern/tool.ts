import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly porphyrinNames: readonly string[];
  readonly measuredLevels: readonly number[];
  readonly referenceUpperLimits: readonly number[];
}>;
export type Output = Readonly<{
  readonly elevatedNames: readonly string[];
  readonly maximumExcessFold: number;
  readonly peakIntermediate: string;
}>;
export const calculate = (input: Input): Output => {
  const n = input.porphyrinNames.length;
  if (
    n === 0 ||
    input.measuredLevels.length !== n ||
    input.referenceUpperLimits.length !== n ||
    input.referenceUpperLimits.some((v) => v <= 0) ||
    input.measuredLevels.some((v) => v < 0)
  )
    simpleError(
      "referenceUpperLimits",
      "Aligned positive reference limits required.",
    );
  const folds = input.measuredLevels.map(
      (v, i) => v / input.referenceUpperLimits[i],
    ),
    peak = folds.indexOf(Math.max(...folds));
  return {
    elevatedNames: input.porphyrinNames.filter((_, i) => folds[i] > 1),
    maximumExcessFold: folds[peak],
    peakIntermediate: input.porphyrinNames[peak],
  };
};
export const exampleInput = {
  porphyrinNames: ["ALA", "PBG", "URO"],
  measuredLevels: [1, 5, 2],
  referenceUpperLimits: [2, 2, 2],
} satisfies Input;
export const exampleOutput = {
  elevatedNames: ["PBG"],
  maximumExcessFold: 2.5,
  peakIntermediate: "PBG",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/porphyrin-pattern",
  title: "Porphyrin Pattern",
  description:
    "Find excess porphyrin intermediates against caller-provided reference limits.",
  inputs: [
    { id: "porphyrinNames", kind: "stringList", label: "Porphyrin names" },
    { id: "measuredLevels", kind: "numberList", label: "Measured levels" },
    {
      id: "referenceUpperLimits",
      kind: "numberList",
      label: "Reference upper limits",
    },
  ],
  outputs: [
    { id: "elevatedNames", kind: "stringList", label: "Elevated names" },
    { id: "maximumExcessFold", kind: "number", label: "Maximum excess fold" },
    { id: "peakIntermediate", kind: "string", label: "Peak intermediate" },
  ],
  calculate: (value) =>
    calculate({
      porphyrinNames: value.porphyrinNames as readonly string[],
      measuredLevels: value.measuredLevels as readonly number[],
      referenceUpperLimits: value.referenceUpperLimits as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
