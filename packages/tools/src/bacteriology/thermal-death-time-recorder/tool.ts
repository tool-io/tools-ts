import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  simpleError,
  strictlyIncreasing,
  binary,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly exposureMinutes: readonly number[];
  readonly viableDetectedFlags: readonly number[];
  readonly temperatureC: number;
  readonly callerControlsValid: boolean;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "exposureMinutes", label: "Exposure minutes", kind: "numberList" },
  {
    id: "viableDetectedFlags",
    label: "Viable detected flags",
    kind: "numberList",
  },
  { id: "temperatureC", label: "Temperature c", kind: "number" },
  {
    id: "callerControlsValid",
    label: "Caller controls valid",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  aligned(i.exposureMinutes, i.viableDetectedFlags, "observations");
  strictlyIncreasing(i.exposureMinutes, "times", 1);
  i.exposureMinutes.forEach((v) => nonnegative(v, "time"));
  binary(i.viableDetectedFlags, "detected");
  if (
    i.viableDetectedFlags.some(
      (v, j) => j > 0 && v > i.viableDetectedFlags[j - 1],
    )
  )
    simpleError("observations", "Nonmonotone survival evidence.");
  const j = i.viableDetectedFlags.indexOf(0);
  return {
    temperatureC: i.temperatureC,
    observedFirstNoDetectionMinutes:
      i.callerControlsValid && j >= 0 ? i.exposureMinutes[j] : 0,
    noDetectionObserved: i.callerControlsValid && j >= 0,
    actualSterilityEstablished: false,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    exposureMinutes: [0, 10, 20],
    viableDetectedFlags: [1, 1, 0],
    temperatureC: 70,
    callerControlsValid: true,
  },
  output: {
    result: {
      temperatureC: 70,
      observedFirstNoDetectionMinutes: 20,
      noDetectionObserved: true,
      actualSterilityEstablished: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/thermal-death-time-recorder",
  title: "Thermal Death Time TDT at Given Temp Recorder",
  description:
    "Record first tested no-detection hold at actual fixed temperature; interval-censored endpoint, not a complete kill curve or sterilization approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          temperatureC: { type: "number" },
          observedFirstNoDetectionMinutes: { type: "number" },
          noDetectionObserved: { type: "boolean" },
          actualSterilityEstablished: { type: "boolean" },
        },
        required: [
          "temperatureC",
          "observedFirstNoDetectionMinutes",
          "noDetectionObserved",
          "actualSterilityEstablished",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
