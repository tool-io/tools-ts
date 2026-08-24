import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BandgapNarrowingInput = {
  readonly dopingPerCm3: number;
};

export type BandgapNarrowingOutput = {
  readonly narrowingMeV: number;
};

export const bandgapNarrowingExample = {
  input: { dopingPerCm3: 1e18 },
  output: { narrowingMeV: 18 },
} satisfies ToolExample<BandgapNarrowingInput, BandgapNarrowingOutput>;

export const calculateBandgapNarrowing = (
  input: BandgapNarrowingInput,
): BandgapNarrowingOutput => {
  const dopingPerCm3 = input.dopingPerCm3;

  if (!Number.isFinite(dopingPerCm3))
    simpleError(
      "dopingPerCm3",
      "Doping concentration must be a finite number.",
      "invalid_doping",
    );

  if (dopingPerCm3 <= 0)
    simpleError(
      "dopingPerCm3",
      "Doping concentration must be positive.",
      "invalid_doping",
    );

  // Subtract logarithms so concentrations far below 1e17 do not underflow
  // while forming N / 1e17.
  const raw = 18 * (Math.log10(dopingPerCm3) - 17);
  if (!Number.isFinite(raw))
    simpleError(
      "dopingPerCm3",
      "Bandgap narrowing overflowed.",
      "numeric_overflow",
    );

  const narrowingMeV = Math.max(0, raw);
  if (!Number.isFinite(narrowingMeV))
    simpleError(
      "dopingPerCm3",
      "Bandgap narrowing overflowed.",
      "numeric_overflow",
    );

  return { narrowingMeV: narrowingMeV === 0 ? 0 : narrowingMeV };
};

export const bandgapNarrowingTool = createSimpleTool({
  calculate: (input) =>
    calculateBandgapNarrowing({
      dopingPerCm3: input.dopingPerCm3 as number,
    }),
  description:
    "Estimate heavy-doping bandgap narrowing in silicon relative to a 1e17 cm^-3 reference: ΔEg[meV]=max(0,18·log10(N/1e17)) where N is dopingPerCm3>0 cm^-3. Clamped to >=0 meV below reference. Empirical log-decade model for silicon; neglects temperature, compensation, and degeneracy beyond the fitted decade slope; invalid for N<=0.",
  id: "semiconductor/bandgap-narrowing",
  inputs: [
    {
      description:
        "Doping concentration. Must be a finite number greater than 0 cm^-3 (reference 1e17 cm^-3; narrowing zero at/below reference).",
      format: "density-per-cm3",
      id: "dopingPerCm3",
      kind: "number",
      label: "Doping concentration",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
    },
  ],
  outputs: [
    {
      description: "Bandgap narrowing (magnitude). At least 0 meV.",
      format: "energy-mev",
      id: "narrowingMeV",
      kind: "number",
      label: "Bandgap narrowing",
      minimum: 0,
      unit: "meV",
    },
  ],
  title: "Bandgap Narrowing Calculator",
});
export const runBandgapNarrowing = bandgapNarrowingTool.execute;
export default bandgapNarrowingTool;
