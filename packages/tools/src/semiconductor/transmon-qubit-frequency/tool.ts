import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerJosephsonEnergyJ: number;
  readonly callerChargingEnergyJ: number;
  readonly callerPlanckJs: number;
}>;
export type Output = Readonly<{
  readonly approximateTransmon01Hz: number;
  readonly callerEjOverEc: number;
}>;
const inputFields = [
  {
    id: "callerJosephsonEnergyJ",
    label: "Caller josephson energy j",
    kind: "number",
  },
  {
    id: "callerChargingEnergyJ",
    label: "Caller charging energy j",
    kind: "number",
  },
  { id: "callerPlanckJs", label: "Caller planck js", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerJosephsonEnergyJ, "callerJosephsonEnergyJ");
  positive(input.callerChargingEnergyJ, "callerChargingEnergyJ");
  positive(input.callerPlanckJs, "callerPlanckJs");
  const ratio = input.callerJosephsonEnergyJ / input.callerChargingEnergyJ;
  if (ratio < 20)
    simpleError(
      "transmon",
      "Explicit transmon asymptotic branch EJ/EC≥20 required.",
    );
  return {
    approximateTransmon01Hz:
      (Math.sqrt(
        8 * input.callerJosephsonEnergyJ * input.callerChargingEnergyJ,
      ) -
        input.callerChargingEnergyJ) /
      input.callerPlanckJs,
    callerEjOverEc: ratio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerJosephsonEnergyJ: 100,
  callerChargingEnergyJ: 1,
  callerPlanckJs: 1,
} satisfies Input;
export const exampleOutput = {
  approximateTransmon01Hz: 27.284271247461902,
  callerEjOverEc: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/transmon-qubit-frequency",
  title: "Semiconductor Transmon Qubit Frequency Calculator",
  description:
    "Named transmon large-EJ/EC asymptotic f01=(√8EJEC−EC)/h; explicit energy/Planck conventions, no general qubit diagonalization or operational readiness.",
  inputs: inputFields,
  outputs: [
    {
      id: "approximateTransmon01Hz",
      label: "Approximate transmon01 hz",
      kind: "number",
    },
    { id: "callerEjOverEc", label: "Caller ej over ec", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      callerJosephsonEnergyJ: value.callerJosephsonEnergyJ as number,
      callerChargingEnergyJ: value.callerChargingEnergyJ as number,
      callerPlanckJs: value.callerPlanckJs as number,
    }),
});
export const run = tool.execute;
export default tool;
