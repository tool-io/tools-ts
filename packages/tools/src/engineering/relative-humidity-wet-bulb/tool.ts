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
  fraction,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly dryBulbC: number;
  readonly wetBulbC: number;
  readonly totalPressurePa: number;
  readonly callerWetBulbSaturationPa: number;
  readonly callerDryBulbSaturationPa: number;
  readonly callerPsychrometerPerC: number;
}>;
export type Output = Readonly<{
  readonly psychrometricRelativeHumidityFraction: number;
}>;
const inputFields = [
  { id: "dryBulbC", label: "Dry bulb c", kind: "number" },
  { id: "wetBulbC", label: "Wet bulb c", kind: "number" },
  { id: "totalPressurePa", label: "Total pressure pa", kind: "number" },
  {
    id: "callerWetBulbSaturationPa",
    label: "Caller wet bulb saturation pa",
    kind: "number",
  },
  {
    id: "callerDryBulbSaturationPa",
    label: "Caller dry bulb saturation pa",
    kind: "number",
  },
  {
    id: "callerPsychrometerPerC",
    label: "Caller psychrometer per c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.totalPressurePa, "totalPressurePa");
  positive(input.callerWetBulbSaturationPa, "callerWetBulbSaturationPa");
  positive(input.callerDryBulbSaturationPa, "callerDryBulbSaturationPa");
  positive(input.callerPsychrometerPerC, "callerPsychrometerPerC");
  if (input.wetBulbC > input.dryBulbC)
    simpleError(
      "wet bulb",
      "Wet≤dry bulb on caller ventilated liquid psychrometer branch.",
    );
  const vapor =
      input.callerWetBulbSaturationPa -
      input.callerPsychrometerPerC *
        input.totalPressurePa *
        (input.dryBulbC - input.wetBulbC),
    rh = vapor / input.callerDryBulbSaturationPa;
  fraction(rh, "physical RH");
  return { psychrometricRelativeHumidityFraction: rh };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dryBulbC: 20,
  wetBulbC: 15,
  totalPressurePa: 100000,
  callerWetBulbSaturationPa: 2000,
  callerDryBulbSaturationPa: 3000,
  callerPsychrometerPerC: 0.001,
} satisfies Input;
export const exampleOutput = {
  psychrometricRelativeHumidityFraction: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/relative-humidity-wet-bulb",
  title: "Relative Humidity from Wet-Bulb Calculator",
  description:
    "Wet/dry psychrometer vapor-pressure balance with independently matched liquid/pressure coefficient and saturation pressures; no saturation equation invented. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "psychrometricRelativeHumidityFraction",
      label: "Psychrometric relative humidity fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      dryBulbC: value.dryBulbC as number,
      wetBulbC: value.wetBulbC as number,
      totalPressurePa: value.totalPressurePa as number,
      callerWetBulbSaturationPa: value.callerWetBulbSaturationPa as number,
      callerDryBulbSaturationPa: value.callerDryBulbSaturationPa as number,
      callerPsychrometerPerC: value.callerPsychrometerPerC as number,
    }),
});
export const run = tool.execute;
export default tool;
