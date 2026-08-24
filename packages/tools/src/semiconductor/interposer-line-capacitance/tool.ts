import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InterposerLineCapacitanceInput = {
  readonly dielectricConstant?: number;
  readonly dielectricThicknessUm: number;
  readonly lineLengthUm: number;
  readonly lineWidthUm: number;
};

export type InterposerLineCapacitanceOutput = {
  readonly capacitanceFF: number;
};

export const interposerLineCapacitanceExample = {
  input: {
    dielectricConstant: 3.9,
    dielectricThicknessUm: 1,
    lineLengthUm: 100,
    lineWidthUm: 1,
  },
  output: { capacitanceFF: 3.4531332469920004 },
} satisfies ToolExample<
  InterposerLineCapacitanceInput,
  InterposerLineCapacitanceOutput
>;

export const interposerLineCapacitanceTool = createSimpleTool({
  calculate: (input) => {
    const constant = input.dielectricConstant as number;
    const thickness = input.dielectricThicknessUm as number;
    const length = input.lineLengthUm as number;
    const width = input.lineWidthUm as number;
    if (!(width > 0))
      simpleError(
        "lineWidthUm",
        "Line width must be positive.",
        "invalid_width",
      );
    if (!(length > 0))
      simpleError(
        "lineLengthUm",
        "Line length must be positive.",
        "invalid_length",
      );
    if (!(thickness > 0))
      simpleError(
        "dielectricThicknessUm",
        "Dielectric thickness must be positive.",
        "invalid_dielectric_thickness",
      );
    if (!(constant >= 1))
      simpleError(
        "dielectricConstant",
        "Relative permittivity must be at least one.",
        "invalid_dielectric_constant",
      );
    return {
      capacitanceFF: (constant * 0.0088541878128 * width * length) / thickness,
    };
  },
  description:
    "Estimate the parallel-plate capacitance of an interposer routing line from its width, length, dielectric thickness, and dielectric constant.",
  id: "semiconductor/interposer-line-capacitance",
  inputs: [
    {
      default: 3.9,
      id: "dielectricConstant",
      kind: "number",
      label: "Dielectric constant",
      minimum: 1,
    },
    {
      id: "dielectricThicknessUm",
      kind: "number",
      label: "Dielectric thickness",
      minimum: Number.MIN_VALUE,
      unit: "µm",
    },
    {
      id: "lineLengthUm",
      kind: "number",
      label: "Line length",
      minimum: Number.MIN_VALUE,
      unit: "µm",
    },
    {
      id: "lineWidthUm",
      kind: "number",
      label: "Line width",
      minimum: Number.MIN_VALUE,
      unit: "µm",
    },
  ],
  outputs: [
    { id: "capacitanceFF", kind: "number", label: "Capacitance", unit: "fF" },
  ],
  title: "Interposer Line Capacitance Calculator",
});
export const runInterposerLineCapacitance =
  interposerLineCapacitanceTool.execute;
export default interposerLineCapacitanceTool;
