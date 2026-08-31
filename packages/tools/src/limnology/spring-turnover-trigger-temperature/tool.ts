import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  density,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly observedWaterTemperaturesC: readonly number[];
  readonly callerIsothermalSpreadToleranceC: number;
  readonly callerTurnoverReferenceTemperatureC: number;
  readonly callerReferenceToleranceC: number;
  readonly iceCoverStillPresent: boolean;
}>;
export type Output = Readonly<{
  readonly observedColumnTemperatureSpreadC: number;
  readonly nearCallerReferenceTemperature: boolean;
  readonly isothermalIceFreeTurnoverCandidate: boolean;
}>;
const inputFields = [
  {
    id: "observedWaterTemperaturesC",
    label: "Observed water temperatures c",
    kind: "numberList",
  },
  {
    id: "callerIsothermalSpreadToleranceC",
    label: "Caller isothermal spread tolerance c",
    kind: "number",
  },
  {
    id: "callerTurnoverReferenceTemperatureC",
    label: "Caller turnover reference temperature c",
    kind: "number",
  },
  {
    id: "callerReferenceToleranceC",
    label: "Caller reference tolerance c",
    kind: "number",
  },
  {
    id: "iceCoverStillPresent",
    label: "Ice cover still present",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerIsothermalSpreadToleranceC,
    "callerIsothermalSpreadToleranceC",
  );
  nonnegative(input.callerReferenceToleranceC, "callerReferenceToleranceC");
  if (input.observedWaterTemperaturesC.length < 2)
    simpleError(
      "column",
      "At least two independently observed depths required.",
    );
  input.observedWaterTemperaturesC.forEach(density);
  const spread =
      Math.max(...input.observedWaterTemperaturesC) -
      Math.min(...input.observedWaterTemperaturesC),
    near = input.observedWaterTemperaturesC.every(
      (v) =>
        Math.abs(v - input.callerTurnoverReferenceTemperatureC) <=
        input.callerReferenceToleranceC,
    );
  return {
    observedColumnTemperatureSpreadC: spread,
    nearCallerReferenceTemperature: near,
    isothermalIceFreeTurnoverCandidate:
      !input.iceCoverStillPresent &&
      near &&
      spread <= input.callerIsothermalSpreadToleranceC,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWaterTemperaturesC: [3.9, 4, 4.1],
  callerIsothermalSpreadToleranceC: 0.3,
  callerTurnoverReferenceTemperatureC: 4,
  callerReferenceToleranceC: 0.2,
  iceCoverStillPresent: false,
} satisfies Input;
export const exampleOutput = {
  observedColumnTemperatureSpreadC: 0.2,
  nearCallerReferenceTemperature: true,
  isothermalIceFreeTurnoverCandidate: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/spring-turnover-trigger-temperature",
  title: "Spring Turnover Trigger Temperature Checker",
  description:
    "Screen sampled near-isothermal ice-free water against explicit caller spring turnover temperature/spread tolerance; temperature similarity does not prove mixing, adequate wind or complete water-column coverage.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedColumnTemperatureSpreadC",
      label: "Observed column temperature spread c",
      kind: "number",
    },
    {
      id: "nearCallerReferenceTemperature",
      label: "Near caller reference temperature",
      kind: "boolean",
    },
    {
      id: "isothermalIceFreeTurnoverCandidate",
      label: "Isothermal ice free turnover candidate",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWaterTemperaturesC:
        value.observedWaterTemperaturesC as readonly number[],
      callerIsothermalSpreadToleranceC:
        value.callerIsothermalSpreadToleranceC as number,
      callerTurnoverReferenceTemperatureC:
        value.callerTurnoverReferenceTemperatureC as number,
      callerReferenceToleranceC: value.callerReferenceToleranceC as number,
      iceCoverStillPresent: value.iceCoverStillPresent as boolean,
    }),
});
export const run = tool.execute;
export default tool;
