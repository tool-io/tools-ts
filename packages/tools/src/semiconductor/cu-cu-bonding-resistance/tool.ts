import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, linearFit } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedCuBondFourWireAmps: readonly number[];
  readonly observedCuBondFourWireVolts: readonly number[];
}>;
export type Output = Readonly<{
  readonly fittedCuBondResistanceOhms: number;
  readonly fittedVoltageOffsetVolts: number;
  readonly bondIvFitRSquared: number;
}>;
const inputFields = [
  {
    id: "observedCuBondFourWireAmps",
    label: "Observed cu bond four wire amps",
    kind: "numberList",
  },
  {
    id: "observedCuBondFourWireVolts",
    label: "Observed cu bond four wire volts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const fit = linearFit(
    input.observedCuBondFourWireAmps,
    input.observedCuBondFourWireVolts,
  );
  return {
    fittedCuBondResistanceOhms: fit.slope,
    fittedVoltageOffsetVolts: fit.intercept,
    bondIvFitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCuBondFourWireAmps: [1, 2, 3],
  observedCuBondFourWireVolts: [2, 3, 4],
} satisfies Input;
export const exampleOutput = {
  fittedCuBondResistanceOhms: 1,
  fittedVoltageOffsetVolts: 1,
  bondIvFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/cu-cu-bonding-resistance",
  title: "Semiconductor Cu Cu Bonding Resistance Calculator",
  description:
    "Extract actual multi-current Kelvin Cu-Cu bond resistance and voltage offset separately; not scalar V/I or contact resistivity geometry, no bond-strength approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedCuBondResistanceOhms",
      label: "Fitted cu bond resistance ohms",
      kind: "number",
    },
    {
      id: "fittedVoltageOffsetVolts",
      label: "Fitted voltage offset volts",
      kind: "number",
    },
    { id: "bondIvFitRSquared", label: "Bond iv fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedCuBondFourWireAmps:
        value.observedCuBondFourWireAmps as readonly number[],
      observedCuBondFourWireVolts:
        value.observedCuBondFourWireVolts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
