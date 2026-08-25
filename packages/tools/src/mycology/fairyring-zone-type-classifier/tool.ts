import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const fairyRingZoneClassifierExample = {
  input: { zone: "zone-2-wilted" },
  output: {
    fairyRingZone: "zone-2-wilted",
    zoneDescription: "Wilted or dead vegetation occurs in the ring zone.",
  },
} satisfies ToolExample<
  { readonly zone: string },
  { readonly fairyRingZone: string; readonly zoneDescription: string }
>;

const ZONE_DESCRIPTIONS: Record<string, string> = {
  "combined-1-3":
    "Lush vegetation and basidiocarps occur together in the observed ring zone.",
  "zone-1-lush":
    "Vegetation is darker green or more vigorous in the ring zone.",
  "zone-2-wilted": "Wilted or dead vegetation occurs in the ring zone.",
  "zone-3-basidiocarps": "Basidiocarps occur along the observed ring zone.",
};

export const fairyRingZoneClassifierTool = createSimpleTool({
  id: "mycology/fairyring-zone-type-classifier",
  title: "Fairy Ring Zone Type",
  description:
    "Classify an observed fairy ring zone by its vegetation and basidiocarp pattern.",
  inputs: [
    {
      enum: [
        "zone-1-lush",
        "zone-2-wilted",
        "zone-3-basidiocarps",
        "combined-1-3",
      ],
      id: "zone",
      kind: "string",
      label: "Zone",
    },
  ],
  outputs: [
    {
      enum: [
        "zone-1-lush",
        "zone-2-wilted",
        "zone-3-basidiocarps",
        "combined-1-3",
      ],
      id: "fairyRingZone",
      kind: "string",
      label: "Fairy ring zone",
    },
    { id: "zoneDescription", kind: "string", label: "Zone description" },
  ],
  calculate: (input) => ({
    fairyRingZone: input.zone as string,
    zoneDescription: ZONE_DESCRIPTIONS[input.zone as string],
  }),
});
export const runFairyRingZoneClassifier = fairyRingZoneClassifierTool.execute;
export default fairyRingZoneClassifierTool;
