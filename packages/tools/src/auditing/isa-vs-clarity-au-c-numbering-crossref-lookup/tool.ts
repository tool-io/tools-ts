import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NumberingCrossReferenceInput = {
  readonly expectedPrefixes: ReadonlyArray<string>;
  readonly reportedPrefixes: ReadonlyArray<string>;
};

export type NumberingCrossReferenceOutput = {
  readonly complete: boolean;
  readonly duplicatePrefixes: ReadonlyArray<string>;
  readonly missingPrefixes: ReadonlyArray<string>;
  readonly unknownPrefixes: ReadonlyArray<string>;
};

export const crossReferenceAuditNumbering = (
  input: NumberingCrossReferenceInput,
): NumberingCrossReferenceOutput => {
  if (
    !Array.isArray(input.expectedPrefixes) ||
    !Array.isArray(input.reportedPrefixes)
  )
    simpleError(
      "",
      "Expected and reported prefixes must be arrays.",
      "prefix_data_required",
    );
  const normalizeList = (
    values: ReadonlyArray<string>,
    field: string,
  ): string[] => {
    if (!Array.isArray(values))
      simpleError(field, `${field} must be an array.`, "prefix_list_required");
    return values.map((value, index) => {
      if (typeof value !== "string" || value.trim() === "")
        simpleError(
          `${field}.${index}`,
          "Prefixes must be nonempty strings.",
          "invalid_prefix",
        );
      return value.trim().toLowerCase();
    });
  };
  const expected = normalizeList(input.expectedPrefixes, "expectedPrefixes");
  const reported = normalizeList(input.reportedPrefixes, "reportedPrefixes");
  if (expected.length === 0)
    simpleError(
      "expectedPrefixes",
      "At least one expected prefix is required.",
      "expected_prefixes_required",
    );
  const expectedSet = new Set(expected);
  const reportedSet = new Set(reported);
  const missingPrefixes = [...expectedSet]
    .filter((prefix) => !reportedSet.has(prefix))
    .sort();
  const unknownPrefixes = [...reportedSet]
    .filter((prefix) => !expectedSet.has(prefix))
    .sort();
  const counts = new Map<string, number>();
  for (const prefix of reported)
    counts.set(prefix, (counts.get(prefix) ?? 0) + 1);
  const duplicatePrefixes = [...counts]
    .filter(([, count]) => count > 1)
    .map(([prefix]) => prefix)
    .sort();
  return {
    complete:
      missingPrefixes.length === 0 &&
      unknownPrefixes.length === 0 &&
      duplicatePrefixes.length === 0,
    duplicatePrefixes,
    missingPrefixes,
    unknownPrefixes,
  };
};

export const numberingCrossReferenceExample = {
  input: {
    expectedPrefixes: ["ISA", "AU-C"],
    reportedPrefixes: ["ISA", "isa", "AU-C", "XYZ-1"],
  },
  output: {
    complete: false,
    duplicatePrefixes: ["isa"],
    missingPrefixes: [],
    unknownPrefixes: ["xyz-1"],
  },
} satisfies ToolExample<
  NumberingCrossReferenceInput,
  NumberingCrossReferenceOutput
>;

export const numberingCrossReferenceTool = createSimpleTool({
  calculate: (input) =>
    crossReferenceAuditNumbering({
      expectedPrefixes: input.expectedPrefixes as string[],
      reportedPrefixes: input.reportedPrefixes as string[],
    }),
  description:
    "Cross-reference normalized audit-standard prefixes and report missing, unknown, and repeated prefixes without asserting either numbering system is current.",
  id: "auditing/isa-vs-clarity-au-c-numbering-crossref-lookup",
  inputs: [
    { id: "expectedPrefixes", kind: "stringList", label: "Expected prefixes" },
    { id: "reportedPrefixes", kind: "stringList", label: "Reported prefixes" },
  ],
  outputs: [
    { id: "complete", kind: "boolean", label: "Cross-reference complete" },
    {
      id: "duplicatePrefixes",
      kind: "stringList",
      label: "Duplicate reported prefixes",
    },
    { id: "missingPrefixes", kind: "stringList", label: "Missing prefixes" },
    { id: "unknownPrefixes", kind: "stringList", label: "Unknown prefixes" },
  ],
  title: "ISA vs Clarity AU-C Numbering Cross-Reference Lookup",
});

export const runNumberingCrossReference = numberingCrossReferenceTool.execute;
export default numberingCrossReferenceTool;
