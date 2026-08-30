import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EarphoneImpedanceInput = Readonly<{
  readonly rmsVolts: number;
  readonly rmsAmperes: number;
}>;
export type EarphoneImpedanceOutput = Readonly<{
  readonly impedanceOhms: number;
}>;

export const calculateEarphoneImpedance = (
  x: EarphoneImpedanceInput,
): EarphoneImpedanceOutput => {
  if (!Number.isFinite(x.rmsVolts) || x.rmsVolts < 0)
    simpleError("rmsVolts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.rmsAmperes) || x.rmsAmperes < 0)
    simpleError("rmsAmperes", "Provide a finite number at least 0.");
  const impedanceOhms = x.rmsVolts / x.rmsAmperes;
  if (!Number.isFinite(impedanceOhms))
    simpleError(
      "impedanceOhms",
      "Inputs produce an undefined or non-finite result.",
    );
  return { impedanceOhms: Object.is(impedanceOhms, -0) ? 0 : impedanceOhms };
};

export const example = {
  input: { rmsVolts: 1, rmsAmperes: 0.02 },
  output: { impedanceOhms: 50 },
} satisfies ToolExample<EarphoneImpedanceInput, EarphoneImpedanceOutput>;

export const tool = createSimpleTool({
  id: "electronics/earphone-impedance",
  title: "Earphone Impedance",
  description:
    "Magnitude of earphone electrical impedance from RMS voltage and RMS current at the same sinusoidal test frequency.",
  inputs: [
    {
      id: "rmsVolts",
      kind: "number",
      label: "Rms Volts",
      unit: "V",
      minimum: 0,
    },
    {
      id: "rmsAmperes",
      kind: "number",
      label: "Rms Amperes",
      unit: "A",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "impedanceOhms", kind: "number", label: "Impedance Ohms", unit: "Ω" },
  ],
  calculate: (input) =>
    calculateEarphoneImpedance({
      rmsVolts: input.rmsVolts as number,
      rmsAmperes: input.rmsAmperes as number,
    }),
});
export const earphoneImpedanceTool = tool;
export const runEarphoneImpedance = tool.execute;
export default tool;
