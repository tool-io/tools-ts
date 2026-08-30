import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
} from "../shared.js";
export type Input = Readonly<{
  readonly measuredFlashLuxSecondsAtReferenceDistance: number;
  readonly referenceDistanceM: number;
  readonly plannedFlashCount: number;
  readonly callerRemainingFlashLuxSecondsBudget: number;
}>;
export type Output = Readonly<{
  readonly minimumInverseSquareModelDistanceM: number;
}>;
const inputFields = [
  {
    id: "measuredFlashLuxSecondsAtReferenceDistance",
    label: "Measured flash lux seconds at reference distance",
    kind: "number",
  },
  { id: "referenceDistanceM", label: "Reference distance m", kind: "number" },
  { id: "plannedFlashCount", label: "Planned flash count", kind: "integer" },
  {
    id: "callerRemainingFlashLuxSecondsBudget",
    label: "Caller remaining flash lux seconds budget",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.referenceDistanceM, "referenceDistanceM");
  positive(
    input.callerRemainingFlashLuxSecondsBudget,
    "callerRemainingFlashLuxSecondsBudget",
  );
  nonnegative(
    input.measuredFlashLuxSecondsAtReferenceDistance,
    "measuredFlashLuxSecondsAtReferenceDistance",
  );
  count(input.plannedFlashCount, "plannedFlashCount");
  return {
    minimumInverseSquareModelDistanceM:
      input.referenceDistanceM *
      Math.sqrt(
        (input.measuredFlashLuxSecondsAtReferenceDistance *
          input.plannedFlashCount) /
          input.callerRemainingFlashLuxSecondsBudget,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredFlashLuxSecondsAtReferenceDistance: 100,
  referenceDistanceM: 1,
  plannedFlashCount: 10,
  callerRemainingFlashLuxSecondsBudget: 250,
} satisfies Input;
export const exampleOutput = {
  minimumInverseSquareModelDistanceM: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/flash-prohibition-distance-checker",
  title: "Photographic Flash Prohibition Distance Checker",
  description:
    "Screen integrated flash exposure under caller inverse-square calibration and remaining dose; not flash prohibition authority, flash safety or distance-dependent spectra.",
  inputs: inputFields,
  outputs: [
    {
      id: "minimumInverseSquareModelDistanceM",
      label: "Minimum inverse square model distance m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredFlashLuxSecondsAtReferenceDistance:
        value.measuredFlashLuxSecondsAtReferenceDistance as number,
      referenceDistanceM: value.referenceDistanceM as number,
      plannedFlashCount: value.plannedFlashCount as number,
      callerRemainingFlashLuxSecondsBudget:
        value.callerRemainingFlashLuxSecondsBudget as number,
    }),
});
export const run = tool.execute;
export default tool;
