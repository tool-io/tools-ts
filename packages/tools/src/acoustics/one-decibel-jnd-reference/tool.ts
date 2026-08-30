import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type JustNoticeableLevelDifference1dbReferenceLookupInput = Readonly<
  Record<string, never>
>;

export type JustNoticeableLevelDifference1dbReferenceLookupOutput = Readonly<{
  interpretation: string;
  nominalDifferenceDecibels: number;
  reference: string;
  requiredContext: readonly string[];
  universalJustNoticeableDifference: boolean;
}>;

const output: JustNoticeableLevelDifference1dbReferenceLookupOutput = {
  interpretation:
    "A 1 dB difference is a reference increment, not a generally detectable or universally just-noticeable level difference.",
  nominalDifferenceDecibels: 1,
  reference:
    "Johnson et al., Journal of the Acoustical Society of America 93, 983-991 (1993), doi:10.1121/1.405404; Stillman et al., same volume, 425-434 (1993), doi:10.1121/1.405622.",
  requiredContext: [
    "stimulus type, spectrum, and bandwidth",
    "frequency and presentation level relative to threshold",
    "masking and listening conditions",
    "listener population and hearing status",
    "psychophysical procedure and response criterion",
  ],
  universalJustNoticeableDifference: false,
};

export const lookupJustNoticeableLevelDifference1dbReference =
  (): JustNoticeableLevelDifference1dbReferenceLookupOutput => output;

export const example = {
  input: {},
  output,
} satisfies ToolExample<
  JustNoticeableLevelDifference1dbReferenceLookupInput,
  JustNoticeableLevelDifference1dbReferenceLookupOutput
>;

export const justNoticeableLevelDifference1dbReferenceLookupTool =
  createSimpleTool({
    calculate: lookupJustNoticeableLevelDifference1dbReference,
    description:
      "Return the nominal 1 dB level-difference reference with the psychophysical conditions required before it can be called a just-noticeable difference.",
    id: "acoustics/one-decibel-jnd-reference",
    inputs: [],
    outputs: [
      {
        id: "interpretation",
        kind: "string",
        label: "Interpretation",
      },
      {
        id: "nominalDifferenceDecibels",
        kind: "number",
        label: "Nominal level difference",
        unit: "dB",
      },
      { id: "reference", kind: "string", label: "Reference" },
      {
        id: "requiredContext",
        kind: "stringList",
        label: "Required JND context",
      },
      {
        id: "universalJustNoticeableDifference",
        kind: "boolean",
        label: "Universal JND",
      },
    ],
    title: "One-Decibel JND Reference",
  });

export const runJustNoticeableLevelDifference1dbReferenceLookup =
  justNoticeableLevelDifference1dbReferenceLookupTool.execute;
export default justNoticeableLevelDifference1dbReferenceLookupTool;
