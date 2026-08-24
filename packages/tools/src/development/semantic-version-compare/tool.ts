import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SemanticVersionCompareInput = {
  readonly versionA: string;
  readonly versionB: string;
};

export type SemanticVersionCompareOutput = {
  readonly comparison: number;
};

export type SemanticVersion = {
  readonly build: readonly string[];
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
  readonly prerelease: readonly (number | string)[];
};

// Strict semver.org grammar: no leading zeros; optional hyphen-separated
// prerelease and plus-separated build identifiers.
const VERSION_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export const parseSemanticVersion = (
  value: string,
  field = "version",
): SemanticVersion => {
  const match = VERSION_PATTERN.exec(value);
  if (!match)
    simpleError(
      field,
      `"${value}" is not a valid semantic version (MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD] per semver.org).`,
      "invalid_semver",
    );
  return {
    build: (match![5] ?? "").split(".").filter(Boolean),
    major: Number(match![1]),
    minor: Number(match![2]),
    patch: Number(match![3]),
    prerelease: (match![4] ?? "")
      .split(".")
      .filter(Boolean)
      .map((identifier) =>
        /^\d+$/.test(identifier) ? Number(identifier) : identifier,
      ),
  };
};

/**
 * Precedence per semver.org rule 11: compare major, minor, patch
 * numerically; a version without prerelease outranks one with it;
 * prerelease identifiers compare pairwise (numeric numerically, then
 * ASCII lexically, numeric below alphanumeric, shorter prefix first).
 * Build metadata is ignored entirely.
 */
export const compareSemanticVersions = (
  left: SemanticVersion,
  right: SemanticVersion,
): number => {
  for (const part of ["major", "minor", "patch"] as const)
    if (left[part] !== right[part]) return Math.sign(left[part] - right[part]);
  if (left.prerelease.length === 0 && right.prerelease.length === 0) return 0;
  if (left.prerelease.length === 0) return 1;
  if (right.prerelease.length === 0) return -1;
  const shared = Math.min(left.prerelease.length, right.prerelease.length);
  for (let index = 0; index < shared; index += 1) {
    const a = left.prerelease[index]!;
    const b = right.prerelease[index]!;
    if (typeof a === "number" && typeof b === "number") {
      if (a !== b) return Math.sign(a - b);
    } else if (typeof a === "number") return -1;
    else if (typeof b === "number") return 1;
    else if (a !== b) return a < b ? -1 : 1;
  }
  return Math.sign(left.prerelease.length - right.prerelease.length);
};

export const calculateSemanticVersionCompare = (
  input: SemanticVersionCompareInput,
): SemanticVersionCompareOutput => ({
  comparison: Math.sign(
    compareSemanticVersions(
      parseSemanticVersion(input.versionA, "versionA"),
      parseSemanticVersion(input.versionB, "versionB"),
    ),
  ),
});

export const semanticVersionCompareExample = {
  input: { versionA: "1.0.0-alpha.1", versionB: "1.0.0-alpha.beta" },
  output: { comparison: -1 },
} satisfies ToolExample<
  SemanticVersionCompareInput,
  SemanticVersionCompareOutput
>;

export const semanticVersionCompareTool = createSimpleTool({
  id: "development/semantic-version-compare",
  title: "Semantic Version Comparator",
  description:
    "Compare two semantic versions exactly per semver.org precedence: numeric major.minor.patch, prerelease identifier rules, and build metadata ignored.",
  inputs: [
    {
      description: "First version, e.g. 1.2.3 or 2.0.0-rc.1+build.5.",
      id: "versionA",
      kind: "string",
      label: "Version A",
    },
    {
      description: "Second version to compare against.",
      id: "versionB",
      kind: "string",
      label: "Version B",
    },
  ],
  outputs: [
    {
      description: "-1 if A < B, 0 if equal precedence, 1 if A > B.",
      id: "comparison",
      kind: "integer",
      label: "Comparison",
    },
  ],
  calculate: (input) =>
    calculateSemanticVersionCompare({
      versionA: input.versionA as string,
      versionB: input.versionB as string,
    }),
});

export const runSemanticVersionCompare = semanticVersionCompareTool.execute;
export default semanticVersionCompareTool;
