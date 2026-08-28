import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const LineweaverBurkSlopeTool = createSimpleTool({
  id: "chemistry/lineweaver-burk-slope",
  title: "Lineweaver-Burk Slope Calculator",
  description: "Compute Lineweaver-Burk slope Km/Vmax.",
  inputs: [
    { id: "km", label: "Km", kind: "number", minimum: 0 },
    { id: "vmax", label: "Vmax", kind: "number", minimum: 0 },
  ],
  outputs: [{ id: "slope", label: "Slope", kind: "number" }],
  calculate: (input) => {
    if ((input.vmax as number) === 0)
      simpleError("vmax", "> 0 required.", "invalid_vmax");
    return { slope: (input.km as number) / (input.vmax as number) };
  },
});
export default LineweaverBurkSlopeTool;
export const runLineweaverBurkSlope = LineweaverBurkSlopeTool.execute;

export type LineweaverBurkSlopeInput = {
  readonly km: number;
  readonly vmax: number;
};

export type LineweaverBurkSlopeOutput = {
  readonly slope: number;
};

export const lineweaverBurkSlopeExample = {
  input: {
    km: 1,
    vmax: 1,
  },
  output: {
    slope: 1,
  },
} satisfies ToolExample<LineweaverBurkSlopeInput, LineweaverBurkSlopeOutput>;
