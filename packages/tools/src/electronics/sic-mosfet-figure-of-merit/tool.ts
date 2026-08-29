import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SicMosfetFigureOfMeritInput = Readonly<{
  readonly onResistanceOhms: number;
  readonly gateChargeCoulombs: number;
}>;
export type SicMosfetFigureOfMeritOutput = Readonly<{
  figureOfMeritOhmCoulombs: number;
}>;

export const calculateSicMosfetFigureOfMerit = (
  i: SicMosfetFigureOfMeritInput,
): SicMosfetFigureOfMeritOutput => {
  const value = i.onResistanceOhms * i.gateChargeCoulombs;
  if (!Number.isFinite(value))
    simpleError(
      "figureOfMeritOhmCoulombs",
      "The inputs produce a non-finite result.",
    );
  return { figureOfMeritOhmCoulombs: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { onResistanceOhms: 0.04, gateChargeCoulombs: 5e-8 },
  output: { figureOfMeritOhmCoulombs: 2e-9 },
} satisfies ToolExample<
  SicMosfetFigureOfMeritInput,
  SicMosfetFigureOfMeritOutput
>;

export const tool = createSimpleTool({
  id: "electronics/sic-mosfet-figure-of-merit",
  title: "SiC Mosfet Figure Of Merit",
  description:
    "Calculate the common SiC MOSFET device figure of merit RDS(on)×Qg from specified on-resistance and total gate charge at matching test conditions.",
  inputs: [
    {
      id: "onResistanceOhms",
      kind: "number",
      label: "On Resistance (Ω)",
      unit: "Ω",
      minimum: 0,
    },
    {
      id: "gateChargeCoulombs",
      kind: "number",
      label: "Gate Charge (C)",
      unit: "C",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "figureOfMeritOhmCoulombs",
      kind: "number",
      label: "Figure Of Merit (Ω·C)",
      unit: "Ω·C",
    },
  ],
  calculate: (input) =>
    calculateSicMosfetFigureOfMerit({
      onResistanceOhms: input.onResistanceOhms as number,
      gateChargeCoulombs: input.gateChargeCoulombs as number,
    }),
});
export const sicMosfetFigureOfMeritTool = tool;
export const runSicMosfetFigureOfMerit = tool.execute;
export default tool;
