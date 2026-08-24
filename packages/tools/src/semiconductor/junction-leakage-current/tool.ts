import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type JunctionLeakageCurrentInput = {
  readonly junctionAreaUm2: number;
  readonly saturationCurrentDensityPicoAPerUm2: number;
};

export type JunctionLeakageCurrentOutput = {
  readonly leakagePicoAmperes: number;
};

export const junctionLeakageCurrentExample = {
  input: { junctionAreaUm2: 2, saturationCurrentDensityPicoAPerUm2: 0.5 },
  output: { leakagePicoAmperes: 1 },
} satisfies ToolExample<
  JunctionLeakageCurrentInput,
  JunctionLeakageCurrentOutput
>;

export const junctionLeakageCurrentTool = createSimpleTool({
  calculate: (input) => {
    const junctionAreaUm2 = input.junctionAreaUm2 as number;
    const saturationCurrentDensityPicoAPerUm2 =
      input.saturationCurrentDensityPicoAPerUm2 as number;
    if (!(junctionAreaUm2 > 0))
      simpleError(
        "junctionAreaUm2",
        "Junction area must be positive.",
        "invalid_junction_area",
      );
    const leakagePicoAmperes =
      saturationCurrentDensityPicoAPerUm2 * junctionAreaUm2;
    if (!Number.isFinite(leakagePicoAmperes))
      simpleError(
        "junctionAreaUm2",
        "The leakage current is outside the representable range.",
        "numeric_range",
      );
    return { leakagePicoAmperes };
  },
  description:
    "Scale a reverse-biased junction's saturation current density by its area to total leakage current.",
  id: "semiconductor/junction-leakage-current",
  inputs: [
    {
      description: "Area of the reverse-biased junction.",
      format: "area-um2",
      id: "junctionAreaUm2",
      kind: "number",
      label: "Junction area",
      minimum: Number.MIN_VALUE,
      unit: "um^2",
    },
    {
      description: "Saturation leakage current density.",
      format: "current-density-pa-per-um2",
      id: "saturationCurrentDensityPicoAPerUm2",
      kind: "number",
      label: "Saturation current density",
      minimum: 0,
      unit: "pA/um^2",
    },
  ],
  outputs: [
    {
      description: "Total junction leakage current.",
      format: "current-pa",
      id: "leakagePicoAmperes",
      kind: "number",
      label: "Leakage current",
      minimum: 0,
      unit: "pA",
    },
  ],
  title: "Junction Leakage Calculator",
});
export const runJunctionLeakageCurrent = junctionLeakageCurrentTool.execute;
export default junctionLeakageCurrentTool;
