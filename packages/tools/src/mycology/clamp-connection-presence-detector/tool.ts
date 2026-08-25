import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type ClampConnectionPresenceDetectorInput = {
  readonly clampsPresent: boolean;
};

export type ClampConnectionPresenceDetectorOutput = {
  readonly clampsPresent: boolean;
  readonly hyphalImplication: string;
};

export const clampConnectionPresenceDetectorExample = {
  input: { clampsPresent: true },
  output: {
    clampsPresent: true,
    hyphalImplication:
      "Clamp connections observed; this supports, but does not by itself prove, a dikaryotic basidiomycete context.",
  },
} satisfies ToolExample<
  ClampConnectionPresenceDetectorInput,
  ClampConnectionPresenceDetectorOutput
>;

export const clampConnectionPresenceDetectorTool = createSimpleTool({
  id: "mycology/clamp-connection-presence-detector",
  title: "Clamp Presence Detector",
  description:
    "Interpret a microscopic clamp-connection observation without treating presence or absence as proof of septation, ploidy, or taxonomic identity.",
  inputs: [
    {
      id: "clampsPresent",
      kind: "boolean",
      label: "Clamps present",
    },
  ],
  outputs: [
    { id: "clampsPresent", label: "Clamps present", kind: "boolean" },
    { id: "hyphalImplication", label: "Hyphal implication", kind: "string" },
  ],
  calculate: (input) => ({
    clampsPresent: input.clampsPresent as boolean,
    hyphalImplication: (input.clampsPresent as boolean)
      ? "Clamp connections observed; this supports, but does not by itself prove, a dikaryotic basidiomycete context."
      : "No clamp connections observed; absence does not establish that hyphae are aseptate or monokaryotic.",
  }),
});
export const runClampConnectionPresenceDetector =
  clampConnectionPresenceDetectorTool.execute;
export default clampConnectionPresenceDetectorTool;
