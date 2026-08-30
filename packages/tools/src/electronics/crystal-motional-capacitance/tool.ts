import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrystalMotionalCapacitanceInput = Readonly<{
  readonly seriesFrequencyHz: number;
  readonly antiresonanceFrequencyHz: number;
  readonly shuntCapacitanceF: number;
}>;
export type CrystalMotionalCapacitanceOutput = Readonly<{
  readonly motionalCapacitanceF: number;
}>;

export const calculateCrystalMotionalCapacitance = (
  x: CrystalMotionalCapacitanceInput,
): CrystalMotionalCapacitanceOutput => {
  if (!Number.isFinite(x.seriesFrequencyHz) || x.seriesFrequencyHz < 0)
    simpleError("seriesFrequencyHz", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.antiresonanceFrequencyHz) ||
    x.antiresonanceFrequencyHz < 0
  )
    simpleError(
      "antiresonanceFrequencyHz",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.shuntCapacitanceF) || x.shuntCapacitanceF < 0)
    simpleError("shuntCapacitanceF", "Provide a finite number at least 0.");
  if (!(
    x.seriesFrequencyHz > 0 &&
    x.antiresonanceFrequencyHz > x.seriesFrequencyHz &&
    x.shuntCapacitanceF > 0
  ))
    simpleError(
      "input",
      "Require positive shunt capacitance and antiresonance above series resonance.",
    );
  const motionalCapacitanceF =
    x.shuntCapacitanceF *
    ((x.antiresonanceFrequencyHz / x.seriesFrequencyHz) ** 2 - 1);
  if (!Number.isFinite(motionalCapacitanceF))
    simpleError(
      "motionalCapacitanceF",
      "The inputs produce an invalid result.",
    );
  return {
    motionalCapacitanceF: Object.is(motionalCapacitanceF, -0)
      ? 0
      : motionalCapacitanceF,
  };
};

export const example = {
  input: {
    seriesFrequencyHz: 10000000,
    antiresonanceFrequencyHz: 10010000,
    shuntCapacitanceF: 1e-12,
  },
  output: { motionalCapacitanceF: 2.0009999999996974e-15 },
} satisfies ToolExample<
  CrystalMotionalCapacitanceInput,
  CrystalMotionalCapacitanceOutput
>;

export const tool = createSimpleTool({
  id: "electronics/crystal-motional-capacitance",
  title: "Crystal Motional Capacitance",
  description:
    "Infer motional capacitance of a Butterworth–Van Dyke crystal model from series and unloaded antiresonance frequencies plus shunt capacitance.",
  inputs: [
    {
      id: "seriesFrequencyHz",
      kind: "number",
      label: "Series resonance frequency",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "antiresonanceFrequencyHz",
      kind: "number",
      label: "Unloaded antiresonance frequency",
      unit: "Hz",
      minimum: 0,
    },
    {
      id: "shuntCapacitanceF",
      kind: "number",
      label: "Shunt capacitance",
      unit: "F",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "motionalCapacitanceF",
      kind: "number",
      label: "Motional capacitance",
      unit: "F",
    },
  ],
  calculate: (input) =>
    calculateCrystalMotionalCapacitance({
      seriesFrequencyHz: input.seriesFrequencyHz as number,
      antiresonanceFrequencyHz: input.antiresonanceFrequencyHz as number,
      shuntCapacitanceF: input.shuntCapacitanceF as number,
    }),
});
export const crystalMotionalCapacitanceTool = tool;
export const runCrystalMotionalCapacitance = tool.execute;
export default tool;
