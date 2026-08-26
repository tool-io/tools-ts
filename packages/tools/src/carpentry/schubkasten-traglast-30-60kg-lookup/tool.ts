import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DrawerLoadClass = "heavy" | "light" | "medium";

export type DrawerLoadClassInput = {
  readonly loadClass: DrawerLoadClass;
};

export type DrawerLoadClassOutput = {
  readonly ratedLoadKg: number;
};

const RATED_LOAD_KG: Record<DrawerLoadClass, number> = {
  heavy: 60,
  light: 30,
  medium: 45,
};

export const drawerLoadClassExample = {
  input: { loadClass: "medium" },
  output: { ratedLoadKg: 45 },
} satisfies ToolExample<DrawerLoadClassInput, DrawerLoadClassOutput>;

export const drawerLoadClassTool = createSimpleTool({
  id: "carpentry/schubkasten-traglast-30-60kg-lookup",
  title: "Drawer Load Class Lookup",
  description:
    "Look up the rated load in kilograms for a drawer runner load class.",
  inputs: [
    {
      description:
        "Runner load class: light (30 kg), medium (45 kg), or heavy (60 kg).",
      enum: ["light", "medium", "heavy"],
      id: "loadClass",
      kind: "string",
      label: "Load class",
    },
  ],
  outputs: [
    {
      description: "Rated load capacity in kilograms.",
      id: "ratedLoadKg",
      kind: "number",
      label: "Rated load",
      unit: "kg",
    },
  ],
  calculate: (input) => {
    const loadClass = input.loadClass as DrawerLoadClass;
    if (!(loadClass in RATED_LOAD_KG))
      simpleError("loadClass", "Unknown drawer load class.", "unknown_class");
    return { ratedLoadKg: RATED_LOAD_KG[loadClass] };
  },
});
export const runDrawerLoadClass = drawerLoadClassTool.execute;
export default drawerLoadClassTool;
