import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const fatPercentageCarcassExample = {
  input: { carcassWeightKg: 300, fatMassKg: 60 },
} satisfies ToolExample<{
  readonly carcassWeightKg: number;
  readonly fatMassKg: number;
}>;

export const fatPercentageCarcassTool = createSimpleTool({
  id: "biology/fat-percentage-carcass",
  title: "Carcass Fat %",
  description:
    "Compute the dissectible fat mass percentage of a dressed carcass weight.",
  inputs: [
    { id: "fatMassKg", label: "Fat mass kg", kind: "number" },
    { id: "carcassWeightKg", label: "Carcass weight kg", kind: "number" },
  ],
  outputs: [
    {
      id: "fatPercentage",
      label: "Fat percentage",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const fatMassKg = input.fatMassKg as number;
    const carcassWeightKg = input.carcassWeightKg as number;
    if (fatMassKg < 0)
      simpleError("fatMassKg", "Fat mass must not be negative.");
    if (carcassWeightKg <= 0)
      simpleError(
        "carcassWeightKg",
        "Carcass weight must be greater than zero.",
      );
    if (fatMassKg > carcassWeightKg)
      simpleError("fatMassKg", "Fat mass must not exceed carcass weight.");
    return {
      fatPercentage: (fatMassKg / carcassWeightKg) * 100,
    };
  },
});
export const runFatPercentageCarcass = fatPercentageCarcassTool.execute;
export default fatPercentageCarcassTool;
