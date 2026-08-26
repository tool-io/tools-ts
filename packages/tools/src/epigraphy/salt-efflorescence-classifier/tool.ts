import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type SaltEfflorescenceClassifierInput = {
  readonly location: "surface" | "subsurface";
};

export type SaltEfflorescenceClassifierOutput = {
  readonly classification: "efflorescence" | "subflorescence";
  readonly definitionNote: string;
};

const DEFINITIONS = {
  surface:
    "Salt crystallizing on the stone surface as efflorescence, visible as a white bloom.",
  subsurface:
    "Salt crystallizing beneath the stone surface as subflorescence, driving scaling and exfoliation from within.",
} as const;

export const calculateSaltEfflorescenceClassifier = (
  input: SaltEfflorescenceClassifierInput,
): SaltEfflorescenceClassifierOutput => {
  if (input.location === "surface")
    return {
      classification: "efflorescence",
      definitionNote: DEFINITIONS.surface,
    };
  return {
    classification: "subflorescence",
    definitionNote: DEFINITIONS.subsurface,
  };
};

export const saltEfflorescenceClassifierExample = {
  input: { location: "subsurface" },
  output: {
    classification: "subflorescence",
    definitionNote:
      "Salt crystallizing beneath the stone surface as subflorescence, driving scaling and exfoliation from within.",
  },
} satisfies ToolExample<
  SaltEfflorescenceClassifierInput,
  SaltEfflorescenceClassifierOutput
>;

export const saltEfflorescenceClassifierTool = createSimpleTool({
  id: "epigraphy/salt-efflorescence-classifier",
  title: "Salt Efflorescence Subflorescence Type Classifier",
  description:
    "Classify observed salt damage as efflorescence or subflorescence according to whether crystallization occurs on the surface or beneath it.",
  inputs: [
    {
      default: "surface",
      description: "Where the salt crystallization was observed.",
      enum: ["surface", "subsurface"],
      id: "location",
      kind: "string",
      label: "Location",
    },
  ],
  outputs: [
    {
      description: "Salt damage class implied by the observation site.",
      id: "classification",
      enum: ["efflorescence", "subflorescence"],
      kind: "string",
      label: "Classification",
    },
    {
      description: "Short definition of the assigned class.",
      id: "definitionNote",
      kind: "string",
      label: "Definition",
    },
  ],
  calculate: (input) =>
    calculateSaltEfflorescenceClassifier(
      input as unknown as SaltEfflorescenceClassifierInput,
    ),
});

export const runSaltEfflorescenceClassifier =
  saltEfflorescenceClassifierTool.execute;
export default saltEfflorescenceClassifierTool;
