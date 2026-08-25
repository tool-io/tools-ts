import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const VOLVA_STATES = ["present-sac-like", "present-scaly", "absent"] as const;
type VolvaState = (typeof VOLVA_STATES)[number];

export type VolvaBasePresenceDetectorInput = {
  readonly volva: VolvaState;
};

export type VolvaBasePresenceDetectorOutput = {
  readonly hasVolva: boolean;
  readonly volvaState: VolvaState;
};

export const volvaBasePresenceDetectorExample = {
  input: { volva: "present-sac-like" },
  output: { hasVolva: true, volvaState: "present-sac-like" },
} satisfies ToolExample<
  VolvaBasePresenceDetectorInput,
  VolvaBasePresenceDetectorOutput
>;

export const volvaBasePresenceDetectorTool = createSimpleTool({
  id: "mycology/volva-base-presence-detector",
  title: "Volva Presence Detector",
  description:
    "Detect whether a volva is present at the stipe base and record its form.",
  inputs: [
    {
      enum: VOLVA_STATES,
      id: "volva",
      kind: "string",
      label: "Volva",
    },
  ],
  outputs: [
    { id: "hasVolva", kind: "boolean", label: "Has volva" },
    {
      enum: VOLVA_STATES,
      id: "volvaState",
      kind: "string",
      label: "Volva state",
    },
  ],
  calculate: (input) => {
    const volva = input.volva as VolvaState;
    return { hasVolva: volva !== "absent", volvaState: volva };
  },
});
export const runVolvaBasePresenceDetector =
  volvaBasePresenceDetectorTool.execute;
export default volvaBasePresenceDetectorTool;
