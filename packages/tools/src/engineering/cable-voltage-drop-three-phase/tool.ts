import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly lineCurrentA: number;
  readonly oneWayLengthM: number;
  readonly resistanceOhmPerM: number;
  readonly reactanceOhmPerM: number;
  readonly powerFactor: number;
  readonly callerLaggingLoad: boolean;
}>;
export type Output = Readonly<{
  readonly approxBalancedThreePhaseDropV: number;
}>;
const inputFields = [
  { id: "lineCurrentA", label: "Line current a", kind: "number" },
  { id: "oneWayLengthM", label: "One way length m", kind: "number" },
  { id: "resistanceOhmPerM", label: "Resistance ohm per m", kind: "number" },
  { id: "reactanceOhmPerM", label: "Reactance ohm per m", kind: "number" },
  { id: "powerFactor", label: "Power factor", kind: "number" },
  { id: "callerLaggingLoad", label: "Caller lagging load", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.lineCurrentA, "lineCurrentA");
  nonnegative(input.oneWayLengthM, "oneWayLengthM");
  nonnegative(input.resistanceOhmPerM, "resistanceOhmPerM");
  nonnegative(input.reactanceOhmPerM, "reactanceOhmPerM");
  fraction(input.powerFactor, "powerFactor");
  return {
    approxBalancedThreePhaseDropV:
      Math.sqrt(3) *
      input.lineCurrentA *
      input.oneWayLengthM *
      (input.resistanceOhmPerM * input.powerFactor +
        (input.callerLaggingLoad ? 1 : -1) *
          input.reactanceOhmPerM *
          Math.sqrt(1 - input.powerFactor ** 2)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  lineCurrentA: 10,
  oneWayLengthM: 100,
  resistanceOhmPerM: 0.01,
  reactanceOhmPerM: 0.02,
  powerFactor: 0.8,
  callerLaggingLoad: true,
} satisfies Input;
export const exampleOutput = {
  approxBalancedThreePhaseDropV: 34.64101615137754,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/cable-voltage-drop-three-phase",
  title: "Three-Phase Cable Voltage Drop Calculator",
  description:
    "Balanced three-phase resistive AND signed reactive approximate drop, one-way length, lag/lead explicit; not resistive two-wire or conductor sizing. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "approxBalancedThreePhaseDropV",
      label: "Approx balanced three phase drop v",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      lineCurrentA: value.lineCurrentA as number,
      oneWayLengthM: value.oneWayLengthM as number,
      resistanceOhmPerM: value.resistanceOhmPerM as number,
      reactanceOhmPerM: value.reactanceOhmPerM as number,
      powerFactor: value.powerFactor as number,
      callerLaggingLoad: value.callerLaggingLoad as boolean,
    }),
});
export const run = tool.execute;
export default tool;
