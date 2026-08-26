import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Din68901KitchenCarcaseHeightClass = "base" | "low" | "tall";

export type Din68901KitchenCarcaseHeightInput = {
  readonly sizeClass: Din68901KitchenCarcaseHeightClass;
};

export type Din68901KitchenCarcaseHeightOutput = {
  readonly nominalHeightMm: number;
};

const NOMINAL_HEIGHTS_MM: Readonly<
  Record<Din68901KitchenCarcaseHeightClass, number>
> = {
  base: 720,
  low: 575,
  tall: 2000,
};

export const din68901KitchenCarcaseHeightExample = {
  input: { sizeClass: "base" },
  output: { nominalHeightMm: 720 },
} satisfies ToolExample<
  Din68901KitchenCarcaseHeightInput,
  Din68901KitchenCarcaseHeightOutput
>;

export const din68901KitchenCarcaseHeightTool = createSimpleTool({
  id: "carpentry/din-68901-kuechen-korpus-hoehe",
  title: "DIN 68901 Carcase Height Lookup",
  description:
    "Look up the nominal DIN 68901 kitchen carcase height for low, base, and tall size classes.",
  inputs: [
    {
      description: "DIN 68901 kitchen carcase height class.",
      enum: ["low", "base", "tall"],
      id: "sizeClass",
      kind: "string",
      label: "Size class",
    },
  ],
  outputs: [
    {
      description: "Nominal carcase height in millimeters.",
      id: "nominalHeightMm",
      kind: "number",
      label: "Nominal height",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const sizeClass = input.sizeClass as Din68901KitchenCarcaseHeightClass;
    const nominalHeightMm = NOMINAL_HEIGHTS_MM[sizeClass];
    if (nominalHeightMm === undefined)
      simpleError(
        "sizeClass",
        "Choose one of the supported size classes.",
        "unknown_size_class",
      );
    return { nominalHeightMm };
  },
});
export const runDin68901KitchenCarcaseHeight =
  din68901KitchenCarcaseHeightTool.execute;
export default din68901KitchenCarcaseHeightTool;
