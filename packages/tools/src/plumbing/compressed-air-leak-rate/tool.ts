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
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedIsolatedSystemVolumeLiters: number;
  readonly observedInitialAbsoluteKpa: number;
  readonly observedFinalAbsoluteKpa: number;
  readonly observedPressureDecayMinutes: number;
  readonly callerAtmosphericAbsoluteKpa: number;
  readonly callerConstantGasTemperatureVerified: boolean;
}>;
export type Output = Readonly<{
  readonly modeledFreeAirLeakLitersMinute: number;
}>;
const inputFields = [
  {
    id: "observedIsolatedSystemVolumeLiters",
    label: "Observed isolated system volume liters",
    kind: "number",
  },
  {
    id: "observedInitialAbsoluteKpa",
    label: "Observed initial absolute kpa",
    kind: "number",
  },
  {
    id: "observedFinalAbsoluteKpa",
    label: "Observed final absolute kpa",
    kind: "number",
  },
  {
    id: "observedPressureDecayMinutes",
    label: "Observed pressure decay minutes",
    kind: "number",
  },
  {
    id: "callerAtmosphericAbsoluteKpa",
    label: "Caller atmospheric absolute kpa",
    kind: "number",
  },
  {
    id: "callerConstantGasTemperatureVerified",
    label: "Caller constant gas temperature verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedInitialAbsoluteKpa, "observedInitialAbsoluteKpa");
  positive(input.observedFinalAbsoluteKpa, "observedFinalAbsoluteKpa");
  positive(input.observedPressureDecayMinutes, "observedPressureDecayMinutes");
  positive(input.callerAtmosphericAbsoluteKpa, "callerAtmosphericAbsoluteKpa");
  nonnegative(
    input.observedIsolatedSystemVolumeLiters,
    "observedIsolatedSystemVolumeLiters",
  );
  if (
    !input.callerConstantGasTemperatureVerified ||
    input.observedFinalAbsoluteKpa > input.observedInitialAbsoluteKpa
  )
    simpleError(
      "leak",
      "Independent constant-temperature isolated decay branch required.",
    );
  return {
    modeledFreeAirLeakLitersMinute:
      (input.observedIsolatedSystemVolumeLiters *
        (input.observedInitialAbsoluteKpa - input.observedFinalAbsoluteKpa)) /
      input.callerAtmosphericAbsoluteKpa /
      input.observedPressureDecayMinutes,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedIsolatedSystemVolumeLiters: 100,
  observedInitialAbsoluteKpa: 300,
  observedFinalAbsoluteKpa: 250,
  observedPressureDecayMinutes: 5,
  callerAtmosphericAbsoluteKpa: 100,
  callerConstantGasTemperatureVerified: true,
} satisfies Input;
export const exampleOutput = {
  modeledFreeAirLeakLitersMinute: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/compressed-air-leak-rate",
  title: "Plumbing Compressed Air Leak Rate Calculator",
  description:
    "Infer actual isolated constant-temperature pressure-decay free-air inventory leak, no leak aperture/choked-orifice model, pressure test instructions or cause diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledFreeAirLeakLitersMinute",
      label: "Modeled free air leak liters minute",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedIsolatedSystemVolumeLiters:
        value.observedIsolatedSystemVolumeLiters as number,
      observedInitialAbsoluteKpa: value.observedInitialAbsoluteKpa as number,
      observedFinalAbsoluteKpa: value.observedFinalAbsoluteKpa as number,
      observedPressureDecayMinutes:
        value.observedPressureDecayMinutes as number,
      callerAtmosphericAbsoluteKpa:
        value.callerAtmosphericAbsoluteKpa as number,
      callerConstantGasTemperatureVerified:
        value.callerConstantGasTemperatureVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
