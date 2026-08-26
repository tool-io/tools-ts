import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const lactationCurveWoodExample = {
  input: {
    aConstant: 25,
    bCoefficient: 0.25,
    cCoefficient: 0.0025,
    daysInMilk: 100,
  },
} satisfies ToolExample<{
  readonly aConstant: number;
  readonly bCoefficient: number;
  readonly cCoefficient: number;
  readonly daysInMilk: number;
}>;

export const lactationCurveWoodTool = createSimpleTool({
  id: "biology/lactation-curve-wood",
  title: "Wood Lactation Curve",
  description:
    "Predict daily milk yield with the Wood gamma lactation curve over days in milk.",
  inputs: [
    {
      default: 25,
      id: "aConstant",
      label: "Scale constant a",
      kind: "number",
    },
    {
      default: 0.25,
      id: "bCoefficient",
      label: "Ramp coefficient b",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
    {
      default: 0.0025,
      id: "cCoefficient",
      label: "Decay coefficient c",
      kind: "number",
    },
    {
      id: "daysInMilk",
      label: "Days in milk",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "predictedDailyMilkKg",
      label: "Predicted daily milk kg",
      kind: "number",
      unit: "kg/day",
    },
  ],
  calculate: (input) => {
    const aConstant = input.aConstant as number;
    const bCoefficient = input.bCoefficient as number;
    const cCoefficient = input.cCoefficient as number;
    const daysInMilk = input.daysInMilk as number;
    if (aConstant <= 0)
      simpleError("aConstant", "Scale constant must be greater than zero.");
    if (cCoefficient <= 0)
      simpleError(
        "cCoefficient",
        "Decay coefficient must be greater than zero.",
      );
    return {
      predictedDailyMilkKg:
        aConstant *
        Math.pow(daysInMilk, bCoefficient) *
        Math.exp(-cCoefficient * daysInMilk),
    };
  },
});
export const runLactationCurveWood = lactationCurveWoodTool.execute;
export default lactationCurveWoodTool;
