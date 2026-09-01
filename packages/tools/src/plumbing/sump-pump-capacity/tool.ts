import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedSumpInflowLitersMinute: number;
  readonly callerPumpRunFraction: number;
  readonly callerUsableSumpCycleLiters: number;
}>;
export type Output = Readonly<{
  readonly requiredOnCyclePumpLitersMinute: number;
  readonly modeledSumpPumpCycleMinutes: number;
}>;
const inputFields = [
  {
    id: "observedSumpInflowLitersMinute",
    label: "Observed sump inflow liters minute",
    kind: "number",
  },
  {
    id: "callerPumpRunFraction",
    label: "Caller pump run fraction",
    kind: "number",
  },
  {
    id: "callerUsableSumpCycleLiters",
    label: "Caller usable sump cycle liters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerPumpRunFraction, "callerPumpRunFraction");
  positive(input.callerUsableSumpCycleLiters, "callerUsableSumpCycleLiters");
  nonnegative(
    input.observedSumpInflowLitersMinute,
    "observedSumpInflowLitersMinute",
  );
  fraction(input.callerPumpRunFraction, "callerPumpRunFraction");
  if (input.callerPumpRunFraction >= 1)
    simpleError("cycle", "Positive off-cycle fraction required.");
  positive(input.observedSumpInflowLitersMinute, "inflow");
  const pump =
      input.observedSumpInflowLitersMinute / input.callerPumpRunFraction,
    off =
      input.callerUsableSumpCycleLiters / input.observedSumpInflowLitersMinute,
    on =
      input.callerUsableSumpCycleLiters /
      (pump - input.observedSumpInflowLitersMinute);
  return {
    requiredOnCyclePumpLitersMinute: pump,
    modeledSumpPumpCycleMinutes: off + on,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSumpInflowLitersMinute: 10,
  callerPumpRunFraction: 0.5,
  callerUsableSumpCycleLiters: 20,
} satisfies Input;
export const exampleOutput = {
  requiredOnCyclePumpLitersMinute: 20,
  modeledSumpPumpCycleMinutes: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/sump-pump-capacity",
  title: "Plumbing Sump Pump Capacity Calculator",
  description:
    "Budget measured steady sump inflow against caller duty and usable cycle volume, no pump discharge-head inference or basement flood guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredOnCyclePumpLitersMinute",
      label: "Required on cycle pump liters minute",
      kind: "number",
    },
    {
      id: "modeledSumpPumpCycleMinutes",
      label: "Modeled sump pump cycle minutes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSumpInflowLitersMinute:
        value.observedSumpInflowLitersMinute as number,
      callerPumpRunFraction: value.callerPumpRunFraction as number,
      callerUsableSumpCycleLiters: value.callerUsableSumpCycleLiters as number,
    }),
});
export const run = tool.execute;
export default tool;
