import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly youngModulusPa: number;
  readonly linearExpansionPerK: number;
  readonly poissonRatio: number;
  readonly measuredSurfaceCoreTemperatureDifferenceK: number;
  readonly callerTensileStressLimitPa: number;
}>;
export type Output = Readonly<{
  readonly fullyConstrainedThermalStressProxyPa: number;
  readonly aboveCallerThermalStressLimit: boolean;
}>;
const inputFields = [
  { id: "youngModulusPa", label: "Young modulus pa", kind: "number" },
  {
    id: "linearExpansionPerK",
    label: "Linear expansion per k",
    kind: "number",
  },
  { id: "poissonRatio", label: "Poisson ratio", kind: "number" },
  {
    id: "measuredSurfaceCoreTemperatureDifferenceK",
    label: "Measured surface core temperature difference k",
    kind: "number",
  },
  {
    id: "callerTensileStressLimitPa",
    label: "Caller tensile stress limit pa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.youngModulusPa, "youngModulusPa");
  positive(input.callerTensileStressLimitPa, "callerTensileStressLimitPa");
  nonnegative(input.linearExpansionPerK, "linearExpansionPerK");
  if (input.poissonRatio <= -1 || input.poissonRatio >= 0.5)
    simpleError(
      "poissonRatio",
      "Isotropic elastic Poisson ratio in (-1,0.5) required.",
    );
  const fullyConstrainedThermalStressProxyPa =
    (input.youngModulusPa *
      input.linearExpansionPerK *
      Math.abs(input.measuredSurfaceCoreTemperatureDifferenceK)) /
    (1 - input.poissonRatio);
  return {
    fullyConstrainedThermalStressProxyPa,
    aboveCallerThermalStressLimit:
      fullyConstrainedThermalStressProxyPa > input.callerTensileStressLimitPa,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  youngModulusPa: 1000,
  linearExpansionPerK: 0.01,
  poissonRatio: 0.25,
  measuredSurfaceCoreTemperatureDifferenceK: 10,
  callerTensileStressLimitPa: 100,
} satisfies Input;
export const exampleOutput = {
  fullyConstrainedThermalStressProxyPa: 133.33333333333334,
  aboveCallerThermalStressLimit: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/thermal-shock-checker",
  title: "Thermal Shock Sensitivity Checker",
  description:
    "Screen caller measured temperature contrast with a fully constrained isotropic thermoelastic stress proxy and caller strength limit; geometry, anisotropy, defects and transient heat transfer omitted, no safe heating/cleaning advice.",
  inputs: inputFields,
  outputs: [
    {
      id: "fullyConstrainedThermalStressProxyPa",
      label: "Fully constrained thermal stress proxy pa",
      kind: "number",
    },
    {
      id: "aboveCallerThermalStressLimit",
      label: "Above caller thermal stress limit",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      youngModulusPa: value.youngModulusPa as number,
      linearExpansionPerK: value.linearExpansionPerK as number,
      poissonRatio: value.poissonRatio as number,
      measuredSurfaceCoreTemperatureDifferenceK:
        value.measuredSurfaceCoreTemperatureDifferenceK as number,
      callerTensileStressLimitPa: value.callerTensileStressLimitPa as number,
    }),
});
export const run = tool.execute;
export default tool;
