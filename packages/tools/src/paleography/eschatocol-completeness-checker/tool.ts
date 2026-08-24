import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type EschatocolCompletenessCheckerInput = {
  readonly hasDatingClause?: boolean;
  readonly hasWitnessList?: boolean;
  readonly hasRoboratio?: boolean;
  readonly hasSealingClause?: boolean;
};

export type EschatocolCompletenessCheckerOutput = {
  readonly presentElementCount: number;
  readonly completenessPercentage: number;
  readonly missingElements: readonly string[];
  readonly verdict: "complete" | "partial" | "fragmentary";
};

export const calculateEschatocolCompletenessChecker = (
  input: EschatocolCompletenessCheckerInput,
): EschatocolCompletenessCheckerOutput => {
  const elements: ReadonlyArray<readonly [string, boolean]> = [
    ["dating_clause", input.hasDatingClause ?? false],
    ["witness_list", input.hasWitnessList ?? false],
    ["roboratio", input.hasRoboratio ?? false],
    ["sealing_clause", input.hasSealingClause ?? false],
  ];
  const presentElementCount = elements.filter(([, seen]) => seen).length;
  const missingElements = elements
    .filter(([, seen]) => !seen)
    .map(([id]) => id);
  const completenessPercentage = (presentElementCount / elements.length) * 100;
  const verdict =
    presentElementCount === elements.length
      ? "complete"
      : presentElementCount >= 2
        ? "partial"
        : "fragmentary";
  return {
    completenessPercentage,
    missingElements,
    presentElementCount,
    verdict,
  };
};

export const eschatocolCompletenessCheckerExample = {
  input: {
    hasDatingClause: true,
    hasWitnessList: true,
    hasRoboratio: true,
    hasSealingClause: false,
  },
  output: {
    completenessPercentage: 75,
    missingElements: ["sealing_clause"],
    presentElementCount: 3,
    verdict: "partial",
  },
} satisfies ToolExample<
  EschatocolCompletenessCheckerInput,
  EschatocolCompletenessCheckerOutput
>;

export const eschatocolCompletenessCheckerTool = createSimpleTool({
  id: "paleography/eschatocol-completeness-checker",
  title: "Eschatocol Completeness Checker",
  description:
    "Score the closing protocol (eschatocol) of a charter against its four standard elements (dating clause, witness list, roboratio, sealing clause) under the stated heuristic: all four is complete, two or three is partial, fewer than two is fragmentary.",
  inputs: [
    {
      default: false,
      description: "A dating clause (temporal or regnal) is present.",
      id: "hasDatingClause",
      kind: "boolean",
      label: "Dating clause",
    },
    {
      default: false,
      description: "A witness list or subscription row is present.",
      id: "hasWitnessList",
      kind: "boolean",
      label: "Witness list",
    },
    {
      default: false,
      description: "A roboratio (validation/strengthening formula) is present.",
      id: "hasRoboratio",
      kind: "boolean",
      label: "Roboratio",
    },
    {
      default: false,
      description: "A sealing or sigillation clause is present.",
      id: "hasSealingClause",
      kind: "boolean",
      label: "Sealing clause",
    },
  ],
  outputs: [
    {
      description: "Number of the four standard eschatocol elements ticked.",
      id: "presentElementCount",
      kind: "integer",
      label: "Present elements",
    },
    {
      description: "Share of the four elements present, in percent.",
      id: "completenessPercentage",
      kind: "number",
      label: "Completeness",
    },
    {
      description: "Identifiers of the standard elements that are absent.",
      id: "missingElements",
      kind: "stringList",
      label: "Missing elements",
    },
    {
      description:
        "Stated-heuristic completeness verdict from the element tally.",
      id: "verdict",
      enum: ["complete", "partial", "fragmentary"],
      kind: "string",
      label: "Verdict",
    },
  ],
  calculate: (input) =>
    calculateEschatocolCompletenessChecker({
      hasDatingClause: input.hasDatingClause as boolean,
      hasWitnessList: input.hasWitnessList as boolean,
      hasRoboratio: input.hasRoboratio as boolean,
      hasSealingClause: input.hasSealingClause as boolean,
    }),
});

export const runEschatocolCompletenessChecker =
  eschatocolCompletenessCheckerTool.execute;
export default eschatocolCompletenessCheckerTool;
