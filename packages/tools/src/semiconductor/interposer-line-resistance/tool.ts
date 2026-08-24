import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const COPPER_RESISTIVITY_OHM_METER = 1.68e-8;

export type InterposerLineResistanceInput = {
  readonly lengthUm: number;
  readonly lineWidthUm: number;
  readonly metalThicknessUm: number;
};

export type InterposerLineResistanceOutput = {
  readonly resistanceMilliohms: number;
};

export const interposerLineResistanceExample = {
  input: { lengthUm: 1000, lineWidthUm: 2, metalThicknessUm: 1 },
  output: { resistanceMilliohms: 8400.000000000002 },
} satisfies ToolExample<
  InterposerLineResistanceInput,
  InterposerLineResistanceOutput
>;

export const interposerLineResistanceTool = createSimpleTool({
  calculate: (input) => {
    const length = input.lengthUm as number;
    const width = input.lineWidthUm as number;
    const thickness = input.metalThicknessUm as number;
    if (!(length > 0))
      simpleError(
        "lengthUm",
        "Line length must be positive.",
        "invalid_length",
      );
    if (!(width > 0))
      simpleError(
        "lineWidthUm",
        "Line width must be positive.",
        "invalid_width",
      );
    if (!(thickness > 0))
      simpleError(
        "metalThicknessUm",
        "Metal thickness must be positive.",
        "invalid_thickness",
      );
    const resistanceMilliohms =
      ((COPPER_RESISTIVITY_OHM_METER * (length * 1e-6)) /
        (width * 1e-6 * thickness * 1e-6)) *
      1000;
    if (!Number.isFinite(resistanceMilliohms) || resistanceMilliohms <= 0)
      simpleError(
        "lengthUm",
        "The line resistance is outside the representable range.",
        "numeric_range",
      );
    return { resistanceMilliohms };
  },
  description:
    "Compute the DC resistance of a copper interposer or redistribution line from its length, width, and metal thickness.",
  id: "semiconductor/interposer-line-resistance",
  inputs: [
    {
      description: "Routing length of the copper line.",
      id: "lengthUm",
      kind: "number",
      label: "Line length",
      minimum: Number.MIN_VALUE,
      unit: "µm",
    },
    {
      description: "Lithographic width of the copper line.",
      id: "lineWidthUm",
      kind: "number",
      label: "Line width",
      minimum: Number.MIN_VALUE,
      unit: "µm",
    },
    {
      description: "Copper thickness of the line.",
      id: "metalThicknessUm",
      kind: "number",
      label: "Metal thickness",
      minimum: Number.MIN_VALUE,
      unit: "µm",
    },
  ],
  outputs: [
    {
      description: "DC line resistance assuming bulk copper resistivity.",
      id: "resistanceMilliohms",
      kind: "number",
      label: "Line resistance",
      unit: "mΩ",
    },
  ],
  title: "Interposer Line Resistance Calculator",
});
export const runInterposerLineResistance = interposerLineResistanceTool.execute;
export default interposerLineResistanceTool;
