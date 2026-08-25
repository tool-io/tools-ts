import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AmatoxinCapAssayClassifierInput = {
  readonly amatoxinPresent: "detected" | "not-detected";
};

export type AmatoxinCapAssayClassifierOutput = {
  readonly capAssayResult: "detected" | "not-detected";
  readonly potentiallyLethalRiskFlag: boolean;
  readonly safetyGuidance: string;
};

export const amatoxinCapAssayClassifierExample = {
  input: { amatoxinPresent: "detected" },
  output: {
    capAssayResult: "detected",
    potentiallyLethalRiskFlag: true,
    safetyGuidance:
      "Amatoxin detected: do not consume the specimen; suspected exposure requires urgent poison-control or medical guidance.",
  },
} satisfies ToolExample<
  AmatoxinCapAssayClassifierInput,
  AmatoxinCapAssayClassifierOutput
>;

export const calculateAmatoxinCapAssayClassifier = (
  input: AmatoxinCapAssayClassifierInput,
): AmatoxinCapAssayClassifierOutput => {
  if (
    input.amatoxinPresent !== "detected" &&
    input.amatoxinPresent !== "not-detected"
  )
    return simpleError(
      "amatoxinPresent",
      "Assay result must be detected or not detected.",
      "invalid_assay_result",
    );
  const potentiallyLethalRiskFlag = input.amatoxinPresent === "detected";
  return {
    capAssayResult: input.amatoxinPresent,
    potentiallyLethalRiskFlag,
    safetyGuidance: potentiallyLethalRiskFlag
      ? "Amatoxin detected: do not consume the specimen; suspected exposure requires urgent poison-control or medical guidance."
      : "Amatoxin not detected: this result does not establish that the specimen is edible or free of other toxins.",
  };
};

export const amatoxinCapAssayClassifierTool = createSimpleTool({
  id: "mycology/amatoxin-cap-assay-classifier",
  title: "Amatoxin Cap Assay",
  description:
    "Classify a reported amatoxin assay result as a potential lethal-toxin risk. Non-detection does not establish that a mushroom is edible or free of other toxins, and this tool does not replace laboratory or poison-control interpretation.",
  inputs: [
    {
      enum: ["detected", "not-detected"],
      id: "amatoxinPresent",
      label: "Amatoxin presence",
      kind: "string",
    },
  ],
  outputs: [
    { id: "capAssayResult", label: "Cap assay result", kind: "string" },
    {
      id: "potentiallyLethalRiskFlag",
      label: "Potentially lethal risk",
      kind: "boolean",
    },
    { id: "safetyGuidance", label: "Safety guidance", kind: "string" },
  ],
  calculate: (input) =>
    calculateAmatoxinCapAssayClassifier({
      amatoxinPresent:
        input.amatoxinPresent as AmatoxinCapAssayClassifierInput["amatoxinPresent"],
    }),
});
export const runAmatoxinCapAssayClassifier =
  amatoxinCapAssayClassifierTool.execute;
export default amatoxinCapAssayClassifierTool;
