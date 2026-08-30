import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const hallmarkEntries = {
  currentSwissOfficial: {
    keyDate: "current Swiss regime",
    statement:
      "Swiss precious-metal watch cases sold in Switzerland use the St. Bernard official hallmark for all precious metals and fineness standards; an X identifies the control office.",
  },
  exportMark: {
    keyDate: "jurisdiction and period specific",
    statement:
      "Export or import marks can reflect destination-market rules, case-maker practice, or customs treatment and do not by themselves prove the retail brand or exact destination.",
  },
  finenessMark: {
    keyDate: "market and period specific",
    statement:
      "A fineness or standard mark states a regulated metal fineness only when interpreted under the applicable national hallmarking system and mark set.",
  },
  makerMark: {
    keyDate: "case-production evidence",
    statement:
      "A case-maker or responsibility mark can support case-production attribution when cross-referenced with period hallmarks, construction, and known case-maker records.",
  },
  symbolColorCaution: {
    keyDate: "interpretation caution",
    statement:
      "Anchor, star, cross, animal, letter, and color marks are not universal purity symbols; identify the issuing assay office and legal system before interpreting shape or color.",
  },
  watchCaseScope: {
    keyDate: "current Swiss regime",
    statement:
      "Compulsory Swiss control covers watch cases made from gold, silver, platinum, or palladium, whether foreign or domestic, when sold in Switzerland.",
  },
} as const;

export type HallmarkRoleFocus = keyof typeof hallmarkEntries;

export type HallmarkRoleLookupInput = {
  readonly hallmarkFocus: HallmarkRoleFocus;
};

export type HallmarkRoleLookupOutput = {
  readonly hallmarkFocus: HallmarkRoleFocus;
  readonly keyDate: string;
  readonly verifiedStatement: string;
};

export const lookupWatchCaseHallmarkRole = (
  input: HallmarkRoleLookupInput,
): HallmarkRoleLookupOutput => {
  const entry = hallmarkEntries[input.hallmarkFocus];
  if (entry === undefined)
    simpleError(
      "hallmarkFocus",
      "Hallmark role focus is not supported.",
      "unsupported_hallmark_focus",
    );
  return {
    hallmarkFocus: input.hallmarkFocus,
    keyDate: entry.keyDate,
    verifiedStatement: entry.statement,
  };
};

export const hallmarkRoleExample = {
  input: { hallmarkFocus: "symbolColorCaution" },
  output: {
    hallmarkFocus: "symbolColorCaution",
    keyDate: "interpretation caution",
    verifiedStatement:
      "Anchor, star, cross, animal, letter, and color marks are not universal purity symbols; identify the issuing assay office and legal system before interpreting shape or color.",
  },
} satisfies ToolExample<HallmarkRoleLookupInput, HallmarkRoleLookupOutput>;

export const hallmarkRoleTool = createSimpleTool({
  calculate: (input) =>
    lookupWatchCaseHallmarkRole({
      hallmarkFocus: input.hallmarkFocus as HallmarkRoleFocus,
    }),
  description:
    "Return the role, legal scope, or cross-reference caution for a watch-case hallmark, fineness, responsibility, or export mark without decoding symbols by color alone.",
  id: "horology/watch-case-hallmark-role-lookup",
  inputs: [
    {
      enum: [
        "currentSwissOfficial",
        "watchCaseScope",
        "finenessMark",
        "makerMark",
        "exportMark",
        "symbolColorCaution",
      ],
      id: "hallmarkFocus",
      kind: "string",
      label: "Watch-case hallmark role focus",
    },
  ],
  outputs: [
    {
      id: "hallmarkFocus",
      kind: "string",
      label: "Watch-case hallmark role focus",
    },
    { id: "keyDate", kind: "string", label: "Regime, date, or status" },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified hallmark statement",
    },
  ],
  title: "Watch Case Hallmark Role Lookup",
});

export const runHallmarkRole = hallmarkRoleTool.execute;
export default hallmarkRoleTool;
