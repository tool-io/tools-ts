import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IdealWeightDevineInput = {
  readonly heightCm: number;
  readonly sex: "female" | "male";
};

export type IdealWeightDevineOutput = {
  readonly idealWeightKg: number;
};

export const idealWeightDevineExample = {
  input: { heightCm: 180, sex: "male" },
  output: { idealWeightKg: 74.99212598425197 },
} satisfies ToolExample<IdealWeightDevineInput, IdealWeightDevineOutput>;

export const idealWeightDevineTool = createSimpleTool({
  id: "health/ideal-weight-devine",
  title: "Ideal Weight Devine Calculator",
  description:
    "Compute ideal body weight with the Devine formula from height and sex.",
  inputs: [
    {
      description: "Height in centimetres; must be greater than zero.",
      id: "heightCm",
      label: "Height",
      kind: "number",
      unit: "cm",
    },
    {
      default: "male",
      description: "Biological sex selecting the baseline weight.",
      enum: ["female", "male"],
      id: "sex",
      label: "Sex",
      kind: "string",
    },
  ],
  outputs: [
    {
      id: "idealWeightKg",
      label: "Ideal weight",
      kind: "number",
      unit: "kg",
    },
  ],
  calculate: (input) => {
    const heightCm = input.heightCm as number;
    if (heightCm <= 0)
      simpleError(
        "heightCm",
        "The height must be greater than zero centimetres.",
        "invalid_height",
      );
    const inchesOverFiveFeet = Math.max(0, heightCm / 2.54 - 60);
    const idealWeightKg =
      input.sex === "female"
        ? 45.5 + 2.3 * inchesOverFiveFeet
        : 50 + 2.3 * inchesOverFiveFeet;
    return { idealWeightKg };
  },
});
export const runIdealWeightDevine = idealWeightDevineTool.execute;
export default idealWeightDevineTool;
