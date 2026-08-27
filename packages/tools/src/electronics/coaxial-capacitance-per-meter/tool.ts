import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CoaxialCapacitancePerMeterInput = {
  readonly dielectricConstant: number;
  readonly diameterInner: number;
  readonly diameterOuter: number;
};

export type CoaxialCapacitancePerMeterOutput = {
  readonly capacitancePfPerMeter: number;
};

export const coaxialCapacitancePerMeterExample = {
  input: { dielectricConstant: 2.25, diameterInner: 1, diameterOuter: 5 },
  output: { capacitancePfPerMeter: 33.69188682649495 },
} satisfies ToolExample<
  CoaxialCapacitancePerMeterInput,
  CoaxialCapacitancePerMeterOutput
>;

export const coaxialCapacitancePerMeterTool = createSimpleTool({
  calculate: (input) => {
    const dielectricConstant = input.dielectricConstant as number;
    const diameterInner = input.diameterInner as number;
    const diameterOuter = input.diameterOuter as number;
    if (!(dielectricConstant > 1))
      simpleError(
        "dielectricConstant",
        "Dielectric constant must exceed one.",
        "invalid_dimensions",
      );
    if (!(diameterOuter > diameterInner && diameterInner > 0))
      simpleError(
        "diameterOuter",
        "Outer diameter must exceed a positive inner diameter.",
        "invalid_dimensions",
      );
    return {
      capacitancePfPerMeter:
        (24.1 * dielectricConstant) / Math.log(diameterOuter / diameterInner),
    };
  },
  description:
    "Compute coaxial cable capacitance per meter as 24.1 x er / ln(d_outer/d_inner) with diameters in matching units.",
  id: "electronics/coaxial-capacitance-per-meter",
  inputs: [
    {
      id: "dielectricConstant",
      kind: "number",
      label: "Dielectric constant",
    },
    { id: "diameterInner", kind: "number", label: "Inner diameter" },
    { id: "diameterOuter", kind: "number", label: "Outer diameter" },
  ],
  outputs: [
    {
      id: "capacitancePfPerMeter",
      kind: "number",
      label: "Capacitance per meter",
      unit: "pF/m",
    },
  ],
  title: "Coax C Per Meter",
});
export const runCoaxialCapacitancePerMeter =
  coaxialCapacitancePerMeterTool.execute;
export default coaxialCapacitancePerMeterTool;
