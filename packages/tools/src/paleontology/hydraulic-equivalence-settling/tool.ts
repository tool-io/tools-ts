import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly observedFossilSettlingSpeedMPerSecond: number;
  readonly waterDensityKgPerM3: number;
  readonly referenceSedimentDensityKgPerM3: number;
  readonly waterDynamicViscosityPaSeconds: number;
  readonly gravityMPerSecondSquared: number;
  readonly callerMaximumStokesReynoldsNumber: number;
}>;
export type Output = Readonly<{
  readonly hydraulicallyEquivalentSedimentDiameterM: number;
  readonly equivalentSedimentReynoldsNumber: number;
  readonly withinCallerCreepingFlowScreen: boolean;
}>;
const inputFields = [
  {
    id: "observedFossilSettlingSpeedMPerSecond",
    label: "Observed fossil settling speed m per second",
    kind: "number",
  },
  {
    id: "waterDensityKgPerM3",
    label: "Water density kg per m3",
    kind: "number",
  },
  {
    id: "referenceSedimentDensityKgPerM3",
    label: "Reference sediment density kg per m3",
    kind: "number",
  },
  {
    id: "waterDynamicViscosityPaSeconds",
    label: "Water dynamic viscosity pa seconds",
    kind: "number",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
  {
    id: "callerMaximumStokesReynoldsNumber",
    label: "Caller maximum stokes reynolds number",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.observedFossilSettlingSpeedMPerSecond,
    "observedFossilSettlingSpeedMPerSecond",
  );
  positive(input.waterDensityKgPerM3, "waterDensityKgPerM3");
  positive(
    input.referenceSedimentDensityKgPerM3,
    "referenceSedimentDensityKgPerM3",
  );
  positive(
    input.waterDynamicViscosityPaSeconds,
    "waterDynamicViscosityPaSeconds",
  );
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  positive(
    input.callerMaximumStokesReynoldsNumber,
    "callerMaximumStokesReynoldsNumber",
  );
  const contrast = positive(
      input.referenceSedimentDensityKgPerM3 - input.waterDensityKgPerM3,
      "referenceSedimentDensityKgPerM3",
    ),
    hydraulicallyEquivalentSedimentDiameterM = Math.sqrt(
      (18 *
        input.waterDynamicViscosityPaSeconds *
        input.observedFossilSettlingSpeedMPerSecond) /
        (contrast * input.gravityMPerSecondSquared),
    ),
    equivalentSedimentReynoldsNumber =
      (input.waterDensityKgPerM3 *
        input.observedFossilSettlingSpeedMPerSecond *
        hydraulicallyEquivalentSedimentDiameterM) /
      input.waterDynamicViscosityPaSeconds;
  return {
    hydraulicallyEquivalentSedimentDiameterM,
    equivalentSedimentReynoldsNumber,
    withinCallerCreepingFlowScreen:
      equivalentSedimentReynoldsNumber <=
      input.callerMaximumStokesReynoldsNumber,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFossilSettlingSpeedMPerSecond: 0.01,
  waterDensityKgPerM3: 1000,
  referenceSedimentDensityKgPerM3: 2000,
  waterDynamicViscosityPaSeconds: 0.001,
  gravityMPerSecondSquared: 10,
  callerMaximumStokesReynoldsNumber: 1,
} satisfies Input;
export const exampleOutput = {
  hydraulicallyEquivalentSedimentDiameterM: 0.00013416407864998739,
  equivalentSedimentReynoldsNumber: 1.3416407864998738,
  withinCallerCreepingFlowScreen: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/hydraulic-equivalence-settling",
  title: "Hydraulic Equivalence Settling Velocity",
  description:
    "Invert measured fossil settling speed to a Stokes-equivalent reference sediment diameter and applicability Reynolds screen; unlike existing forward Stokes particle settling, the target is equivalent grain size, with non-creeping estimates flagged.",
  inputs: inputFields,
  outputs: [
    {
      id: "hydraulicallyEquivalentSedimentDiameterM",
      label: "Hydraulically equivalent sediment diameter m",
      kind: "number",
    },
    {
      id: "equivalentSedimentReynoldsNumber",
      label: "Equivalent sediment reynolds number",
      kind: "number",
    },
    {
      id: "withinCallerCreepingFlowScreen",
      label: "Within caller creeping flow screen",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFossilSettlingSpeedMPerSecond:
        value.observedFossilSettlingSpeedMPerSecond as number,
      waterDensityKgPerM3: value.waterDensityKgPerM3 as number,
      referenceSedimentDensityKgPerM3:
        value.referenceSedimentDensityKgPerM3 as number,
      waterDynamicViscosityPaSeconds:
        value.waterDynamicViscosityPaSeconds as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
      callerMaximumStokesReynoldsNumber:
        value.callerMaximumStokesReynoldsNumber as number,
    }),
});
export const run = tool.execute;
export default tool;
