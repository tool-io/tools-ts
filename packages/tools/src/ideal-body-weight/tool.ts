import type { ToolExample } from "../core/example.js";
import { createSimpleTool, simpleError } from "../core/simple.js";
export const calculateIdealBodyWeight = (
  heightCm: number,
  sex: "female" | "male",
  formula: "devine" | "hamwi",
): number | null => {
  if (!Number.isFinite(heightCm) || heightCm <= 0) return null;
  return formula === "hamwi"
    ? sex === "female"
      ? 45.4 + 0.9 * (heightCm - 152)
      : 48 + 1.1 * (heightCm - 152)
    : (sex === "female" ? 45.5 : 50) + 0.9 * (heightCm - 152);
};
export const idealBodyWeightExample = {
  input: { formula: "devine", heightCm: 180, sex: "male" },
  output: { weightKg: 75.2 },
} satisfies ToolExample<
  { readonly formula: string; readonly heightCm: number; readonly sex: string },
  { readonly weightKg: number }
>;
export const idealBodyWeightTool = createSimpleTool({
  id: "ideal-body-weight",
  title: "Ideal Body Weight Calculator",
  description: "Estimate ideal body weight with the Devine or Hamwi formula.",
  inputs: [
    {
      id: "heightCm",
      kind: "number",
      label: "Height",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    { enum: ["male", "female"], id: "sex", kind: "string", label: "Sex" },
    {
      enum: ["devine", "hamwi"],
      id: "formula",
      kind: "string",
      label: "Formula",
    },
  ],
  outputs: [
    {
      format: "mass/ideal-body-weight",
      id: "weightKg",
      kind: "number",
      label: "Ideal body weight",
      unit: "kg",
    },
  ],
  calculate: (input) => {
    const weightKg = calculateIdealBodyWeight(
      input.heightCm as number,
      input.sex as "female" | "male",
      input.formula as "devine" | "hamwi",
    );
    if (weightKg === null)
      return simpleError("heightCm", "Height must be positive.");
    return { weightKg };
  },
});
export const runIdealBodyWeight = idealBodyWeightTool.execute;
export default idealBodyWeightTool;
