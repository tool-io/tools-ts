import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThermalEntropyChangeInput = Readonly<{
  readonly specificJoulesPerKgKelvin: number;
  readonly initialKelvin: number;
  readonly finalKelvin: number;
}>;
export type ThermalEntropyChangeOutput = Readonly<{
  readonly entropyChangeJoulesPerKgKelvin: number;
}>;

export const calculateThermalEntropyChange = (
  x: ThermalEntropyChangeInput,
): ThermalEntropyChangeOutput => {
  if (
    !Number.isFinite(x.specificJoulesPerKgKelvin) ||
    x.specificJoulesPerKgKelvin < 0
  )
    simpleError(
      "specificJoulesPerKgKelvin",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.initialKelvin) || x.initialKelvin < 0)
    simpleError("initialKelvin", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.finalKelvin) || x.finalKelvin < 0)
    simpleError("finalKelvin", "Provide a finite number at least 0.");
  const entropyChangeJoulesPerKgKelvin =
    x.specificJoulesPerKgKelvin * Math.log(x.finalKelvin / x.initialKelvin);
  if (!Number.isFinite(entropyChangeJoulesPerKgKelvin))
    simpleError(
      "entropyChangeJoulesPerKgKelvin",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    entropyChangeJoulesPerKgKelvin: Object.is(
      entropyChangeJoulesPerKgKelvin,
      -0,
    )
      ? 0
      : entropyChangeJoulesPerKgKelvin,
  };
};

export const example = {
  input: {
    specificJoulesPerKgKelvin: 1000,
    initialKelvin: 300,
    finalKelvin: 600,
  },
  output: { entropyChangeJoulesPerKgKelvin: 693.1471805599452 },
} satisfies ToolExample<ThermalEntropyChangeInput, ThermalEntropyChangeOutput>;

export const tool = createSimpleTool({
  id: "engineering/thermal-entropy-change",
  title: "Thermal Entropy Change",
  description:
    "Specific entropy change cp ln(T2/T1) for a constant-specific-heat idealization.",
  inputs: [
    {
      id: "specificJoulesPerKgKelvin",
      kind: "number",
      label: "Specific Joules Per Kg Kelvin",
      unit: "J/(kg·K)",
      minimum: 0,
    },
    {
      id: "initialKelvin",
      kind: "number",
      label: "Initial Kelvin",
      unit: "K",
      minimum: 0,
    },
    {
      id: "finalKelvin",
      kind: "number",
      label: "Final Kelvin",
      unit: "K",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "entropyChangeJoulesPerKgKelvin",
      kind: "number",
      label: "Entropy Change Joules Per Kg Kelvin",
      unit: "J/(kg·K)",
    },
  ],
  calculate: (input) =>
    calculateThermalEntropyChange({
      specificJoulesPerKgKelvin: input.specificJoulesPerKgKelvin as number,
      initialKelvin: input.initialKelvin as number,
      finalKelvin: input.finalKelvin as number,
    }),
});
export const thermalEntropyChangeTool = tool;
export const runThermalEntropyChange = tool.execute;
export default tool;
