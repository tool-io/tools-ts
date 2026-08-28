import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const daltonPartialPressureExample = {
  input: { moleFraction: 0.21, totalPressureKpa: 101.325 },
} satisfies ToolExample<{
  readonly moleFraction: number;
  readonly totalPressureKpa: number;
}>;

export const daltonPartialPressureTool = createSimpleTool({
  id: "chemistry/dalton-partial-pressure",
  title: "Dalton Partial Pressure",
  description:
    "Compute the partial pressure of a gas as total pressure times its mole fraction.",
  inputs: [
    {
      id: "totalPressureKpa",
      label: "Total pressure",
      kind: "number",
      unit: "kPa",
    },
    {
      id: "moleFraction",
      label: "Mole fraction",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "partialPressureKpa",
      label: "Partial pressure",
      kind: "number",
      unit: "kPa",
    },
  ],
  calculate: (input) => {
    const totalPressureKpa = input.totalPressureKpa as number;
    const moleFraction = input.moleFraction as number;
    if (!(totalPressureKpa > 0))
      simpleError("totalPressureKpa", "Total pressure must be positive.");
    return { partialPressureKpa: totalPressureKpa * moleFraction };
  },
});
export const runDaltonPartialPressure = daltonPartialPressureTool.execute;
export default daltonPartialPressureTool;
