import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const agcGainStepArtifactFlaggerExample = {
  input: { gainStepsInWindow: 3, eventEnergyPresent: true },
  output: {
    artifactSuspected: true,
    recommendation: "reprocess without AGC or mask the affected span",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const agcGainStepArtifactFlaggerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ gainStepsInWindow, eventEnergyPresent }) => {
      const artifactSuspected = gainStepsInWindow > 2 && eventEnergyPresent;
      return {
        artifactSuspected,
        recommendation: artifactSuspected
          ? "reprocess without AGC or mask the affected span"
          : "window safe for amplitude work",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Flag windows where automatic-gain-control steps coincide with event energy.",
  id: "seismology/agc-gain-step-artifact-flagger",
  inputs: [
    {
      minimum: 0,
      description: "Gain changes inside the analysis window.",
      id: "gainStepsInWindow",
      kind: "integer",
      label: "n_steps",
    },
    {
      description: "Whether real event energy occupies the window.",
      id: "eventEnergyPresent",
      kind: "boolean",
      label: "Event?",
    },
  ],
  outputs: [
    {
      description: "Whether gain steps likely corrupt the window.",
      id: "artifactSuspected",
      kind: "boolean",
      label: "Artifact?",
    },
    {
      description: "Processing recommendation.",
      id: "recommendation",
      kind: "string",
      label: "Action",
    },
  ],
  title: "AGC Gain Step Artifact Flagger",
});
export const runAgcGainStepArtifactFlagger =
  agcGainStepArtifactFlaggerTool.execute;
export { agcGainStepArtifactFlaggerExample as example };
export default agcGainStepArtifactFlaggerTool;
