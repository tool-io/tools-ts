import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedReactiveMineralMolesPerKg: number;
  readonly callerVerifiedStoichiometricHydrogenMolesPerMineralMole: number;
  readonly callerCalibratedReactedFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedReactiveMineralMolesPerKg",
    label: "Caller verified reactive mineral moles per kg",
    kind: "number",
  },
  {
    id: "callerVerifiedStoichiometricHydrogenMolesPerMineralMole",
    label: "Caller verified stoichiometric hydrogen moles per mineral mole",
    kind: "number",
  },
  {
    id: "callerCalibratedReactedFraction",
    label: "Caller calibrated reacted fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.callerVerifiedReactiveMineralMolesPerKg, "inventory");
  nonnegative(
    input.callerVerifiedStoichiometricHydrogenMolesPerMineralMole,
    "stoichiometry",
  );
  fraction(input.callerCalibratedReactedFraction, "reacted");
  return {
    conditionalHydrogenMolesPerKg:
      input.callerVerifiedReactiveMineralMolesPerKg *
      input.callerVerifiedStoichiometricHydrogenMolesPerMineralMole *
      input.callerCalibratedReactedFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedReactiveMineralMolesPerKg: 2,
    callerVerifiedStoichiometricHydrogenMolesPerMineralMole: 1,
    callerCalibratedReactedFraction: 0.5,
  },
  output: { result: { conditionalHydrogenMolesPerKg: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/serpentinization-hydrogen-yield-estimate",
  title: "Serpentinization Hydrogen Yield mol/kg Rock Estimate Calculator",
  description:
    "Conditional serpentinization hydrogen yield from independently established reaction-specific inventory, stoichiometry and reacted fraction. No universal rock yield, kinetics, geochemistry or safe production instructions.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
