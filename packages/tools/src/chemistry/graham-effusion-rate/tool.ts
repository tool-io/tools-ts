import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const grahamEffusionRateExample = {
  input: { molarMass1: 4, molarMass2: 16, rate1: 1 },
} satisfies ToolExample<{
  readonly molarMass1: number;
  readonly molarMass2: number;
  readonly rate1: number;
}>;

export const grahamEffusionRateTool = createSimpleTool({
  id: "chemistry/graham-effusion-rate",
  title: "Graham Effusion Rate",
  description:
    "Compute the effusion rate of a gas as the reference rate times the square root of the reference molar mass over the target molar mass.",
  inputs: [
    { id: "rate1", label: "Reference effusion rate", kind: "number" },
    {
      id: "molarMass1",
      label: "Reference molar mass",
      kind: "number",
      unit: "g/mol",
    },
    {
      id: "molarMass2",
      label: "Target molar mass",
      kind: "number",
      unit: "g/mol",
    },
  ],
  outputs: [{ id: "effusionRate2", label: "Effusion rate", kind: "number" }],
  calculate: (input) => {
    const rate1 = input.rate1 as number;
    const molarMass1 = input.molarMass1 as number;
    const molarMass2 = input.molarMass2 as number;
    if (!(rate1 > 0))
      simpleError("rate1", "Reference effusion rate must be positive.");
    if (!(molarMass1 > 0))
      simpleError("molarMass1", "Reference molar mass must be positive.");
    if (!(molarMass2 > 0))
      simpleError("molarMass2", "Target molar mass must be positive.");
    return { effusionRate2: rate1 * Math.sqrt(molarMass1 / molarMass2) };
  },
});
export const runGrahamEffusionRate = grahamEffusionRateTool.execute;
export default grahamEffusionRateTool;
