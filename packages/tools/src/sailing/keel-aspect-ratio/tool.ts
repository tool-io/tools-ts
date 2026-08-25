import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type KeelAspectRatioInput = {
  readonly draftMeters: number;
  readonly keelAreaM2: number;
};

export type KeelAspectRatioOutput = {
  readonly keelAspectRatio: number;
};

export const keelAspectRatioExample = {
  input: { draftMeters: 2, keelAreaM2: 2 },
  output: { keelAspectRatio: 2 },
} satisfies ToolExample<KeelAspectRatioInput, KeelAspectRatioOutput>;

export const keelAspectRatioTool = createSimpleTool({
  calculate: (input) => {
    const draftMeters = input.draftMeters as number;
    const keelAreaM2 = input.keelAreaM2 as number;
    if (draftMeters <= 0)
      simpleError("draftMeters", "Draft must be positive.", "invalid_draft");
    if (keelAreaM2 <= 0)
      simpleError("keelAreaM2", "Keel area must be positive.", "invalid_area");
    return {
      keelAspectRatio: (draftMeters * draftMeters) / keelAreaM2,
    };
  },
  description:
    "Compute the keel aspect ratio as keelAspectRatio = draftMeters^2 / keelAreaM2; deep fin keels have high ratios.",
  id: "sailing/keel-aspect-ratio",
  inputs: [
    {
      description: "Mean draft of the keel below the hull.",
      id: "draftMeters",
      kind: "number",
      label: "Keel draft",
      minimum: 0,
      unit: "m",
    },
    {
      description: "Projected area of the keel.",
      id: "keelAreaM2",
      kind: "number",
      label: "Keel area",
      minimum: 0,
      unit: "m\u00B2",
    },
  ],
  outputs: [
    {
      description: "Aspect ratio of the keel planform.",
      format: "ratio",
      id: "keelAspectRatio",
      kind: "number",
      label: "Keel aspect ratio",
    },
  ],
  title: "Keel Aspect Ratio",
});
export const runKeelAspectRatio = keelAspectRatioTool.execute;
export default keelAspectRatioTool;
