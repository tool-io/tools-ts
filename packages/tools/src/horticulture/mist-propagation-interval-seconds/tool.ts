import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  positive,
  nonnegative,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly callerOnSeconds: number;
  readonly callerOffSeconds: number;
  readonly callerObservationSeconds: number;
  readonly measuredMistWaterMlSecond: number;
}>;
export type Output = Readonly<{
  readonly completeMistCycles: number;
  readonly enabledMistSeconds: number;
  readonly modeledMistWaterMl: number;
}>;
const inputFields = [
  { id: "callerOnSeconds", label: "Caller on seconds", kind: "number" },
  { id: "callerOffSeconds", label: "Caller off seconds", kind: "number" },
  {
    id: "callerObservationSeconds",
    label: "Caller observation seconds",
    kind: "number",
  },
  {
    id: "measuredMistWaterMlSecond",
    label: "Measured mist water ml second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerOnSeconds, "callerOnSeconds");
  nonnegative(input.callerOffSeconds, "callerOffSeconds");
  nonnegative(input.callerObservationSeconds, "callerObservationSeconds");
  nonnegative(input.measuredMistWaterMlSecond, "measuredMistWaterMlSecond");
  const period = input.callerOnSeconds + input.callerOffSeconds;
  positive(period, "period");
  if (!Number.isFinite(period))
    simpleError("period", "Finite cycle duration required.");
  const complete = Math.floor(input.callerObservationSeconds / period),
    enabled =
      complete * input.callerOnSeconds +
      Math.min(input.callerOnSeconds, input.callerObservationSeconds % period);
  return {
    completeMistCycles: integer(complete, "cycles"),
    enabledMistSeconds: enabled,
    modeledMistWaterMl: enabled * input.measuredMistWaterMlSecond,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerOnSeconds: 5,
  callerOffSeconds: 55,
  callerObservationSeconds: 130,
  measuredMistWaterMlSecond: 2,
} satisfies Input;
export const exampleOutput = {
  completeMistCycles: 2,
  enabledMistSeconds: 15,
  modeledMistWaterMl: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/mist-propagation-interval-seconds",
  title: "Mist Propagation Interval Seconds Calculator",
  description:
    "Inventory actual requested mist on/off schedule including the partial final cycle starting on at zero; no recommended propagation interval, leaf-water response or controller/hardware writes.",
  inputs: inputFields,
  outputs: [
    { id: "completeMistCycles", label: "Complete mist cycles", kind: "number" },
    { id: "enabledMistSeconds", label: "Enabled mist seconds", kind: "number" },
    {
      id: "modeledMistWaterMl",
      label: "Modeled mist water ml",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerOnSeconds: value.callerOnSeconds as number,
      callerOffSeconds: value.callerOffSeconds as number,
      callerObservationSeconds: value.callerObservationSeconds as number,
      measuredMistWaterMlSecond: value.measuredMistWaterMlSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
