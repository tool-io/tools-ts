import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  simpleError,
  strictlyIncreasing,
  binary,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly testedTemperaturesC: readonly number[];
  readonly viableDetectedFlags: readonly number[];
  readonly holdMinutes: number;
  readonly callerControlsValid: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "testedTemperaturesC",
    label: "Tested temperatures c",
    kind: "numberList",
  },
  {
    id: "viableDetectedFlags",
    label: "Viable detected flags",
    kind: "numberList",
  },
  { id: "holdMinutes", label: "Hold minutes", kind: "number" },
  {
    id: "callerControlsValid",
    label: "Caller controls valid",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  aligned(i.testedTemperaturesC, i.viableDetectedFlags, "observations");
  strictlyIncreasing(i.testedTemperaturesC, "temperatures", 1);
  binary(i.viableDetectedFlags, "detected");
  positive(i.holdMinutes, "hold");
  if (
    i.viableDetectedFlags.some(
      (v, j) => j > 0 && v > i.viableDetectedFlags[j - 1],
    )
  )
    simpleError("observations", "Nonmonotone thermal survival evidence.");
  const j = i.viableDetectedFlags.indexOf(0);
  return {
    allControlsValid: i.callerControlsValid,
    observedFirstNoDetectionTemperatureC:
      i.callerControlsValid && j >= 0 ? i.testedTemperaturesC[j] : 0,
    noDetectionObserved: i.callerControlsValid && j >= 0,
    actualSterilityEstablished: false,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    testedTemperaturesC: [60, 70, 80],
    viableDetectedFlags: [1, 0, 0],
    holdMinutes: 10,
    callerControlsValid: true,
  },
  output: {
    result: {
      allControlsValid: true,
      observedFirstNoDetectionTemperatureC: 70,
      noDetectionObserved: true,
      actualSterilityEstablished: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/thermal-death-point-entry-checker",
  title: "Thermal Death Point Record Entry Checker",
  description:
    "Record lowest tested no-detection temperature at actual fixed hold under valid controls; detection limit/censoring not proof of all-cell death.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
