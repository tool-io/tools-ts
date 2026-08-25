import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AzoleRiskTierClassifierInput = {
  readonly knownResistanceVariantDetected: boolean;
  readonly phenotypicAzoleResistanceDetected: boolean;
};

export type AzoleRiskTierClassifierOutput = {
  readonly cyp51RiskTier:
    | "phenotypic-resistance-detected"
    | "resistance-marker-detected"
    | "no-resistance-marker-reported";
  readonly interpretation: string;
};

export const azoleRiskTierClassifierExample = {
  input: {
    knownResistanceVariantDetected: true,
    phenotypicAzoleResistanceDetected: false,
  },
  output: {
    cyp51RiskTier: "resistance-marker-detected",
    interpretation:
      "A known resistance-associated CYP51 variant was reported; correlate it with organism-specific susceptibility results.",
  },
} satisfies ToolExample<
  AzoleRiskTierClassifierInput,
  AzoleRiskTierClassifierOutput
>;

export const calculateAzoleRiskTierClassifier = (
  input: AzoleRiskTierClassifierInput,
): AzoleRiskTierClassifierOutput => {
  if (typeof input.knownResistanceVariantDetected !== "boolean")
    return simpleError(
      "knownResistanceVariantDetected",
      "Known resistance variant status must be true or false.",
      "invalid_status",
    );
  if (typeof input.phenotypicAzoleResistanceDetected !== "boolean")
    return simpleError(
      "phenotypicAzoleResistanceDetected",
      "Phenotypic resistance status must be true or false.",
      "invalid_status",
    );
  if (input.phenotypicAzoleResistanceDetected)
    return {
      cyp51RiskTier: "phenotypic-resistance-detected",
      interpretation:
        "Phenotypic azole resistance was reported; CYP51 findings alone do not explain every resistance mechanism.",
    };
  if (input.knownResistanceVariantDetected)
    return {
      cyp51RiskTier: "resistance-marker-detected",
      interpretation:
        "A known resistance-associated CYP51 variant was reported; correlate it with organism-specific susceptibility results.",
    };
  return {
    cyp51RiskTier: "no-resistance-marker-reported",
    interpretation:
      "No known CYP51 resistance marker or phenotypic resistance was reported; this does not prove azole susceptibility.",
  };
};

export const azoleRiskTierClassifierTool = createSimpleTool({
  id: "mycology/azole-cyp51-risk-tier-classifier",
  title: "CYP51 Azole Resistance Evidence Classifier",
  description:
    "Classify reported CYP51 resistance-marker and phenotypic susceptibility evidence without treating mutation count as a resistance score. Specific variants, fungal species, azole drug, and susceptibility results determine interpretation.",
  inputs: [
    {
      id: "knownResistanceVariantDetected",
      kind: "boolean",
      label: "Known CYP51 marker detected",
    },
    {
      id: "phenotypicAzoleResistanceDetected",
      kind: "boolean",
      label: "Phenotypic resistance detected",
    },
  ],
  outputs: [
    {
      enum: [
        "phenotypic-resistance-detected",
        "resistance-marker-detected",
        "no-resistance-marker-reported",
      ],
      id: "cyp51RiskTier",
      kind: "string",
      label: "CYP51 risk tier",
    },
    { id: "interpretation", kind: "string", label: "Interpretation" },
  ],
  calculate: (input) =>
    calculateAzoleRiskTierClassifier({
      knownResistanceVariantDetected:
        input.knownResistanceVariantDetected as boolean,
      phenotypicAzoleResistanceDetected:
        input.phenotypicAzoleResistanceDetected as boolean,
    }),
});
export const runAzoleRiskTierClassifier = azoleRiskTierClassifierTool.execute;
export default azoleRiskTierClassifierTool;
