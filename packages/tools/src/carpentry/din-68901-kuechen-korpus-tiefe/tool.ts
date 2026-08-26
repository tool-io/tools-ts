import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Din68901KitchenCarcaseDepthClass = "deep" | "slim" | "standard";

export type Din68901KitchenCarcaseDepthInput = {
  readonly depthClass: Din68901KitchenCarcaseDepthClass;
};

export type Din68901KitchenCarcaseDepthOutput = {
  readonly nominalDepthMm: number;
};

const NOMINAL_DEPTHS_MM: Readonly<
  Record<Din68901KitchenCarcaseDepthClass, number>
> = {
  deep: 650,
  slim: 450,
  standard: 550,
};

export const din68901KitchenCarcaseDepthExample = {
  input: { depthClass: "standard" },
  output: { nominalDepthMm: 550 },
} satisfies ToolExample<
  Din68901KitchenCarcaseDepthInput,
  Din68901KitchenCarcaseDepthOutput
>;

export const din68901KitchenCarcaseDepthTool = createSimpleTool({
  id: "carpentry/din-68901-kuechen-korpus-tiefe",
  title: "DIN 68901 Carcase Depth Lookup",
  description:
    "Look up the nominal DIN 68901 kitchen carcase depth for slim, standard, and deep classes; fronts are typically 50 mm deeper than the carcase.",
  inputs: [
    {
      description: "DIN 68901 kitchen carcase depth class.",
      enum: ["slim", "standard", "deep"],
      id: "depthClass",
      kind: "string",
      label: "Depth class",
    },
  ],
  outputs: [
    {
      description:
        "Nominal carcase depth in millimeters; kitchen fronts are typically 50 mm deeper.",
      id: "nominalDepthMm",
      kind: "number",
      label: "Nominal depth",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const depthClass = input.depthClass as Din68901KitchenCarcaseDepthClass;
    const nominalDepthMm = NOMINAL_DEPTHS_MM[depthClass];
    if (nominalDepthMm === undefined)
      simpleError(
        "depthClass",
        "Choose one of the supported depth classes.",
        "unknown_depth_class",
      );
    return { nominalDepthMm };
  },
});
export const runDin68901KitchenCarcaseDepth =
  din68901KitchenCarcaseDepthTool.execute;
export default din68901KitchenCarcaseDepthTool;
