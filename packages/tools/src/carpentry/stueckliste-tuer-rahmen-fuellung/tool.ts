import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const frameDoorBomExample = {
  input: {
    doorHeightMm: 2000,
    doorWidthMm: 600,
    railHeightMm: 100,
    stileWidthMm: 80,
  },
  output: {
    frameAreaM2: 0.408,
    panelAreaM2: 0.792,
    railCount: 2,
    stileCount: 2,
  },
} satisfies ToolExample<
  {
    readonly doorHeightMm: number;
    readonly doorWidthMm: number;
    readonly railHeightMm: number;
    readonly stileWidthMm: number;
  },
  {
    readonly frameAreaM2: number;
    readonly panelAreaM2: number;
    readonly railCount: number;
    readonly stileCount: number;
  }
>;

export const frameDoorBomTool = createSimpleTool({
  id: "carpentry/stueckliste-tuer-rahmen-fuellung",
  title: "Frame Door Bill of Materials Generator",
  description:
    "Generate the bill of materials for a frame-and-panel door from outer dimensions, stile width, and rail height.",
  inputs: [
    { id: "doorWidthMm", kind: "number", label: "Door width", unit: "mm" },
    { id: "doorHeightMm", kind: "number", label: "Door height", unit: "mm" },
    { id: "stileWidthMm", kind: "number", label: "Stile width", unit: "mm" },
    { id: "railHeightMm", kind: "number", label: "Rail height", unit: "mm" },
  ],
  outputs: [
    { id: "stileCount", kind: "integer", label: "Stiles" },
    { id: "railCount", kind: "integer", label: "Rails" },
    {
      format: "area",
      id: "frameAreaM2",
      kind: "number",
      label: "Frame area",
      unit: "m²",
    },
    {
      format: "area",
      id: "panelAreaM2",
      kind: "number",
      label: "Panel area",
      unit: "m²",
    },
  ],
  calculate: (input) => {
    const doorWidthMm = input.doorWidthMm as number;
    const doorHeightMm = input.doorHeightMm as number;
    const stileWidthMm = input.stileWidthMm as number;
    const railHeightMm = input.railHeightMm as number;
    if (
      !(doorWidthMm > 0) ||
      !(doorHeightMm > 0) ||
      !(stileWidthMm > 0) ||
      !(railHeightMm > 0)
    )
      simpleError(
        "doorWidthMm",
        "All door dimensions must be positive.",
        "invalid_dimensions",
      );
    if (!(doorWidthMm > 2 * stileWidthMm))
      simpleError(
        "doorWidthMm",
        "Door width must exceed twice the stile width.",
        "invalid_dimensions",
      );
    if (!(doorHeightMm > 2 * railHeightMm))
      simpleError(
        "doorHeightMm",
        "Door height must exceed twice the rail height.",
        "invalid_dimensions",
      );
    return {
      frameAreaM2:
        (2 * doorHeightMm * stileWidthMm +
          2 * railHeightMm * (doorWidthMm - 2 * stileWidthMm)) /
        1e6,
      panelAreaM2:
        ((doorWidthMm - 2 * stileWidthMm) * (doorHeightMm - 2 * railHeightMm)) /
        1e6,
      railCount: 2,
      stileCount: 2,
    };
  },
});
export const runFrameDoorBom = frameDoorBomTool.execute;
export default frameDoorBomTool;
