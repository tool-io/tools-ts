import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const DEHISCENCE_MODES = [
  "operculate",
  "inoperculate",
  "bitunicate",
  "prototunicate",
] as const;

export type AscusDehiscenceClassifierInput = {
  readonly mode: (typeof DEHISCENCE_MODES)[number];
};

export type AscusDehiscenceClassifierOutput = {
  readonly dehiscenceClass: AscusDehiscenceClassifierInput["mode"];
  readonly releaseMechanism: string;
};

export const ascusDehiscenceClassifierExample = {
  input: { mode: "operculate" },
  output: {
    dehiscenceClass: "operculate",
    releaseMechanism:
      "Spores discharge through a lid-like operculum at the ascus apex.",
  },
} satisfies ToolExample<
  AscusDehiscenceClassifierInput,
  AscusDehiscenceClassifierOutput
>;

const RELEASE_MECHANISMS: Record<
  AscusDehiscenceClassifierInput["mode"],
  string
> = {
  bitunicate:
    "The inner wall expands through the ruptured outer wall during fissitunicate discharge.",
  inoperculate:
    "Spores discharge through an apical pore or slit rather than a lid.",
  operculate:
    "Spores discharge through a lid-like operculum at the ascus apex.",
  prototunicate:
    "Spores are released after the thin ascus wall dissolves or ruptures.",
};

export const calculateAscusDehiscenceClassifier = (
  input: AscusDehiscenceClassifierInput,
): AscusDehiscenceClassifierOutput => {
  const releaseMechanism = RELEASE_MECHANISMS[input.mode];
  if (releaseMechanism === undefined)
    return simpleError(
      "mode",
      "Select a supported ascus dehiscence mode.",
      "invalid_mode",
    );
  return { dehiscenceClass: input.mode, releaseMechanism };
};

export const ascusDehiscenceClassifierTool = createSimpleTool({
  id: "mycology/ascus-dehiscence-classifier",
  title: "Dehiscence Classifier",
  description: "Classify ascus dehiscence from the reported release mode.",
  inputs: [
    {
      enum: DEHISCENCE_MODES,
      id: "mode",
      kind: "string",
      label: "Mode",
    },
  ],
  outputs: [
    {
      enum: DEHISCENCE_MODES,
      id: "dehiscenceClass",
      kind: "string",
      label: "Dehiscence class",
    },
    { id: "releaseMechanism", kind: "string", label: "Release mechanism" },
  ],
  calculate: (input) =>
    calculateAscusDehiscenceClassifier({
      mode: input.mode as AscusDehiscenceClassifierInput["mode"],
    }),
});
export const runAscusDehiscenceClassifier =
  ascusDehiscenceClassifierTool.execute;
export default ascusDehiscenceClassifierTool;
