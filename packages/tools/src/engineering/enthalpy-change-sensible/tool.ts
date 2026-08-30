import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EnthalpyChangeSensibleInput = Readonly<{
  readonly specificJoulesPerKgKelvin: number;
  readonly temperatureChangeKelvin: number;
}>;
export type EnthalpyChangeSensibleOutput = Readonly<{
  readonly enthalpyChangeJoulesPerKg: number;
}>;

export const calculateEnthalpyChangeSensible = (
  x: EnthalpyChangeSensibleInput,
): EnthalpyChangeSensibleOutput => {
  if (
    !Number.isFinite(x.specificJoulesPerKgKelvin) ||
    x.specificJoulesPerKgKelvin < 0
  )
    simpleError(
      "specificJoulesPerKgKelvin",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.temperatureChangeKelvin))
    simpleError("temperatureChangeKelvin", "Provide a finite number.");
  const enthalpyChangeJoulesPerKg =
    x.specificJoulesPerKgKelvin * x.temperatureChangeKelvin;
  if (!Number.isFinite(enthalpyChangeJoulesPerKg))
    simpleError(
      "enthalpyChangeJoulesPerKg",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    enthalpyChangeJoulesPerKg: Object.is(enthalpyChangeJoulesPerKg, -0)
      ? 0
      : enthalpyChangeJoulesPerKg,
  };
};

export const example = {
  input: { specificJoulesPerKgKelvin: 1000, temperatureChangeKelvin: 20 },
  output: { enthalpyChangeJoulesPerKg: 20000 },
} satisfies ToolExample<
  EnthalpyChangeSensibleInput,
  EnthalpyChangeSensibleOutput
>;

export const tool = createSimpleTool({
  id: "engineering/enthalpy-change-sensible",
  title: "Enthalpy Change Sensible",
  description:
    "Sensible specific enthalpy change cpΔT assuming constant specific heat and no phase change.",
  inputs: [
    {
      id: "specificJoulesPerKgKelvin",
      kind: "number",
      label: "Specific Joules Per Kg Kelvin",
      unit: "J/(kg·K)",
      minimum: 0,
    },
    {
      id: "temperatureChangeKelvin",
      kind: "number",
      label: "Temperature Change Kelvin",
      unit: "K",
    },
  ],
  outputs: [
    {
      id: "enthalpyChangeJoulesPerKg",
      kind: "number",
      label: "Enthalpy Change Joules Per Kg",
      unit: "J/kg",
    },
  ],
  calculate: (input) =>
    calculateEnthalpyChangeSensible({
      specificJoulesPerKgKelvin: input.specificJoulesPerKgKelvin as number,
      temperatureChangeKelvin: input.temperatureChangeKelvin as number,
    }),
});
export const enthalpyChangeSensibleTool = tool;
export const runEnthalpyChangeSensible = tool.execute;
export default tool;
