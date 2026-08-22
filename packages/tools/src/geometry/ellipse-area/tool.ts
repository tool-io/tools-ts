import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const ellipseAreaExample = {
  input: { semiMajorAxis: 5, semiMinorAxis: 3 },
  output: { area: 47.1238898038 },
} satisfies ToolExample<EllipseAreaInput, EllipseAreaOutput>;

export type EllipseAreaInput = {
  readonly semiMajorAxis: number;
  readonly semiMinorAxis: number;
};
export type EllipseAreaOutput = { readonly area: number };

export const calculateEllipseArea = (
  input: EllipseAreaInput,
): EllipseAreaOutput => {
  if (input.semiMajorAxis < 0 || input.semiMinorAxis < 0)
    simpleError(
      "semiMajorAxis",
      "Both axes must be positive.",
      "invalid_input",
    );
  return {
    area: Number(
      (Math.PI * input.semiMajorAxis * input.semiMinorAxis).toPrecision(12),
    ),
  };
};

export const ellipseAreaTool = createSimpleTool({
  calculate: (input) =>
    calculateEllipseArea(input as unknown as EllipseAreaInput),
  description:
    "Compute the area of an ellipse from its semi-major and semi-minor axes.",
  id: "geometry/ellipse-area",
  inputs: [
    {
      id: "semiMajorAxis",
      kind: "number",
      label: "Semi-major axis",
      minimum: 0,
    },
    {
      id: "semiMinorAxis",
      kind: "number",
      label: "Semi-minor axis",
      minimum: 0,
    },
  ],
  outputs: [{ id: "area", kind: "number", label: "Area" }],
  title: "Ellipse Area Calculator",
});
export const runEllipseArea = ellipseAreaTool.execute;
export default ellipseAreaTool;
