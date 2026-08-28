import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const kpFromPartialPressuresTool = createSimpleTool({
  id: "chemistry/kp-from-partial-pressures",
  title: "Kp From Partial Pressures Calculator",
  description:
    "Compute the pressure-based equilibrium constant Kp = P_B^b / P_A^a for a reversible reaction aA ⇌ bB.",
  inputs: [
    {
      description:
        "Partial pressure of the reactant side; must be greater than zero.",
      id: "reactantPressureAtm",
      label: "Reactant pressure",
      kind: "number",
      unit: "atm",
    },
    {
      description:
        "Partial pressure of the product side; must be greater than zero.",
      id: "productPressureAtm",
      label: "Product pressure",
      kind: "number",
      unit: "atm",
    },
    {
      description: "Reactant stoichiometric coefficient.",
      id: "reactantCoeff",
      label: "Reactant coefficient",
      kind: "integer",
      minimum: 1,
    },
    {
      description: "Product stoichiometric coefficient.",
      id: "productCoeff",
      label: "Product coefficient",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Pressure-based equilibrium constant.",
      id: "kp",
      label: "Kp",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const reactantPressure = input.reactantPressureAtm as number;
    if (reactantPressure <= 0)
      simpleError(
        "reactantPressureAtm",
        "The reactant pressure must be greater than zero.",
        "invalid_pressure",
      );
    return {
      kp:
        (input.productPressureAtm as number) ** (input.productCoeff as number) /
        reactantPressure ** (input.reactantCoeff as number),
    };
  },
});
export const runKpFromPartialPressures = kpFromPartialPressuresTool.execute;
export default kpFromPartialPressuresTool;

export type KpFromPartialPressuresInput = {
  readonly reactantPressureAtm: number;
  readonly productPressureAtm: number;
  readonly reactantCoeff: number;
  readonly productCoeff: number;
};

export type KpFromPartialPressuresOutput = {
  readonly kp: number;
};

export const kpFromPartialPressuresExample = {
  input: {
    reactantPressureAtm: 1,
    productPressureAtm: 1,
    reactantCoeff: 1,
    productCoeff: 1,
  },
  output: {
    kp: 1,
  },
} satisfies ToolExample<
  KpFromPartialPressuresInput,
  KpFromPartialPressuresOutput
>;
