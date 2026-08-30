import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { aligned } from "../shared.js";

export type Input = Readonly<{
  readonly targetNames: readonly string[];
  readonly positiveFlags: readonly number[];
  readonly controlPassed: boolean;
}>;
export type Output = Readonly<{
  readonly positiveTargets: readonly string[];
  readonly panelValid: boolean;
  readonly positiveCount: number;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.targetNames, input.positiveFlags, "targetNames");
  if (
    new Set(input.targetNames).size !== input.targetNames.length ||
    input.positiveFlags.some((v) => v !== 0 && v !== 1)
  )
    simpleError(
      "positiveFlags",
      "Distinct targets and aligned binary detection flags required.",
    );
  const positiveTargets = input.targetNames.filter(
    (_, i) => input.positiveFlags[i] === 1,
  );
  return {
    positiveTargets,
    panelValid: input.controlPassed,
    positiveCount: positiveTargets.length,
  };
};
export const exampleInput = {
  targetNames: ["A", "B", "C"],
  positiveFlags: [1, 0, 1],
  controlPassed: true,
} satisfies Input;
export const exampleOutput = {
  positiveTargets: ["A", "C"],
  panelValid: true,
  positiveCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/multiplex-target-decode",
  title: "Multiplex Target Decode",
  description:
    "Decode multiplex target detections while preserving the supplied assay-control validity flag.",
  inputs: [
    { id: "targetNames", label: "Target names", kind: "stringList" },
    { id: "positiveFlags", label: "Positive flags", kind: "numberList" },
    { id: "controlPassed", label: "Control passed", kind: "boolean" },
  ],
  outputs: [
    { id: "positiveTargets", label: "Positive targets", kind: "stringList" },
    { id: "panelValid", label: "Panel valid", kind: "boolean" },
    { id: "positiveCount", label: "Positive count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      targetNames: value.targetNames as readonly string[],
      positiveFlags: value.positiveFlags as readonly number[],
      controlPassed: value.controlPassed as boolean,
    }),
});
export const run = tool.execute;
export default tool;
