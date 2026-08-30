import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ExtrusionPressureInput = Readonly<{
  readonly meanFlowStressMegapascals: number;
  readonly initialAreaSquareMillimeters: number;
  readonly finalAreaSquareMillimeters: number;
}>;
export type ExtrusionPressureOutput = Readonly<{
  readonly pressureMegapascals: number;
}>;

export const calculateExtrusionPressure = (
  x: ExtrusionPressureInput,
): ExtrusionPressureOutput => {
  if (
    !Number.isFinite(x.meanFlowStressMegapascals) ||
    x.meanFlowStressMegapascals < 0
  )
    simpleError(
      "meanFlowStressMegapascals",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.initialAreaSquareMillimeters) ||
    x.initialAreaSquareMillimeters < 0
  )
    simpleError(
      "initialAreaSquareMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.finalAreaSquareMillimeters) ||
    x.finalAreaSquareMillimeters < 0
  )
    simpleError(
      "finalAreaSquareMillimeters",
      "Provide a finite number at least 0.",
    );
  if (x.finalAreaSquareMillimeters >= x.initialAreaSquareMillimeters)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const pressureMegapascals =
    x.meanFlowStressMegapascals *
    Math.log(x.initialAreaSquareMillimeters / x.finalAreaSquareMillimeters);
  if (!Number.isFinite(pressureMegapascals))
    simpleError(
      "pressureMegapascals",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    pressureMegapascals: Object.is(pressureMegapascals, -0)
      ? 0
      : pressureMegapascals,
  };
};

export const example = {
  input: {
    meanFlowStressMegapascals: 200,
    initialAreaSquareMillimeters: 100,
    finalAreaSquareMillimeters: 25,
  },
  output: { pressureMegapascals: 277.25887222397813 },
} satisfies ToolExample<ExtrusionPressureInput, ExtrusionPressureOutput>;

export const tool = createSimpleTool({
  id: "engineering/extrusion-pressure",
  title: "Extrusion Pressure",
  description:
    "Ideal frictionless extrusion pressure from a supplied mean flow stress times ln(initial area/final area); actual die pressure may be higher.",
  inputs: [
    {
      id: "meanFlowStressMegapascals",
      kind: "number",
      label: "Mean Flow Stress Megapascals",
      unit: "MPa",
      minimum: 0,
    },
    {
      id: "initialAreaSquareMillimeters",
      kind: "number",
      label: "Initial Area Square Millimeters",
      unit: "mm²",
      minimum: 0,
    },
    {
      id: "finalAreaSquareMillimeters",
      kind: "number",
      label: "Final Area Square Millimeters",
      unit: "mm²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "pressureMegapascals",
      kind: "number",
      label: "Pressure Megapascals",
      unit: "MPa",
    },
  ],
  calculate: (input) =>
    calculateExtrusionPressure({
      meanFlowStressMegapascals: input.meanFlowStressMegapascals as number,
      initialAreaSquareMillimeters:
        input.initialAreaSquareMillimeters as number,
      finalAreaSquareMillimeters: input.finalAreaSquareMillimeters as number,
    }),
});
export const extrusionPressureTool = tool;
export const runExtrusionPressure = tool.execute;
export default tool;
