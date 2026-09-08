import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedVentElevationM: number;
  readonly observedPlumeTopElevationM: number;
  readonly observedNeutralBuoyancyElevationsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedNeutralHeightFractions: readonly number[];
}>;
const inputFields = [
  {
    id: "observedVentElevationM",
    label: "Observed vent elevation m",
    kind: "number",
  },
  {
    id: "observedPlumeTopElevationM",
    label: "Observed plume top elevation m",
    kind: "number",
  },
  {
    id: "observedNeutralBuoyancyElevationsM",
    label: "Observed neutral buoyancy elevations m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const height =
    input.observedPlumeTopElevationM - input.observedVentElevationM;
  positive(height, "observed plume height");
  return {
    observedNeutralHeightFractions:
      input.observedNeutralBuoyancyElevationsM.map((v) => {
        const f = (v - input.observedVentElevationM) / height;
        fraction(f, "neutral height inside observed column");
        return f;
      }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedVentElevationM: 100,
  observedPlumeTopElevationM: 1100,
  observedNeutralBuoyancyElevationsM: [500, 700],
} satisfies Input;
export const exampleOutput = {
  observedNeutralHeightFractions: [0.4, 0.6],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/neutral-buoyancy-height-fraction",
  title: "Neutral Buoyancy Height Fraction Calculator",
  description:
    "Normalize independently observed neutral-buoyancy boundary heights by SAME datum vent-to-top, no universal neutral plume fraction. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedNeutralHeightFractions",
      label: "Observed neutral height fractions",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedVentElevationM: value.observedVentElevationM as number,
      observedPlumeTopElevationM: value.observedPlumeTopElevationM as number,
      observedNeutralBuoyancyElevationsM:
        value.observedNeutralBuoyancyElevationsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
