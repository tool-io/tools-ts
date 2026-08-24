import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OverlayBudgetInput = {
  readonly pitchNm: number;
  readonly overlayFractionOfPitch: number;
};

export type OverlayBudgetOutput = {
  readonly overlayBudgetNm: number;
};

export const overlayBudgetExample = {
  input: { overlayFractionOfPitch: 0.03, pitchNm: 48 },
  output: { overlayBudgetNm: 1.44 },
} satisfies ToolExample<OverlayBudgetInput, OverlayBudgetOutput>;

export const overlayBudgetTool = createSimpleTool({
  calculate: (input) => {
    const pitchNm = input.pitchNm as number;
    if (pitchNm <= 0)
      simpleError("pitchNm", "Pitch must be positive.", "degenerate_input");
    return {
      overlayBudgetNm: (input.overlayFractionOfPitch as number) * pitchNm,
    };
  },
  description:
    "Compute the overlay accuracy budget as a fraction of the lithographic pitch.",
  id: "semiconductor/lithography-overlay-accuracy",
  inputs: [
    {
      description: "Lithographic pitch of the patterned layer.",
      id: "pitchNm",
      kind: "number",
      label: "Pitch",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
    {
      description:
        "Allowed overlay error as a fraction of the pitch, between zero and one.",
      id: "overlayFractionOfPitch",
      kind: "number",
      label: "Overlay fraction of pitch",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Total overlay budget for the layer.",
      id: "overlayBudgetNm",
      kind: "number",
      label: "Overlay budget",
      minimum: 0,
      unit: "nm",
    },
  ],
  title: "Overlay Budget Calculator",
});
export const runOverlayBudget = overlayBudgetTool.execute;
export default overlayBudgetTool;
