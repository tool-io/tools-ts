import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type HingeOverlayType = "overlay" | "half-overlay" | "inset";

export type HingeOverlayLookupInput = {
  readonly mountingType: HingeOverlayType;
};

export type HingeOverlayLookupOutput = {
  readonly doorOverlayMm: number;
};

const DOOR_OVERLAY_MM: Record<HingeOverlayType, number> = {
  overlay: 18,
  "half-overlay": 9,
  inset: 0,
};

export const hingeOverlayLookupExample = {
  input: { mountingType: "overlay" },
  output: { doorOverlayMm: 18 },
} satisfies ToolExample<HingeOverlayLookupInput, HingeOverlayLookupOutput>;

export const hingeOverlayLookupTool = createSimpleTool({
  id: "carpentry/scharnier-eck-mittel-innen-lookup",
  title: "Hinge Overlay Type Lookup",
  description:
    "Look up the typical door overlay in millimeters for a hinge mounting type.",
  inputs: [
    {
      description:
        "Mounting type: overlay, half-overlay, or inset (inside mount).",
      enum: ["overlay", "half-overlay", "inset"],
      id: "mountingType",
      kind: "string",
      label: "Mounting type",
    },
  ],
  outputs: [
    {
      description:
        "Typical door overlay in millimeters: 18 for overlay, 9 for half-overlay, and 0 for inset mounts.",
      id: "doorOverlayMm",
      kind: "number",
      label: "Door overlay",
      unit: "mm",
    },
  ],
  calculate: (input) => ({
    doorOverlayMm: DOOR_OVERLAY_MM[input.mountingType as HingeOverlayType],
  }),
});
export const runHingeOverlayLookup = hingeOverlayLookupTool.execute;
export default hingeOverlayLookupTool;
