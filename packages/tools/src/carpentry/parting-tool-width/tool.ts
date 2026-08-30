import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PartingToolWidthInput = Readonly<{
  readonly targetGrooveMillimeters: number;
  readonly lateralTravelMillimeters: number;
}>;
export type PartingToolWidthOutput = Readonly<{
  readonly toolWidthMillimeters: number;
}>;

export const calculatePartingToolWidth = (
  x: PartingToolWidthInput,
): PartingToolWidthOutput => {
  if (
    !Number.isFinite(x.targetGrooveMillimeters) ||
    x.targetGrooveMillimeters < 0
  )
    simpleError(
      "targetGrooveMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.lateralTravelMillimeters) ||
    x.lateralTravelMillimeters < 0
  )
    simpleError(
      "lateralTravelMillimeters",
      "Provide a finite number at least 0.",
    );
  if (x.lateralTravelMillimeters >= x.targetGrooveMillimeters)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const toolWidthMillimeters =
    x.targetGrooveMillimeters - x.lateralTravelMillimeters;
  if (!Number.isFinite(toolWidthMillimeters))
    simpleError(
      "toolWidthMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    toolWidthMillimeters: Object.is(toolWidthMillimeters, -0)
      ? 0
      : toolWidthMillimeters,
  };
};

export const example = {
  input: { targetGrooveMillimeters: 6, lateralTravelMillimeters: 2 },
  output: { toolWidthMillimeters: 4 },
} satisfies ToolExample<PartingToolWidthInput, PartingToolWidthOutput>;

export const tool = createSimpleTool({
  id: "carpentry/parting-tool-width",
  title: "Parting Tool Width",
  description:
    "Required parting-tool kerf width to leave a target groove after a known amount of lateral tool travel.",
  inputs: [
    {
      id: "targetGrooveMillimeters",
      kind: "number",
      label: "Target Groove Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "lateralTravelMillimeters",
      kind: "number",
      label: "Lateral Travel Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "toolWidthMillimeters",
      kind: "number",
      label: "Tool Width Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculatePartingToolWidth({
      targetGrooveMillimeters: input.targetGrooveMillimeters as number,
      lateralTravelMillimeters: input.lateralTravelMillimeters as number,
    }),
});
export const partingToolWidthTool = tool;
export const runPartingToolWidth = tool.execute;
export default tool;
