import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly stageNames: readonly string[];
  readonly exposureMinutes: readonly number[];
  readonly minimumMinutes: readonly number[];
  readonly maximumMinutes: readonly number[];
}>;
export type Output = Readonly<{
  readonly outsideWindowStages: readonly string[];
  readonly protocolWindowsMet: boolean;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.stageNames, input.exposureMinutes, "stageNames");
  aligned(input.stageNames, input.minimumMinutes, "stageNames");
  aligned(input.stageNames, input.maximumMinutes, "stageNames");
  if (new Set(input.stageNames).size !== input.stageNames.length)
    simpleError("stageNames", "Distinct protocol stages required.");
  input.exposureMinutes.forEach((v) => nonnegative(v, "exposureMinutes"));
  input.minimumMinutes.forEach((v, i) => {
    nonnegative(v, "minimumMinutes");
    if (input.maximumMinutes[i] < v)
      simpleError(
        "maximumMinutes",
        "Ordered nonnegative protocol-window bounds required.",
      );
  });
  const outsideWindowStages = input.stageNames.filter(
    (_, i) =>
      input.exposureMinutes[i] < input.minimumMinutes[i] ||
      input.exposureMinutes[i] > input.maximumMinutes[i],
  );
  return {
    outsideWindowStages,
    protocolWindowsMet: outsideWindowStages.length === 0,
  };
};
export const exampleInput = {
  stageNames: ["bile", "trypsin"],
  exposureMinutes: [10, 25],
  minimumMinutes: [5, 10],
  maximumMinutes: [15, 20],
} satisfies Input;
export const exampleOutput = {
  outsideWindowStages: ["trypsin"],
  protocolWindowsMet: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/excystation-protocol-window-audit",
  title: "Excystation Protocol Window Audit",
  description:
    "Audit recorded bile/trypsin or other excystation-stage exposure durations against caller-supplied protocol windows.",
  inputs: [
    { id: "stageNames", label: "Stage names", kind: "stringList" },
    { id: "exposureMinutes", label: "Exposure minutes", kind: "numberList" },
    { id: "minimumMinutes", label: "Minimum minutes", kind: "numberList" },
    { id: "maximumMinutes", label: "Maximum minutes", kind: "numberList" },
  ],
  outputs: [
    {
      id: "outsideWindowStages",
      label: "Outside window stages",
      kind: "stringList",
    },
    {
      id: "protocolWindowsMet",
      label: "Protocol windows met",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      stageNames: value.stageNames as readonly string[],
      exposureMinutes: value.exposureMinutes as readonly number[],
      minimumMinutes: value.minimumMinutes as readonly number[],
      maximumMinutes: value.maximumMinutes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
