import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FrameRoughOpeningInput = {
  readonly doorAssemblyHeightMm: number;
  readonly doorAssemblyWidthMm: number;
};

export type FrameRoughOpeningOutput = {
  readonly roughOpeningHeightMm: number;
  readonly roughOpeningWidthMm: number;
};

export const frameRoughOpeningExample = {
  input: { doorAssemblyHeightMm: 2015, doorAssemblyWidthMm: 850 },
  output: { roughOpeningHeightMm: 2020, roughOpeningWidthMm: 860 },
} satisfies ToolExample<FrameRoughOpeningInput, FrameRoughOpeningOutput>;

export const frameRoughOpeningTool = createSimpleTool({
  id: "carpentry/zarge-maueroeffnung-plus10mm-breite-plus5mm-hoehe",
  title: "Frame Rough Opening Calculator",
  description:
    "Compute the masonry rough opening from the door assembly size using total allowances of plus 10 mm width and plus 5 mm height.",
  inputs: [
    {
      description: "Complete pre-hung door assembly width in millimeters.",
      id: "doorAssemblyWidthMm",
      kind: "number",
      label: "Door assembly width",
      unit: "mm",
    },
    {
      description: "Complete pre-hung door assembly height in millimeters.",
      id: "doorAssemblyHeightMm",
      kind: "number",
      label: "Door assembly height",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description:
        "Required rough opening width in millimeters including the 10 mm allowance.",
      id: "roughOpeningWidthMm",
      kind: "number",
      label: "Rough opening width",
      unit: "mm",
    },
    {
      description:
        "Required rough opening height in millimeters including the 5 mm allowance.",
      id: "roughOpeningHeightMm",
      kind: "number",
      label: "Rough opening height",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const doorAssemblyWidthMm = input.doorAssemblyWidthMm as number;
    if (doorAssemblyWidthMm <= 0)
      simpleError(
        "doorAssemblyWidthMm",
        "The door assembly width must be greater than zero.",
        "must_be_positive",
      );
    const doorAssemblyHeightMm = input.doorAssemblyHeightMm as number;
    if (doorAssemblyHeightMm <= 0)
      simpleError(
        "doorAssemblyHeightMm",
        "The door assembly height must be greater than zero.",
        "must_be_positive",
      );
    return {
      roughOpeningHeightMm: doorAssemblyHeightMm + 5,
      roughOpeningWidthMm: doorAssemblyWidthMm + 10,
    };
  },
});
export const runFrameRoughOpening = frameRoughOpeningTool.execute;
export default frameRoughOpeningTool;
