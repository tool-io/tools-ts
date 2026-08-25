import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BrownWhiteRotSignatureClassifierInput = {
  readonly signature:
    "brown-cubical" | "white-fibrous" | "soft-rot" | "white-pocket";
};

export type BrownWhiteRotSignatureClassifierOutput = {
  readonly interpretation: string;
  readonly rotSignature: string;
  readonly rotType: string;
};

export const brownWhiteRotSignatureClassifierExample = {
  input: { signature: "brown-cubical" },
  output: {
    interpretation:
      "Brown, cubically cracked wood is a field signature consistent with brown rot.",
    rotSignature: "brown-cubical",
    rotType: "brown-rot",
  },
} satisfies ToolExample<
  BrownWhiteRotSignatureClassifierInput,
  BrownWhiteRotSignatureClassifierOutput
>;

export const ROT_TYPES: Record<string, string> = {
  "brown-cubical": "brown-rot",
  "soft-rot": "soft-rot",
  "white-fibrous": "white-rot",
  "white-pocket": "white-rot",
};

const INTERPRETATIONS: Record<
  BrownWhiteRotSignatureClassifierInput["signature"],
  string
> = {
  "brown-cubical":
    "Brown, cubically cracked wood is a field signature consistent with brown rot.",
  "soft-rot":
    "Softened surface decay or cavities is a field signature consistent with soft rot.",
  "white-fibrous":
    "Pale, fibrous wood is a field signature consistent with white rot.",
  "white-pocket":
    "Localized pale pockets in wood are a field signature consistent with white rot.",
};

export const calculateBrownWhiteRotSignatureClassifier = (
  input: BrownWhiteRotSignatureClassifierInput,
): BrownWhiteRotSignatureClassifierOutput => {
  const rotType = ROT_TYPES[input.signature];
  const interpretation = INTERPRETATIONS[input.signature];
  if (rotType === undefined || interpretation === undefined)
    return simpleError(
      "signature",
      "Select a supported wood-decay signature.",
      "invalid_signature",
    );
  return { interpretation, rotSignature: input.signature, rotType };
};

export const brownWhiteRotSignatureClassifierTool = createSimpleTool({
  id: "mycology/brown-white-rot-signature-classifier",
  title: "Rot Signature Classifier",
  description: "Maps a wood decay signature to brown, white, or soft rot type.",
  inputs: [
    {
      enum: ["brown-cubical", "white-fibrous", "soft-rot", "white-pocket"],
      id: "signature",
      kind: "string",
      label: "Decay signature",
    },
  ],
  outputs: [
    { id: "interpretation", kind: "string", label: "Interpretation" },
    {
      enum: ["brown-cubical", "white-fibrous", "soft-rot", "white-pocket"],
      id: "rotSignature",
      kind: "string",
      label: "Rot signature",
    },
    {
      enum: ["brown-rot", "white-rot", "soft-rot"],
      id: "rotType",
      kind: "string",
      label: "Rot type",
    },
  ],
  calculate: (input) =>
    calculateBrownWhiteRotSignatureClassifier({
      signature:
        input.signature as BrownWhiteRotSignatureClassifierInput["signature"],
    }),
});
export const runBrownWhiteRotSignatureClassifier =
  brownWhiteRotSignatureClassifierTool.execute;
export default brownWhiteRotSignatureClassifierTool;
