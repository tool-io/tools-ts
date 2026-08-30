import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ProportionalSymbolRadiusInput = Readonly<{
  readonly value: number;
  readonly areaSquareMillimetersPerUnit: number;
}>;
export type ProportionalSymbolRadiusOutput = Readonly<{
  readonly radiusMillimeters: number;
}>;

export const calculateProportionalSymbolRadius = (
  x: ProportionalSymbolRadiusInput,
): ProportionalSymbolRadiusOutput => {
  if (!Number.isFinite(x.value) || x.value < 0)
    simpleError("value", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.areaSquareMillimetersPerUnit) ||
    x.areaSquareMillimetersPerUnit <= 0
  )
    simpleError(
      "areaSquareMillimetersPerUnit",
      "Provide a finite positive number.",
    );
  const radiusMillimeters = Math.sqrt(
    (x.value * x.areaSquareMillimetersPerUnit) / Math.PI,
  );
  if (!Number.isFinite(radiusMillimeters))
    simpleError(
      "radiusMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    radiusMillimeters: Object.is(radiusMillimeters, -0) ? 0 : radiusMillimeters,
  };
};

export const example = {
  input: {
    value: 100,
    areaSquareMillimetersPerUnit: 1,
  },
  output: { radiusMillimeters: 5.641895835477563 },
} satisfies ToolExample<
  ProportionalSymbolRadiusInput,
  ProportionalSymbolRadiusOutput
>;

export const tool = createSimpleTool({
  id: "cartography/proportional-symbol-radius",
  title: "Proportional Symbol Radius",
  description:
    "Circle radius in millimetres whose area is proportional to value at a specified square-millimetres-per-unit scale.",
  inputs: [
    { id: "value", kind: "number", label: "Value", minimum: 0 },
    {
      id: "areaSquareMillimetersPerUnit",
      kind: "number",
      label: "Area Square Millimeters Per Unit",
      unit: "mm2/unit",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "radiusMillimeters",
      kind: "number",
      label: "Radius Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateProportionalSymbolRadius({
      value: input.value as number,
      areaSquareMillimetersPerUnit:
        input.areaSquareMillimetersPerUnit as number,
    }),
});
export const proportionalSymbolRadiusTool = tool;
export const runProportionalSymbolRadius = tool.execute;
export default tool;
