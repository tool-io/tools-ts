import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UnModelLifeTablePatternLookupInput = {
  readonly pattern:
    "general" | "latinAmerican" | "chilean" | "southAsian" | "farEastern";
};

export type UnModelLifeTablePatternLookupOutput = {
  readonly patternCode: string;
  readonly modelName: string;
};

const PATTERN_CODE = {
  general: "G",
  latinAmerican: "LA",
  chilean: "CH",
  southAsian: "SA",
  farEastern: "FE",
} as const;

const PATTERN_NAME = {
  general: "General",
  latinAmerican: "Latin American",
  chilean: "Chilean",
  southAsian: "South Asian",
  farEastern: "Far Eastern",
} as const;

export const calculateUnModelLifeTablePatternLookup = (
  input: UnModelLifeTablePatternLookupInput,
): UnModelLifeTablePatternLookupOutput => {
  if (!(input.pattern in PATTERN_NAME))
    simpleError(
      "pattern",
      "Choose one of the five UN Model Life Tables for Developing Countries patterns.",
      "invalid_pattern",
    );
  return {
    patternCode: PATTERN_CODE[input.pattern],
    modelName: `UN ${PATTERN_NAME[input.pattern]} pattern`,
  };
};

export const unModelLifeTablePatternLookupExample = {
  input: { pattern: "latinAmerican" },
  output: { patternCode: "LA", modelName: "UN Latin American pattern" },
} satisfies ToolExample<
  UnModelLifeTablePatternLookupInput,
  UnModelLifeTablePatternLookupOutput
>;

export const unModelLifeTablePatternLookupTool = createSimpleTool({
  id: "demography/un-model-life-table-pattern-lookup",
  title: "UN Model Life Table Pattern Lookup",
  description:
    "Validate and label one of the five patterns of the UN Model Life Tables for Developing Countries (1982): General, Latin American, Chilean, South Asian or Far Eastern.",
  inputs: [
    {
      description: "Regional mortality pattern of the UN model life tables.",
      enum: ["general", "latinAmerican", "chilean", "southAsian", "farEastern"],
      id: "pattern",
      kind: "string",
      label: "Pattern",
    },
  ],
  outputs: [
    {
      description: "Canonical short code for the pattern.",
      enum: ["G", "LA", "CH", "SA", "FE"],
      id: "patternCode",
      kind: "string",
      label: "Code",
    },
    {
      description: "Full pattern name.",
      id: "modelName",
      kind: "string",
      label: "Pattern name",
    },
  ],
  calculate: (input) =>
    calculateUnModelLifeTablePatternLookup(
      input as unknown as UnModelLifeTablePatternLookupInput,
    ),
});

export const runUnModelLifeTablePatternLookup =
  unModelLifeTablePatternLookupTool.execute;
export default unModelLifeTablePatternLookupTool;
