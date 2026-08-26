import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const bandsawBladeLengthExample = {
  input: { wheelDistanceMm: 400, wheelDiameterMm: 200 },
  output: { bandLengthMillimeters: 1428.3185307179588 },
} satisfies ToolExample<
  {
    readonly wheelDistanceMm: number;
    readonly wheelDiameterMm: number;
  },
  { readonly bandLengthMillimeters: number }
>;

export const bandsawBladeLengthTool = createSimpleTool({
  id: "carpentry/bandsaege-bandlaenge",
  title: "Bandsaw Blade Length Calculator",
  description:
    "Estimate bandsaw blade length from the distance between wheel centers and the wheel diameter.",
  inputs: [
    {
      description: "Distance between the wheel centers in millimeters.",
      id: "wheelDistanceMm",
      kind: "number",
      label: "Wheel distance",
      unit: "mm",
    },
    {
      description: "Wheel diameter in millimeters.",
      id: "wheelDiameterMm",
      kind: "number",
      label: "Wheel diameter",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Required blade length in millimeters.",
      id: "bandLengthMillimeters",
      kind: "number",
      label: "Blade length",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const wheelDistanceMm = input.wheelDistanceMm as number;
    const wheelDiameterMm = input.wheelDiameterMm as number;
    if (wheelDistanceMm <= 0)
      simpleError(
        "wheelDistanceMm",
        "Wheel distance must be positive.",
        "must_be_positive",
      );
    if (wheelDiameterMm <= 0)
      simpleError(
        "wheelDiameterMm",
        "Wheel diameter must be positive.",
        "must_be_positive",
      );
    return {
      bandLengthMillimeters: 2 * wheelDistanceMm + Math.PI * wheelDiameterMm,
    };
  },
});
export const runBandsawBladeLength = bandsawBladeLengthTool.execute;
export default bandsawBladeLengthTool;
