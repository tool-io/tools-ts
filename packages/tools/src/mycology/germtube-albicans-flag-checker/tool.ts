import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type GermtubeAlbicansFlagCheckerInput = {
  readonly germTubePresent: boolean;
};

export type GermtubeAlbicansFlagCheckerOutput = {
  readonly albicansOrDubliniensisPresumptive: boolean;
  readonly germTubePresent: boolean;
  readonly interpretation: string;
};

export const germtubeAlbicansFlagCheckerExample = {
  input: { germTubePresent: true },
  output: {
    albicansOrDubliniensisPresumptive: true,
    germTubePresent: true,
    interpretation:
      "A germ tube was observed; Candida albicans or Candida dubliniensis is presumptive, and confirmatory identification is required.",
  },
} satisfies ToolExample<
  GermtubeAlbicansFlagCheckerInput,
  GermtubeAlbicansFlagCheckerOutput
>;

export const germtubeAlbicansFlagCheckerTool = createSimpleTool({
  id: "mycology/germtube-albicans-flag-checker",
  title: "Germ Tube Flag",
  description:
    "Interpret a germ-tube observation as presumptive evidence for Candida albicans or Candida dubliniensis, not definitive species identification.",
  inputs: [
    { id: "germTubePresent", kind: "boolean", label: "Germ tube present" },
  ],
  outputs: [
    { id: "germTubePresent", kind: "boolean", label: "Germ tube present" },
    {
      id: "albicansOrDubliniensisPresumptive",
      kind: "boolean",
      label: "Presumptive C. albicans or C. dubliniensis",
    },
    { id: "interpretation", kind: "string", label: "Interpretation" },
  ],
  calculate: (input) => {
    const germTubePresent = input.germTubePresent as boolean;
    return {
      albicansOrDubliniensisPresumptive: germTubePresent,
      germTubePresent,
      interpretation: germTubePresent
        ? "A germ tube was observed; Candida albicans or Candida dubliniensis is presumptive, and confirmatory identification is required."
        : "No germ tube was observed; this result alone does not identify or exclude a Candida species.",
    };
  },
});
export const runGermtubeAlbicansFlagChecker =
  germtubeAlbicansFlagCheckerTool.execute;
export default germtubeAlbicansFlagCheckerTool;
