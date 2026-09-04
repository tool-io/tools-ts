import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedBalancedStartingCurrentA: number;
  readonly callerSourceResistanceOhm: number;
  readonly callerSourceReactanceOhm: number;
  readonly startingPowerFactor: number;
}>;
export type Output = Readonly<{
  readonly approxMotorStartingLineDropV: number;
}>;
const inputFields = [
  {
    id: "observedBalancedStartingCurrentA",
    label: "Observed balanced starting current a",
    kind: "number",
  },
  {
    id: "callerSourceResistanceOhm",
    label: "Caller source resistance ohm",
    kind: "number",
  },
  {
    id: "callerSourceReactanceOhm",
    label: "Caller source reactance ohm",
    kind: "number",
  },
  { id: "startingPowerFactor", label: "Starting power factor", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.observedBalancedStartingCurrentA,
    "observedBalancedStartingCurrentA",
  );
  nonnegative(input.callerSourceResistanceOhm, "callerSourceResistanceOhm");
  nonnegative(input.callerSourceReactanceOhm, "callerSourceReactanceOhm");
  fraction(input.startingPowerFactor, "startingPowerFactor");
  return {
    approxMotorStartingLineDropV:
      Math.sqrt(3) *
      input.observedBalancedStartingCurrentA *
      (input.callerSourceResistanceOhm * input.startingPowerFactor +
        input.callerSourceReactanceOhm *
          Math.sqrt(1 - input.startingPowerFactor ** 2)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBalancedStartingCurrentA: 100,
  callerSourceResistanceOhm: 0.01,
  callerSourceReactanceOhm: 0.02,
  startingPowerFactor: 0.6,
} satisfies Input;
export const exampleOutput = {
  approxMotorStartingLineDropV: 3.81051177665153,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/motor-starting-voltage-drop",
  title: "Motor Starting Voltage Drop Calculator",
  description:
    "Actual balanced lagging motor starting current/source impedance vector projection, excludes downstream branch length and motor transient model. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "approxMotorStartingLineDropV",
      label: "Approx motor starting line drop v",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBalancedStartingCurrentA:
        value.observedBalancedStartingCurrentA as number,
      callerSourceResistanceOhm: value.callerSourceResistanceOhm as number,
      callerSourceReactanceOhm: value.callerSourceReactanceOhm as number,
      startingPowerFactor: value.startingPowerFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
