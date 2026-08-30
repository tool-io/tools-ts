import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ProportionalLegendValueSolverInput = Readonly<{
  readonly radiusMillimeters: number;
  readonly areaSquareMillimetersPerUnit: number;
}>;
export type ProportionalLegendValueSolverOutput = Readonly<{
  readonly value: number;
}>;

export const calculateProportionalLegendValueSolver = (
  x: ProportionalLegendValueSolverInput,
): ProportionalLegendValueSolverOutput => {
  if (!Number.isFinite(x.radiusMillimeters) || x.radiusMillimeters < 0)
    simpleError("radiusMillimeters", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.areaSquareMillimetersPerUnit) ||
    x.areaSquareMillimetersPerUnit <= 0
  )
    simpleError(
      "areaSquareMillimetersPerUnit",
      "Provide a finite positive number.",
    );
  const value =
    (Math.PI * x.radiusMillimeters ** 2) / x.areaSquareMillimetersPerUnit;
  if (!Number.isFinite(value))
    simpleError("value", "Inputs produce an undefined or out-of-range result.");
  return { value: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    radiusMillimeters: 10,
    areaSquareMillimetersPerUnit: 1,
  },
  output: { value: 314.1592653589793 },
} satisfies ToolExample<
  ProportionalLegendValueSolverInput,
  ProportionalLegendValueSolverOutput
>;

export const tool = createSimpleTool({
  id: "cartography/proportional-legend-value-solver",
  title: "Proportional Legend Value Solver",
  description:
    "Value represented by a circle radius at a specified square-millimetres-per-unit scale.",
  inputs: [
    {
      id: "radiusMillimeters",
      kind: "number",
      label: "Radius Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "areaSquareMillimetersPerUnit",
      kind: "number",
      label: "Area Square Millimeters Per Unit",
      unit: "mm2/unit",
      minimum: 0,
    },
  ],
  outputs: [{ id: "value", kind: "number", label: "Value" }],
  calculate: (input) =>
    calculateProportionalLegendValueSolver({
      radiusMillimeters: input.radiusMillimeters as number,
      areaSquareMillimetersPerUnit:
        input.areaSquareMillimetersPerUnit as number,
    }),
});
export const proportionalLegendValueSolverTool = tool;
export const runProportionalLegendValueSolver = tool.execute;
export default tool;
