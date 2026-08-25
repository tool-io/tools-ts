import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const STRIAE_TYPES = [
  "none",
  "sulcate-striate",
  "pectinate",
  "translucent-lineate",
] as const;

const PATTERN_DESCRIPTIONS: Record<(typeof STRIAE_TYPES)[number], string> = {
  none: "No radial lines or grooves observed at the cap margin.",
  pectinate: "Comb-like radial grooves or ridges observed at the cap margin.",
  "sulcate-striate":
    "Radial grooves with visible striate lines at the cap margin.",
  "translucent-lineate":
    "Radial lines show through the thin, translucent cap margin.",
};

export type CapMarginStriationRaterInput = {
  readonly striae: (typeof STRIAE_TYPES)[number];
};

export type CapMarginStriationRaterOutput = {
  readonly marginType: CapMarginStriationRaterInput["striae"];
  readonly patternDescription: string;
  readonly striationsPresent: boolean;
};

export const capMarginStriationRaterExample = {
  input: { striae: "pectinate" },
  output: {
    marginType: "pectinate",
    patternDescription:
      "Comb-like radial grooves or ridges observed at the cap margin.",
    striationsPresent: true,
  },
} satisfies ToolExample<
  CapMarginStriationRaterInput,
  CapMarginStriationRaterOutput
>;

export const calculateCapMarginStriationRater = (
  input: CapMarginStriationRaterInput,
): CapMarginStriationRaterOutput => {
  const patternDescription = PATTERN_DESCRIPTIONS[input.striae];
  if (patternDescription === undefined)
    return simpleError(
      "striae",
      "Select a supported cap-margin pattern.",
      "invalid_striae",
    );
  return {
    marginType: input.striae,
    patternDescription,
    striationsPresent: input.striae !== "none",
  };
};

export const capMarginStriationRaterTool = createSimpleTool({
  id: "mycology/cap-margin-striation-rater",
  title: "Cap Margin Striation Classifier",
  description:
    "Classify an observed cap-margin striation pattern and explain the selected term without assigning an unsupported ordinal severity score.",
  inputs: [
    {
      enum: STRIAE_TYPES,
      id: "striae",
      kind: "string",
      label: "Striae",
    },
  ],
  outputs: [
    {
      enum: STRIAE_TYPES,
      id: "marginType",
      kind: "string",
      label: "Margin type",
    },
    { id: "striationsPresent", kind: "boolean", label: "Striations present" },
    { id: "patternDescription", kind: "string", label: "Pattern description" },
  ],
  calculate: (input) =>
    calculateCapMarginStriationRater({
      striae: input.striae as CapMarginStriationRaterInput["striae"],
    }),
});
export const runCapMarginStriationRater = capMarginStriationRaterTool.execute;
export default capMarginStriationRaterTool;
