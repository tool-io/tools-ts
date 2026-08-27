import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CoaxialInductancePerMeterInput = {
  readonly diameterInner: number;
  readonly diameterOuter: number;
};

export type CoaxialInductancePerMeterOutput = {
  readonly inductanceNhPerMeter: number;
};

export const coaxialInductancePerMeterExample = {
  input: { diameterInner: 1, diameterOuter: 5 },
  output: { inductanceNhPerMeter: 321.88758248682007 },
} satisfies ToolExample<
  CoaxialInductancePerMeterInput,
  CoaxialInductancePerMeterOutput
>;

export const coaxialInductancePerMeterTool = createSimpleTool({
  calculate: (input) => {
    const diameterInner = input.diameterInner as number;
    const diameterOuter = input.diameterOuter as number;
    if (!(diameterOuter > diameterInner && diameterInner > 0))
      simpleError(
        "diameterOuter",
        "Outer diameter must exceed a positive inner diameter.",
        "invalid_dimensions",
      );
    return {
      inductanceNhPerMeter: 200 * Math.log(diameterOuter / diameterInner),
    };
  },
  description:
    "Compute coaxial cable inductance per meter as 200 x ln(d_outer/d_inner) nH/m from the loop inductance mu_0/2pi x ln(b/a).",
  id: "electronics/coaxial-inductance-per-meter",
  inputs: [
    { id: "diameterInner", kind: "number", label: "Inner diameter" },
    { id: "diameterOuter", kind: "number", label: "Outer diameter" },
  ],
  outputs: [
    {
      id: "inductanceNhPerMeter",
      kind: "number",
      label: "Inductance per meter",
      unit: "nH/m",
    },
  ],
  title: "Coax L Per Meter",
});
export const runCoaxialInductancePerMeter =
  coaxialInductancePerMeterTool.execute;
export default coaxialInductancePerMeterTool;
