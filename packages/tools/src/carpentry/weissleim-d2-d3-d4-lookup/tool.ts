import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type WhiteGlueDurabilityClass = "D2" | "D3" | "D4";

export type WhiteGlueDurabilityInput = {
  readonly durabilityClass: WhiteGlueDurabilityClass;
};

export type WhiteGlueDurabilityOutput = {
  readonly boilWaterResistant: boolean;
  readonly usageDescription: string;
};

const USAGE_DESCRIPTION: Record<WhiteGlueDurabilityClass, string> = {
  D2: "interior dry areas",
  D3: "humid interior and protected exterior",
  D4: "exposed exterior with brief water contact",
};

const BOIL_WATER_RESISTANT: Record<WhiteGlueDurabilityClass, boolean> = {
  D2: false,
  D3: false,
  D4: true,
};

export const whiteGlueDurabilityExample = {
  input: { durabilityClass: "D3" },
  output: {
    boilWaterResistant: false,
    usageDescription: "humid interior and protected exterior",
  },
} satisfies ToolExample<WhiteGlueDurabilityInput, WhiteGlueDurabilityOutput>;

export const whiteGlueDurabilityTool = createSimpleTool({
  id: "carpentry/weissleim-d2-d3-d4-lookup",
  title: "White Glue Durability Class",
  description:
    "Look up the usage description and boil water resistance of a white glue durability class.",
  inputs: [
    {
      description: "EN 204 durability class: D2, D3, or D4.",
      enum: ["D2", "D3", "D4"],
      id: "durabilityClass",
      kind: "string",
      label: "Durability class",
    },
  ],
  outputs: [
    {
      description: "Typical usage areas for the durability class.",
      id: "usageDescription",
      kind: "string",
      label: "Usage description",
    },
    {
      description:
        "Whether the class resists boiling water exposure (D4 only).",
      id: "boilWaterResistant",
      kind: "boolean",
      label: "Boil water resistant",
    },
  ],
  calculate: (input) => {
    const durabilityClass = input.durabilityClass as WhiteGlueDurabilityClass;
    return {
      boilWaterResistant: BOIL_WATER_RESISTANT[durabilityClass],
      usageDescription: USAGE_DESCRIPTION[durabilityClass],
    };
  },
});
export const runWhiteGlueDurability = whiteGlueDurabilityTool.execute;
export default whiteGlueDurabilityTool;
