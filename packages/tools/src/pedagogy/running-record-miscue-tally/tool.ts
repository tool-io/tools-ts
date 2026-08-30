import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly miscueTypes: readonly string[];
  readonly totalWordsRead: number;
}>;
export type Output = Readonly<{
  readonly meaningCount: number;
  readonly syntaxCount: number;
  readonly visualCount: number;
  readonly uncodedCount: number;
  readonly errorRatePercent: number;
}>;
export const calculate = (input: Input): Output => {
  const allowed = new Set(["meaning", "syntax", "visual", "unknown"]);
  if (
    !Number.isSafeInteger(input.totalWordsRead) ||
    input.totalWordsRead < 1 ||
    input.miscueTypes.length > input.totalWordsRead ||
    input.miscueTypes.some((v) => !allowed.has(v))
  )
    simpleError(
      "miscueTypes",
      "Use meaning/syntax/visual/unknown miscues and positive word count.",
    );
  const count = (type: string) =>
    input.miscueTypes.filter((v) => v === type).length;
  return {
    meaningCount: count("meaning"),
    syntaxCount: count("syntax"),
    visualCount: count("visual"),
    uncodedCount: count("unknown"),
    errorRatePercent: (input.miscueTypes.length / input.totalWordsRead) * 100,
  };
};
export const exampleInput = {
  miscueTypes: ["meaning", "syntax", "visual", "meaning", "unknown"],
  totalWordsRead: 100,
} satisfies Input;
export const exampleOutput = {
  meaningCount: 2,
  syntaxCount: 1,
  visualCount: 1,
  uncodedCount: 1,
  errorRatePercent: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/running-record-miscue-tally",
  title: "Running Record Miscue Tally",
  description:
    "Tally coded running-record miscues and error rate for reading analysis.",
  inputs: [
    { id: "miscueTypes", label: "Miscue types", kind: "stringList" },
    { id: "totalWordsRead", label: "Total words read", kind: "number" },
  ],
  outputs: [
    { id: "meaningCount", label: "Meaning count", kind: "number" },
    { id: "syntaxCount", label: "Syntax count", kind: "number" },
    { id: "visualCount", label: "Visual count", kind: "number" },
    { id: "uncodedCount", label: "Uncoded count", kind: "number" },
    { id: "errorRatePercent", label: "Error rate percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      miscueTypes: value.miscueTypes as readonly string[],
      totalWordsRead: value.totalWordsRead as number,
    }),
});
export const run = tool.execute;
export default tool;
