import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CeilingPanelExpansionGapInput = {
  readonly panelFieldLengthM: number;
};

export type CeilingPanelExpansionGapOutput = {
  readonly expansionGapMm: number;
};

export const ceilingPanelExpansionGapExample = {
  input: { panelFieldLengthM: 6 },
  output: { expansionGapMm: 8 },
} satisfies ToolExample<
  CeilingPanelExpansionGapInput,
  CeilingPanelExpansionGapOutput
>;

export const ceilingPanelExpansionGapTool = createSimpleTool({
  id: "carpentry/deckenpaneele-nut-feder-dehnungsfuge",
  title: "Ceiling Panel Expansion Gap Rule",
  description:
    "Recommend the tongue-and-groove ceiling panel expansion gap as 8 mm from 4 m field length and 5 mm below.",
  inputs: [
    {
      description:
        "Length of the ceiling panel field along the tongue-and-groove joint in meters.",
      id: "panelFieldLengthM",
      kind: "number",
      label: "Panel field length",
      maximum: 15,
      unit: "m",
    },
  ],
  outputs: [
    {
      description: "Recommended expansion gap in millimeters.",
      id: "expansionGapMm",
      kind: "number",
      label: "Expansion gap",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const panelFieldLengthM = input.panelFieldLengthM as number;
    if (panelFieldLengthM <= 0)
      simpleError(
        "panelFieldLengthM",
        "The panel field length must be greater than zero.",
        "must_be_positive",
      );
    return { expansionGapMm: panelFieldLengthM >= 4 ? 8 : 5 };
  },
});
export const runCeilingPanelExpansionGap = ceilingPanelExpansionGapTool.execute;
export default ceilingPanelExpansionGapTool;
