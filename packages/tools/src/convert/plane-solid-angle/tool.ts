import type { ToolExample } from "../../core/example.js";
import {
  createDimensionalConversionTool,
  type DimensionalUnit,
} from "../dimensional-conversion.js";

export const units = {
  rad: { dimension: "plane", factor: 1 },
  deg: { dimension: "plane", factor: 0.017453292519943295 },
  arcmin: { dimension: "plane", factor: 0.0002908882086657216 },
  arcsec: { dimension: "plane", factor: 0.00000484813681109536 },
  turn: { dimension: "plane", factor: 6.283185307179586 },
  sr: { dimension: "solid", factor: 1 },
  "deg²": { dimension: "solid", factor: 0.00030461741978670857 },
  "arcmin²": { dimension: "solid", factor: 8.461594994075237e-8 },
} satisfies Readonly<Record<string, DimensionalUnit>>;
export const example = {
  input: { fromUnit: "deg", toUnit: "rad", value: 180 },
  output: { unit: "rad", value: 3.141592653589793 },
} satisfies ToolExample<
  {
    readonly fromUnit: string;
    readonly toUnit: string;
    readonly value: number;
  },
  { readonly unit: string; readonly value: number }
>;
export const tool = createDimensionalConversionTool({
  description:
    "Convert plane angles or solid angles without mixing the two dimensions. A square degree is (π/180)² steradians.",
  id: "convert/plane-solid-angle",
  title: "Plane and Solid Angle Converter",
  units,
});
export type PlaneSolidAngleInput = Readonly<typeof example.input>;
export type PlaneSolidAngleOutput = Readonly<typeof example.output>;
export const planeSolidAngleTool = tool;
export const runPlaneSolidAngle = tool.execute;
export default tool;
