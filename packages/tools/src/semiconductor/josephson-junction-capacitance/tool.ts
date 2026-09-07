import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerObservedJosephsonChargingEnergyJ: number;
  readonly callerElementaryChargeC: number;
  readonly observedIndependentStrayCapacitanceFarads: number;
}>;
export type Output = Readonly<{
  readonly inferredTotalIslandCapacitanceFarads: number;
  readonly signedInferredJunctionCapacitanceFarads: number;
}>;
const inputFields = [
  {
    id: "callerObservedJosephsonChargingEnergyJ",
    label: "Caller observed josephson charging energy j",
    kind: "number",
  },
  {
    id: "callerElementaryChargeC",
    label: "Caller elementary charge c",
    kind: "number",
  },
  {
    id: "observedIndependentStrayCapacitanceFarads",
    label: "Observed independent stray capacitance farads",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerObservedJosephsonChargingEnergyJ,
    "callerObservedJosephsonChargingEnergyJ",
  );
  positive(input.callerElementaryChargeC, "callerElementaryChargeC");
  nonnegative(
    input.observedIndependentStrayCapacitanceFarads,
    "observedIndependentStrayCapacitanceFarads",
  );
  const total =
    input.callerElementaryChargeC ** 2 /
    (2 * input.callerObservedJosephsonChargingEnergyJ);
  return {
    inferredTotalIslandCapacitanceFarads: total,
    signedInferredJunctionCapacitanceFarads:
      total - input.observedIndependentStrayCapacitanceFarads,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerObservedJosephsonChargingEnergyJ: 1e-20,
  callerElementaryChargeC: 1.6e-19,
  observedIndependentStrayCapacitanceFarads: 1e-19,
} satisfies Input;
export const exampleOutput = {
  inferredTotalIslandCapacitanceFarads: 1.28e-18,
  signedInferredJunctionCapacitanceFarads: 1.18e-18,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/josephson-junction-capacitance",
  title: "Semiconductor Josephson Junction Capacitance Calculator",
  description:
    "Invert independently measured EC=e²/(2CΣ) then subtract actual stray to infer Josephson junction capacitance, signed mismatch retained; not forward Coulomb voltage or dielectric plate estimate.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredTotalIslandCapacitanceFarads",
      label: "Inferred total island capacitance farads",
      kind: "number",
    },
    {
      id: "signedInferredJunctionCapacitanceFarads",
      label: "Signed inferred junction capacitance farads",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerObservedJosephsonChargingEnergyJ:
        value.callerObservedJosephsonChargingEnergyJ as number,
      callerElementaryChargeC: value.callerElementaryChargeC as number,
      observedIndependentStrayCapacitanceFarads:
        value.observedIndependentStrayCapacitanceFarads as number,
    }),
});
export const run = tool.execute;
export default tool;
