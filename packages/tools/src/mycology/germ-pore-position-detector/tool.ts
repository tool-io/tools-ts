import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type GermPorePositionDetectorInput = {
  readonly position: "apical" | "lateral" | "multiple-distal" | "subapical";
};

export type GermPorePositionDetectorOutput = {
  readonly germPoreType: string;
  readonly positionDescription: string;
};

const POSITION_DESCRIPTIONS: Record<
  GermPorePositionDetectorInput["position"],
  string
> = {
  apical: "A single germ pore is located at the spore apex.",
  lateral: "A germ pore is located on the side of the spore.",
  "multiple-distal": "Multiple germ pores occur toward the distal region.",
  subapical: "A germ pore is offset slightly from the spore apex.",
};

export const germPorePositionDetectorExample = {
  input: { position: "apical" },
  output: {
    germPoreType: "apical",
    positionDescription: "A single germ pore is located at the spore apex.",
  },
} satisfies ToolExample<
  GermPorePositionDetectorInput,
  GermPorePositionDetectorOutput
>;

export const germPorePositionDetectorTool = createSimpleTool({
  id: "mycology/germ-pore-position-detector",
  title: "Germ Pore Position",
  description:
    "Classify a spore's observed germ-pore position and explain the selected morphological term.",
  inputs: [
    {
      enum: ["apical", "subapical", "lateral", "multiple-distal"],
      id: "position",
      kind: "string",
      label: "Germ pore position",
    },
  ],
  outputs: [
    { id: "germPoreType", label: "Germ pore type", kind: "string" },
    {
      id: "positionDescription",
      label: "Position description",
      kind: "string",
    },
  ],
  calculate: (input) => ({
    germPoreType: input.position as string,
    positionDescription:
      POSITION_DESCRIPTIONS[
        input.position as GermPorePositionDetectorInput["position"]
      ],
  }),
});
export const runGermPorePositionDetector = germPorePositionDetectorTool.execute;
export default germPorePositionDetectorTool;
