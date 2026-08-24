import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CollationFormulaBuilderInput = {
  readonly quireLeaves: readonly number[];
};

export type CollationFormulaBuilderOutput = {
  readonly formula: string;
  readonly totalLeaves: number;
  readonly totalBifolia: number;
  readonly totalPages: number;
};

const ROMAN_TABLE: ReadonlyArray<readonly [number, string]> = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

const toRoman = (value: number): string => {
  let remaining = value;
  let out = "";
  for (const [unit, glyph] of ROMAN_TABLE)
    while (remaining >= unit) {
      out += glyph;
      remaining -= unit;
    }
  return out;
};

export const calculateCollationFormulaBuilder = (
  input: CollationFormulaBuilderInput,
): CollationFormulaBuilderOutput => {
  if (!(Array.isArray(input.quireLeaves) && input.quireLeaves.length > 0))
    return simpleError(
      "quireLeaves",
      "Provide at least one quire size.",
      "invalid_collation",
    );
  for (const leaves of input.quireLeaves) {
    if (!Number.isSafeInteger(leaves) || leaves < 2 || leaves % 2 !== 0)
      return simpleError(
        "quireLeaves",
        "Each complete quire must contain an even safe-integer leaf count of at least two.",
        "invalid_collation",
      );
  }
  const formula = input.quireLeaves
    .map((leaves, index) => `${toRoman(index + 1)}^${leaves}`)
    .join("+");
  const totalLeaves = input.quireLeaves.reduce((sum, n) => sum + n, 0);
  if (!Number.isSafeInteger(totalLeaves))
    return simpleError(
      "quireLeaves",
      "The total leaf count exceeds the safe integer range.",
      "numeric_range",
    );
  return {
    formula,
    totalLeaves,
    totalBifolia: totalLeaves / 2,
    totalPages: totalLeaves * 2,
  };
};

export const collationFormulaBuilderExample = {
  input: { quireLeaves: [8, 8, 4] },
  output: {
    formula: "I^8+II^8+III^4",
    totalLeaves: 20,
    totalBifolia: 10,
    totalPages: 40,
  },
} satisfies ToolExample<
  CollationFormulaBuilderInput,
  CollationFormulaBuilderOutput
>;

export const collationFormulaBuilderTool = createSimpleTool({
  id: "paleography/collation-formula-builder",
  title: "Collation Formula Builder",
  description:
    "Build a collation formula from a list of per-quire leaf counts as Roman-numbered terms joined by plus signs and total the exact leaf, bifolium and page counts.",
  inputs: [
    {
      description: "Leaf count of each quire in order.",
      id: "quireLeaves",
      kind: "numberList",
      label: "Quire leaves",
    },
  ],
  outputs: [
    {
      description: "Collation formula such as I^8+II^8.",
      id: "formula",
      kind: "string",
      label: "Formula",
    },
    {
      description: "Sum of all quire leaves.",
      id: "totalLeaves",
      kind: "number",
      label: "Total leaves",
    },
    {
      description: "Total folded sheets across the codex.",
      id: "totalBifolia",
      kind: "number",
      label: "Total bifolia",
    },
    {
      description: "Total pages (two per leaf).",
      id: "totalPages",
      kind: "number",
      label: "Total pages",
    },
  ],
  calculate: (input) =>
    calculateCollationFormulaBuilder({
      quireLeaves: input.quireLeaves as readonly number[],
    }),
});

export const runCollationFormulaBuilder = collationFormulaBuilderTool.execute;
export default collationFormulaBuilderTool;
