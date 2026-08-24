import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MarginaliaEraClassifierInput = {
  readonly scriptHand:
    | "insular_minuscule"
    | "caroline_minuscule"
    | "gothic_textualis"
    | "gothic_cursive"
    | "humanist_cursive"
    | "secretary";
  readonly century?: number;
};

export type MarginaliaEraClassifierOutput = {
  readonly currencyFromCentury: number;
  readonly currencyToCentury: number;
  readonly centuryChecked: boolean;
  readonly matchesGivenCentury: boolean;
};

type EraBand = {
  readonly from: number;
  readonly label: string;
  readonly to: number;
};

const ERA_BANDS: Record<MarginaliaEraClassifierInput["scriptHand"], EraBand> = {
  insular_minuscule: { from: 7, label: "Insular minuscule", to: 9 },
  caroline_minuscule: { from: 9, label: "Caroline minuscule", to: 12 },
  gothic_textualis: { from: 12, label: "Gothic textualis", to: 15 },
  gothic_cursive: { from: 12, label: "Gothic cursive", to: 15 },
  humanist_cursive: { from: 15, label: "Humanist cursive", to: 16 },
  secretary: { from: 15, label: "Secretary hand", to: 17 },
};

export const calculateMarginaliaEraClassifier = (
  input: MarginaliaEraClassifierInput,
): MarginaliaEraClassifierOutput => {
  const band = ERA_BANDS[input.scriptHand];
  if (!band)
    return simpleError(
      "scriptHand",
      "Choose a supported script hand.",
      "invalid_script_hand",
    );
  const century = input.century ?? 0;
  if (!Number.isSafeInteger(century) || century < 0)
    return simpleError(
      "century",
      "Give a positive century, or leave it unset to skip the check.",
      "invalid_century",
    );
  return {
    currencyFromCentury: band.from,
    currencyToCentury: band.to,
    centuryChecked: century >= 1,
    matchesGivenCentury:
      century >= 1 && century >= band.from && century <= band.to,
  };
};

export const marginaliaEraClassifierExample = {
  input: { scriptHand: "gothic_cursive", century: 14 },
  output: {
    currencyFromCentury: 12,
    currencyToCentury: 15,
    centuryChecked: true,
    matchesGivenCentury: true,
  },
} satisfies ToolExample<
  MarginaliaEraClassifierInput,
  MarginaliaEraClassifierOutput
>;

export const marginaliaEraClassifierTool = createSimpleTool({
  id: "paleography/marginalia-era-classifier",
  title: "Marginalia Era Classifier",
  description:
    "Place a marginal hand on the standard main-currency table (insular minuscule 7th-9th c., Caroline minuscule 9th-12th, Gothic textualis and Gothic cursive 12th-15th, humanist cursive 15th-16th, secretary 15th-17th) and optionally check it against an observed century.",
  inputs: [
    {
      description: "Observed marginal hand.",
      enum: [
        "insular_minuscule",
        "caroline_minuscule",
        "gothic_textualis",
        "gothic_cursive",
        "humanist_cursive",
        "secretary",
      ],
      id: "scriptHand",
      kind: "string",
      label: "Script hand",
    },
    {
      default: 0,
      description:
        "Century of the annotation (0 skips the plausibility check).",
      id: "century",
      kind: "integer",
      label: "Century",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "First century of the hand's main currency.",
      id: "currencyFromCentury",
      kind: "number",
      label: "From century",
    },
    {
      description: "Last century of the hand's main currency.",
      id: "currencyToCentury",
      kind: "number",
      label: "To century",
    },
    {
      description: "True when a century was supplied for checking.",
      id: "centuryChecked",
      kind: "boolean",
      label: "Century checked",
    },
    {
      description: "True when the supplied century lies inside the band.",
      id: "matchesGivenCentury",
      kind: "boolean",
      label: "Plausible",
    },
  ],
  calculate: (input) =>
    calculateMarginaliaEraClassifier({
      scriptHand:
        input.scriptHand as MarginaliaEraClassifierInput["scriptHand"],
      century: input.century as number,
    }),
});

export const runMarginaliaEraClassifier = marginaliaEraClassifierTool.execute;
export default marginaliaEraClassifierTool;
