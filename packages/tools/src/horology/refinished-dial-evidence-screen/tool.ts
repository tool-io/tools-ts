import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DialEvidenceInput = {
  readonly documentationSupportsOriginalDial: boolean;
  readonly replacementDialConfirmed: boolean;
  readonly refinishedOriginalDialConfirmed: boolean;
};

export type DialEvidenceOutput = {
  readonly classification:
    | "confirmedRefinish"
    | "confirmedReplacement"
    | "insufficientEvidence"
    | "supportedOriginal";
  readonly evidenceCaution: string;
};

export const screenRefinishedDialEvidence = (
  input: DialEvidenceInput,
): DialEvidenceOutput => {
  if (input.replacementDialConfirmed && input.refinishedOriginalDialConfirmed)
    simpleError(
      "",
      "A dial cannot be classified as both confirmed replacement and confirmed refinished original.",
      "contradictory_dial_evidence",
    );
  const classification = input.replacementDialConfirmed
    ? "confirmedReplacement"
    : input.refinishedOriginalDialConfirmed
      ? "confirmedRefinish"
      : input.documentationSupportsOriginalDial
        ? "supportedOriginal"
        : "insufficientEvidence";
  return {
    classification,
    evidenceCaution:
      "This screen organizes explicit evidence only. Dial age, printing, patina, relief, lume, and service marks still require reference-level examination; no percentage originality penalty is inferred here.",
  };
};

export const refinishedDialExample = {
  input: {
    documentationSupportsOriginalDial: true,
    replacementDialConfirmed: false,
    refinishedOriginalDialConfirmed: true,
  },
  output: {
    classification: "confirmedRefinish",
    evidenceCaution:
      "This screen organizes explicit evidence only. Dial age, printing, patina, relief, lume, and service marks still require reference-level examination; no percentage originality penalty is inferred here.",
  },
} satisfies ToolExample<DialEvidenceInput, DialEvidenceOutput>;

export const refinishedDialTool = createSimpleTool({
  calculate: (input) =>
    screenRefinishedDialEvidence({
      documentationSupportsOriginalDial:
        input.documentationSupportsOriginalDial as boolean,
      replacementDialConfirmed: input.replacementDialConfirmed as boolean,
      refinishedOriginalDialConfirmed:
        input.refinishedOriginalDialConfirmed as boolean,
    }),
  description:
    "Organize explicit evidence into replacement, refinished original, supported original, or insufficient-evidence dial classifications without inventing a value penalty.",
  id: "horology/refinished-dial-evidence-screen",
  inputs: [
    {
      id: "documentationSupportsOriginalDial",
      kind: "boolean",
      label: "Documentation supports original dial",
    },
    {
      id: "replacementDialConfirmed",
      kind: "boolean",
      label: "Replacement dial confirmed",
    },
    {
      id: "refinishedOriginalDialConfirmed",
      kind: "boolean",
      label: "Refinished original dial confirmed",
    },
  ],
  outputs: [
    {
      enum: [
        "confirmedReplacement",
        "confirmedRefinish",
        "supportedOriginal",
        "insufficientEvidence",
      ],
      id: "classification",
      kind: "string",
      label: "Dial evidence classification",
    },
    { id: "evidenceCaution", kind: "string", label: "Dial evidence caution" },
  ],
  title: "Refinished Dial Evidence Screen",
});

export const runRefinishedDial = refinishedDialTool.execute;
export default refinishedDialTool;
