import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import {
  compareSemanticVersions,
  parseSemanticVersion,
  type SemanticVersion,
} from "../semantic-version-compare/tool.js";

export type SemanticVersionRangeInput = {
  readonly range: string;
  readonly version: string;
};

export type SemanticVersionRangeOutput = {
  readonly comparatorCount: number;
  readonly satisfied: boolean;
};

type Comparator = {
  readonly operator: "=" | "<" | "<=" | ">" | ">=";
  readonly bound: SemanticVersion;
};

const satisfiesComparator = (
  candidate: SemanticVersion,
  comparator: Comparator,
): boolean => {
  const order = compareSemanticVersions(candidate, comparator.bound);
  switch (comparator.operator) {
    case "=":
      return order === 0;
    case "<":
      return order < 0;
    case "<=":
      return order <= 0;
    case ">":
      return order > 0;
    case ">=":
      return order >= 0;
  }
};

/**
 * Range grammar (AND of whitespace-separated comparators), where each
 * comparator is an operator immediately followed by a strict semver:
 *   =V exact precedence; <V <=V >V >=V usual bounds;
 *   ^V compatible-with: major > 0 allows <(major+1).0.0, otherwise
 *      minor > 0 allows <0.(minor+1).0, otherwise <0.0.(patch+1);
 *   ~V tilde: allows <(minor+1).0.0, except 0.0.x allows <0.0.(patch+1).
 * A bare version is treated as "=V". Build metadata is ignored.
 */
export const calculateSemanticVersionRange = (
  input: SemanticVersionRangeInput,
): SemanticVersionRangeOutput => {
  const tokens = input.range.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0)
    simpleError("range", "Provide at least one comparator.", "invalid_range");
  const comparators: Comparator[] = [];
  for (const token of tokens) {
    const match = /^(>=|<=|>|<|=|\^|~)?(.+)$/.exec(token);
    const operator = match![1] ?? "=";
    const bound = parseSemanticVersion(match![2], "range");
    if (operator === "^" || operator === "~") {
      comparators.push({ bound, operator: ">=" });
      let upper: string;
      if (operator === "^") {
        if (bound.major > 0) upper = `${bound.major + 1}.0.0`;
        else if (bound.minor > 0) upper = `0.${bound.minor + 1}.0`;
        else upper = `0.0.${bound.patch + 1}`;
      } else
        upper =
          bound.major === 0 && bound.minor === 0
            ? `0.0.${bound.patch + 1}`
            : `${bound.major}.${bound.minor + 1}.0`;
      comparators.push({
        bound: parseSemanticVersion(upper, "range"),
        operator: "<",
      });
    } else
      comparators.push({ bound, operator: operator as Comparator["operator"] });
  }
  const candidate = parseSemanticVersion(input.version, "version");
  return {
    comparatorCount: comparators.length,
    satisfied: comparators.every((comparator) =>
      satisfiesComparator(candidate, comparator),
    ),
  };
};

export const semanticVersionRangeExample = {
  input: { range: "^1.2.0", version: "1.2.5" },
  output: { comparatorCount: 2, satisfied: true },
} satisfies ToolExample<SemanticVersionRangeInput, SemanticVersionRangeOutput>;

export const semanticVersionRangeTool = createSimpleTool({
  id: "development/semantic-version-range",
  title: "Semantic Version Range Checker",
  description:
    "Check a semantic version against a whitespace-joined AND set of comparators (=, <, <=, >, >= plus caret ^ and tilde ~ shorthands with npm-style bump rules); build metadata is ignored.",
  inputs: [
    {
      description: 'Whitespace-separated comparators, e.g. "^1.2.0 <2.0.0".',
      id: "range",
      kind: "string",
      label: "Range",
    },
    {
      description: "Version to test against the range.",
      id: "version",
      kind: "string",
      label: "Version",
    },
  ],
  outputs: [
    {
      description: "True when the version satisfies every comparator.",
      id: "satisfied",
      kind: "boolean",
      label: "Satisfied",
    },
    {
      description: "Number of primitive comparators after expanding ^ and ~.",
      id: "comparatorCount",
      kind: "integer",
      label: "Comparator count",
    },
  ],
  calculate: (input) =>
    calculateSemanticVersionRange({
      range: input.range as string,
      version: input.version as string,
    }),
});

export const runSemanticVersionRange = semanticVersionRangeTool.execute;
export default semanticVersionRangeTool;
