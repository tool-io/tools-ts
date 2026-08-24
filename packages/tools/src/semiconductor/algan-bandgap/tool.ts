import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AlganBandgapInput = {
  readonly aluminumFractionX: number;
};

export type AlganBandgapOutput = {
  readonly bandgapEv: number;
};

export const alganBandgapExample = {
  input: { aluminumFractionX: 0.3 },
  output: { bandgapEv: 4.059 },
} satisfies ToolExample<AlganBandgapInput, AlganBandgapOutput>;

export const calculateAlganBandgap = (
  input: AlganBandgapInput,
): AlganBandgapOutput => {
  const aluminumFractionX = input.aluminumFractionX;
  if (
    !Number.isFinite(aluminumFractionX) ||
    aluminumFractionX < 0 ||
    aluminumFractionX > 1
  )
    simpleError(
      "aluminumFractionX",
      "Aluminum fraction x must be a finite number between 0 and 1.",
      "invalid_fraction",
    );

  const bandgapEv =
    (1 - aluminumFractionX) * 3.42 +
    aluminumFractionX * 6.25 -
    aluminumFractionX * (1 - aluminumFractionX) * 1.0;

  if (!Number.isFinite(bandgapEv))
    simpleError(
      "aluminumFractionX",
      "Band gap could not be calculated due to numeric overflow.",
      "numeric_overflow",
    );
  return { bandgapEv: bandgapEv === 0 ? 0 : bandgapEv };
};

export const alganBandgapTool = createSimpleTool({
  calculate: (input) =>
    calculateAlganBandgap({
      aluminumFractionX: input.aluminumFractionX as number,
    }),
  description:
    "Compute the AlGaN band gap energy from the aluminum fraction using linear interpolation with a documented bowing parameter of 1.0 eV. Eg(x) = (1-x)*3.42 + x*6.25 - x*(1-x)*1.0.",
  id: "semiconductor/algan-bandgap",
  inputs: [
    {
      description:
        "Aluminum mole fraction x in Al_x Ga_(1-x) N. Must be between 0 and 1, inclusive.",
      id: "aluminumFractionX",
      kind: "number",
      label: "Aluminum fraction x",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Band gap energy between approximately 3.42 eV (GaN) and 6.25 eV (AlN), greater than 0 eV.",
      id: "bandgapEv",
      kind: "number",
      label: "Band gap energy",
      minimum: Number.MIN_VALUE,
      unit: "eV",
    },
  ],
  title: "AlGaN Bandgap Calculator",
});
export const runAlganBandgap = alganBandgapTool.execute;
export default alganBandgapTool;
