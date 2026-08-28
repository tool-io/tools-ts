import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const potentiometryNernstSlopeExample = {
  input: { ionChargeInt: 1, measuredSlopeMV: 58.5 },
  output: {
    deviationPercent: 1.1156186612576007,
    expectedSlopeMV: 59.16,
  },
} satisfies ToolExample<
  {
    readonly ionChargeInt: number;
    readonly measuredSlopeMV: number;
  },
  {
    readonly deviationPercent: number;
    readonly expectedSlopeMV: number;
  }
>;

export const potentiometryNernstSlopeTool = createSimpleTool({
  id: "chemistry/potentiometry-nernst-slope",
  title: "Nernst Slope Check",
  description:
    "Compare a measured electrode slope against the ideal Nernst slope of 59.16 mV per charge at 25 degrees Celsius.",
  inputs: [
    {
      id: "measuredSlopeMV",
      label: "Measured slope",
      kind: "number",
      unit: "mV",
    },
    {
      id: "ionChargeInt",
      label: "Ion charge",
      kind: "integer",
      maximum: 3,
      minimum: -3,
    },
  ],
  outputs: [
    {
      id: "expectedSlopeMV",
      label: "Expected slope",
      kind: "number",
      unit: "mV",
    },
    { id: "deviationPercent", label: "Deviation", kind: "number", unit: "%" },
  ],
  calculate: (input) => {
    const measuredSlopeMV = input.measuredSlopeMV as number;
    const ionChargeInt = input.ionChargeInt as number;
    if (measuredSlopeMV === 0)
      simpleError("measuredSlopeMV", "Measured slope must be nonzero.");
    if (ionChargeInt === 0)
      simpleError("ionChargeInt", "Ion charge must be nonzero.");
    const expectedSlopeMV = 59.16 / Math.abs(ionChargeInt);
    return {
      expectedSlopeMV,
      deviationPercent:
        (Math.abs(Math.abs(measuredSlopeMV) - expectedSlopeMV) /
          expectedSlopeMV) *
        100,
    };
  },
});
export const runPotentiometryNernstSlope = potentiometryNernstSlopeTool.execute;
export default potentiometryNernstSlopeTool;
