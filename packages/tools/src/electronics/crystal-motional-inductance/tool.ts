import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrystalMotionalInductanceInput = Readonly<{
  readonly seriesFrequencyHz: number;
  readonly motionalCapacitanceF: number;
}>;
export type CrystalMotionalInductanceOutput = Readonly<{
  readonly motionalInductanceH: number;
}>;

export const calculateCrystalMotionalInductance = (
  x: CrystalMotionalInductanceInput,
): CrystalMotionalInductanceOutput => {
  if (!Number.isFinite(x.seriesFrequencyHz) || x.seriesFrequencyHz < 0)
    simpleError("seriesFrequencyHz", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.motionalCapacitanceF) || x.motionalCapacitanceF < 0)
    simpleError("motionalCapacitanceF", "Provide a finite number at least 0.");
  if (!(x.seriesFrequencyHz > 0 && x.motionalCapacitanceF > 0))
    simpleError(
      "input",
      "Frequency and motional capacitance must be positive.",
    );
  const motionalInductanceH =
    1 / ((2 * Math.PI * x.seriesFrequencyHz) ** 2 * x.motionalCapacitanceF);
  if (!Number.isFinite(motionalInductanceH))
    simpleError("motionalInductanceH", "The inputs produce an invalid result.");
  return {
    motionalInductanceH: Object.is(motionalInductanceH, -0)
      ? 0
      : motionalInductanceH,
  };
};

export const example = {
  input: { seriesFrequencyHz: 10000000, motionalCapacitanceF: 1e-14 },
  output: { motionalInductanceH: 0.025330295910584444 },
} satisfies ToolExample<
  CrystalMotionalInductanceInput,
  CrystalMotionalInductanceOutput
>;

export const tool = createSimpleTool({
  id: "electronics/crystal-motional-inductance",
  title: "Crystal Motional Inductance",
  description:
    "Calculate motional inductance from a crystal's series-resonant frequency and motional capacitance.",
  inputs: [
    {
      id: "seriesFrequencyHz",
      kind: "number",
      label: "Series resonance frequency",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "motionalCapacitanceF",
      kind: "number",
      label: "Motional capacitance",
      unit: "F",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "motionalInductanceH",
      kind: "number",
      label: "Motional inductance",
      unit: "H",
    },
  ],
  calculate: (input) =>
    calculateCrystalMotionalInductance({
      seriesFrequencyHz: input.seriesFrequencyHz as number,
      motionalCapacitanceF: input.motionalCapacitanceF as number,
    }),
});
export const crystalMotionalInductanceTool = tool;
export const runCrystalMotionalInductance = tool.execute;
export default tool;
