import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedAtmosphericPressurePa: number;
  readonly callerMatchedReferencePressurePa: number;
  readonly observedWaterDensityKgM3: number;
  readonly gravityMSecond2: number;
}>;
export type Output = Readonly<{
  readonly inverseBarometerSurgeContributionM: number;
}>;
const inputFields = [
  {
    id: "observedAtmosphericPressurePa",
    label: "Observed atmospheric pressure pa",
    kind: "number",
  },
  {
    id: "callerMatchedReferencePressurePa",
    label: "Caller matched reference pressure pa",
    kind: "number",
  },
  {
    id: "observedWaterDensityKgM3",
    label: "Observed water density kg m3",
    kind: "number",
  },
  { id: "gravityMSecond2", label: "Gravity m second2", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.observedAtmosphericPressurePa,
    "observedAtmosphericPressurePa",
  );
  positive(
    input.callerMatchedReferencePressurePa,
    "callerMatchedReferencePressurePa",
  );
  positive(input.observedWaterDensityKgM3, "observedWaterDensityKgM3");
  positive(input.gravityMSecond2, "gravityMSecond2");
  return {
    inverseBarometerSurgeContributionM:
      (input.callerMatchedReferencePressurePa -
        input.observedAtmosphericPressurePa) /
      (input.observedWaterDensityKgM3 * input.gravityMSecond2),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAtmosphericPressurePa: 100000,
  callerMatchedReferencePressurePa: 101000,
  observedWaterDensityKgM3: 1000,
  gravityMSecond2: 10,
} satisfies Input;
export const exampleOutput = {
  inverseBarometerSurgeContributionM: 0.1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/storm-surge-hydrostatic-contribution",
  title: "Storm Surge Hydrostatic Contribution Calculator",
  description:
    "Inverse-barometer pressure anomaly contribution only, not wind-driven set-up or total storm surge, independent reference pressure explicit. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "inverseBarometerSurgeContributionM",
      label: "Inverse barometer surge contribution m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAtmosphericPressurePa:
        value.observedAtmosphericPressurePa as number,
      callerMatchedReferencePressurePa:
        value.callerMatchedReferencePressurePa as number,
      observedWaterDensityKgM3: value.observedWaterDensityKgM3 as number,
      gravityMSecond2: value.gravityMSecond2 as number,
    }),
});
export const run = tool.execute;
export default tool;
