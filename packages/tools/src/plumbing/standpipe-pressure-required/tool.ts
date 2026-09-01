import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedHoseOutletElevationAboveSupplyM: number;
  readonly callerRequiredOutletPressureKpa: number;
  readonly observedRoutePressureLossKpa: number;
  readonly callerFluidDensityKgM3: number;
  readonly callerGravityMetersSecondSquared: number;
  readonly observedAvailableSupplyKpa: number;
}>;
export type Output = Readonly<{
  readonly modeledStandpipeRequiredSupplyKpa: number;
  readonly signedSupplyPressureMarginKpa: number;
}>;
const inputFields = [
  {
    id: "observedHoseOutletElevationAboveSupplyM",
    label: "Observed hose outlet elevation above supply m",
    kind: "number",
  },
  {
    id: "callerRequiredOutletPressureKpa",
    label: "Caller required outlet pressure kpa",
    kind: "number",
  },
  {
    id: "observedRoutePressureLossKpa",
    label: "Observed route pressure loss kpa",
    kind: "number",
  },
  {
    id: "callerFluidDensityKgM3",
    label: "Caller fluid density kg m3",
    kind: "number",
  },
  {
    id: "callerGravityMetersSecondSquared",
    label: "Caller gravity meters second squared",
    kind: "number",
  },
  {
    id: "observedAvailableSupplyKpa",
    label: "Observed available supply kpa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerFluidDensityKgM3, "callerFluidDensityKgM3");
  positive(
    input.callerGravityMetersSecondSquared,
    "callerGravityMetersSecondSquared",
  );
  nonnegative(
    input.callerRequiredOutletPressureKpa,
    "callerRequiredOutletPressureKpa",
  );
  nonnegative(
    input.observedRoutePressureLossKpa,
    "observedRoutePressureLossKpa",
  );
  nonnegative(input.observedAvailableSupplyKpa, "observedAvailableSupplyKpa");
  const required =
    input.callerRequiredOutletPressureKpa +
    input.observedRoutePressureLossKpa +
    (input.observedHoseOutletElevationAboveSupplyM *
      input.callerFluidDensityKgM3 *
      input.callerGravityMetersSecondSquared) /
      1000;
  return {
    modeledStandpipeRequiredSupplyKpa: required,
    signedSupplyPressureMarginKpa: input.observedAvailableSupplyKpa - required,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHoseOutletElevationAboveSupplyM: 10,
  callerRequiredOutletPressureKpa: 100,
  observedRoutePressureLossKpa: 20,
  callerFluidDensityKgM3: 1000,
  callerGravityMetersSecondSquared: 10,
  observedAvailableSupplyKpa: 200,
} satisfies Input;
export const exampleOutput = {
  modeledStandpipeRequiredSupplyKpa: 220,
  signedSupplyPressureMarginKpa: -20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/standpipe-pressure-required",
  title: "Plumbing Standpipe Pressure Required Calculator",
  description:
    "Audit measured standpipe route lift/loss against caller required hose outlet pressure and observed supply, signed budget; not universal fire code, hydraulic full-network design or fire readiness.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledStandpipeRequiredSupplyKpa",
      label: "Modeled standpipe required supply kpa",
      kind: "number",
    },
    {
      id: "signedSupplyPressureMarginKpa",
      label: "Signed supply pressure margin kpa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedHoseOutletElevationAboveSupplyM:
        value.observedHoseOutletElevationAboveSupplyM as number,
      callerRequiredOutletPressureKpa:
        value.callerRequiredOutletPressureKpa as number,
      observedRoutePressureLossKpa:
        value.observedRoutePressureLossKpa as number,
      callerFluidDensityKgM3: value.callerFluidDensityKgM3 as number,
      callerGravityMetersSecondSquared:
        value.callerGravityMetersSecondSquared as number,
      observedAvailableSupplyKpa: value.observedAvailableSupplyKpa as number,
    }),
});
export const run = tool.execute;
export default tool;
