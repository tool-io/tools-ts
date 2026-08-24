import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type InsularFamilyFlagCheckerInput = {
  readonly insularG?: boolean;
  readonly insularD?: boolean;
  readonly insularS?: boolean;
  readonly tironianEtUsed?: boolean;
};

export type InsularFamilyFlagCheckerOutput = {
  readonly matchedFeatureCount: number;
  readonly verdict: "unlikely" | "possible" | "probable_insular";
};

export const calculateInsularFamilyFlagChecker = (
  input: InsularFamilyFlagCheckerInput,
): InsularFamilyFlagCheckerOutput => {
  const matchedFeatureCount = [
    input.insularG ?? false,
    input.insularD ?? false,
    input.insularS ?? false,
    input.tironianEtUsed ?? false,
  ].filter((flag) => flag).length;
  const verdict =
    matchedFeatureCount === 0
      ? "unlikely"
      : matchedFeatureCount === 1
        ? "possible"
        : "probable_insular";
  return { matchedFeatureCount, verdict };
};

export const insularFamilyFlagCheckerExample = {
  input: {
    insularG: true,
    insularD: false,
    insularS: true,
    tironianEtUsed: false,
  },
  output: { matchedFeatureCount: 2, verdict: "probable_insular" },
} satisfies ToolExample<
  InsularFamilyFlagCheckerInput,
  InsularFamilyFlagCheckerOutput
>;

export const insularFamilyFlagCheckerTool = createSimpleTool({
  id: "paleography/insular-family-flag-checker",
  title: "Insular Family Flag Checker",
  description:
    "Tally four documented Insular script features (insular g, insular delta-shaped d, long-descender insular s and the Tironian et) under the stated heuristic: no features means unlikely, exactly one is possible, two or more is probable Insular.",
  inputs: [
    {
      default: false,
      description: "Insular g (three-quarter form) observed.",
      id: "insularG",
      kind: "boolean",
      label: "Insular g",
    },
    {
      default: false,
      description: "Insular delta-shaped d observed.",
      id: "insularD",
      kind: "boolean",
      label: "Insular d",
    },
    {
      default: false,
      description: "Insular s with long descending stroke observed.",
      id: "insularS",
      kind: "boolean",
      label: "Insular s",
    },
    {
      default: false,
      description: "Tironian et sign used for 'and'.",
      id: "tironianEtUsed",
      kind: "boolean",
      label: "Tironian et",
    },
  ],
  outputs: [
    {
      description: "Number of documented Insular features ticked.",
      id: "matchedFeatureCount",
      kind: "integer",
      label: "Matched features",
    },
    {
      description: "Stated-heuristic verdict from the feature tally.",
      id: "verdict",
      enum: ["unlikely", "possible", "probable_insular"],
      kind: "string",
      label: "Verdict",
    },
  ],
  calculate: (input) =>
    calculateInsularFamilyFlagChecker({
      insularD: input.insularD as boolean,
      insularG: input.insularG as boolean,
      insularS: input.insularS as boolean,
      tironianEtUsed: input.tironianEtUsed as boolean,
    }),
});

export const runInsularFamilyFlagChecker = insularFamilyFlagCheckerTool.execute;
export default insularFamilyFlagCheckerTool;
