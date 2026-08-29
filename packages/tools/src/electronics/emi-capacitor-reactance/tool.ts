import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EmiCapacitorReactanceInput = Readonly<{
  readonly frequencyHz: number;
  readonly capacitanceFarads: number;
}>;
export type EmiCapacitorReactanceOutput = Readonly<{ reactanceOhms: number }>;

export const calculateEmiCapacitorReactance = (
  i: EmiCapacitorReactanceInput,
): EmiCapacitorReactanceOutput => {
  const denominator = 2 * Math.PI * i.frequencyHz * i.capacitanceFarads;
  const value =
    Number.isFinite(denominator) && denominator > 0
      ? 1 / denominator
      : 1 / (2 * Math.PI * (i.frequencyHz * i.capacitanceFarads));
  if (!Number.isFinite(value))
    simpleError("reactanceOhms", "The inputs produce a non-finite result.");
  return { reactanceOhms: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { frequencyHz: 1000, capacitanceFarads: 0.000001 },
  output: { reactanceOhms: 159.15494309189535 },
} satisfies ToolExample<
  EmiCapacitorReactanceInput,
  EmiCapacitorReactanceOutput
>;

export const tool = createSimpleTool({
  id: "electronics/emi-capacitor-reactance",
  title: "EMI Capacitor Reactance",
  description:
    "Calculate the magnitude of ideal capacitor reactance 1/(2πfC) from positive frequency and capacitance, ignoring ESR and parasitics.",
  inputs: [
    {
      id: "frequencyHz",
      kind: "number",
      label: "Frequency (Hz)",
      unit: "Hz",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "capacitanceFarads",
      kind: "number",
      label: "Capacitance (F)",
      unit: "F",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "reactanceOhms", kind: "number", label: "Reactance (Ω)", unit: "Ω" },
  ],
  calculate: (input) =>
    calculateEmiCapacitorReactance({
      frequencyHz: input.frequencyHz as number,
      capacitanceFarads: input.capacitanceFarads as number,
    }),
});
export const emiCapacitorReactanceTool = tool;
export const runEmiCapacitorReactance = tool.execute;
export default tool;
