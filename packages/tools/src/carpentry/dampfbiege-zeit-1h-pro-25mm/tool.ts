import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const steamBendingTimeExample = {
  input: { thicknessMm: 50 },
  output: { steamHours: 2 },
} satisfies ToolExample<
  { readonly thicknessMm: number },
  { readonly steamHours: number }
>;

export const steamBendingTimeTool = createSimpleTool({
  id: "carpentry/dampfbiege-zeit-1h-pro-25mm",
  title: "Steam Bending Time Calculator",
  description:
    "Compute steam bending time at one hour per 25 mm of workpiece thickness.",
  inputs: [
    {
      description: "Workpiece thickness in millimeters.",
      id: "thicknessMm",
      kind: "number",
      label: "Thickness",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Required steaming time in hours.",
      id: "steamHours",
      kind: "number",
      label: "Steaming time",
      unit: "h",
    },
  ],
  calculate: (input) => {
    const thicknessMm = input.thicknessMm as number;
    if (thicknessMm <= 0)
      simpleError(
        "thicknessMm",
        "Thickness must be positive.",
        "must_be_positive",
      );
    return { steamHours: thicknessMm / 25 };
  },
});
export const runSteamBendingTime = steamBendingTimeTool.execute;
export default steamBendingTimeTool;
