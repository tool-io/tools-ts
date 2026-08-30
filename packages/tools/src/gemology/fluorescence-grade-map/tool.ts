import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bands,
} from "../shared.js";
export type Input = Readonly<{
  readonly measuredFluorescenceSignal: number;
  readonly backgroundSignal: number;
  readonly excitationReferenceSignal: number;
  readonly callerFluorescenceGradeLowerEdges: readonly number[];
}>;
export type Output = Readonly<{
  readonly normalizedBackgroundCorrectedFluorescence: number;
  readonly callerFluorescenceGradeCode: number;
  readonly negativeCorrectedSignal: boolean;
}>;
const inputFields = [
  {
    id: "measuredFluorescenceSignal",
    label: "Measured fluorescence signal",
    kind: "number",
  },
  { id: "backgroundSignal", label: "Background signal", kind: "number" },
  {
    id: "excitationReferenceSignal",
    label: "Excitation reference signal",
    kind: "number",
  },
  {
    id: "callerFluorescenceGradeLowerEdges",
    label: "Caller fluorescence grade lower edges",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.excitationReferenceSignal, "excitationReferenceSignal");
  nonnegative(input.measuredFluorescenceSignal, "measuredFluorescenceSignal");
  nonnegative(input.backgroundSignal, "backgroundSignal");
  const normalizedBackgroundCorrectedFluorescence =
    (input.measuredFluorescenceSignal - input.backgroundSignal) /
    input.excitationReferenceSignal;
  return {
    normalizedBackgroundCorrectedFluorescence,
    callerFluorescenceGradeCode: bands(
      input.callerFluorescenceGradeLowerEdges,
      normalizedBackgroundCorrectedFluorescence,
    ),
    negativeCorrectedSignal: normalizedBackgroundCorrectedFluorescence < 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredFluorescenceSignal: 12,
  backgroundSignal: 2,
  excitationReferenceSignal: 10,
  callerFluorescenceGradeLowerEdges: [-1, 0, 0.5, 2],
} satisfies Input;
export const exampleOutput = {
  normalizedBackgroundCorrectedFluorescence: 1,
  callerFluorescenceGradeCode: 2,
  negativeCorrectedSignal: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/fluorescence-grade-map",
  title: "Fluorescence Strength Grade Mapper",
  description:
    "Map excitation-normalized background-corrected fluorescence under caller assay-specific bands; retain negative nondetections and no commercial UV grade/material identity or safe lamp exposure inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "normalizedBackgroundCorrectedFluorescence",
      label: "Normalized background corrected fluorescence",
      kind: "number",
    },
    {
      id: "callerFluorescenceGradeCode",
      label: "Caller fluorescence grade code",
      kind: "number",
    },
    {
      id: "negativeCorrectedSignal",
      label: "Negative corrected signal",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredFluorescenceSignal: value.measuredFluorescenceSignal as number,
      backgroundSignal: value.backgroundSignal as number,
      excitationReferenceSignal: value.excitationReferenceSignal as number,
      callerFluorescenceGradeLowerEdges:
        value.callerFluorescenceGradeLowerEdges as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
