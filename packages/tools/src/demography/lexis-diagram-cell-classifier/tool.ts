import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LexisDiagramCellClassifierInput = {
  readonly ageInterval?: readonly number[];
  readonly periodInterval?: readonly number[];
  readonly cohortInterval?: readonly number[];
};

export type LexisDiagramCellClassifierOutput = {
  readonly lexisClassCode: "AP" | "PC" | "LC";
  readonly className: string;
  readonly freeDimension: "cohort" | "age" | "period";
  readonly impliedFreeInterval: readonly number[];
  readonly freeSpanYears: number;
  readonly isDiagonalLine: boolean;
};

const parseInterval = (
  values: readonly number[] | undefined,
  field: string,
): [number, number] | undefined => {
  if (values === undefined || values.length === 0) return undefined;
  if (values.length !== 2)
    simpleError(
      field,
      "Each interval must hold exactly the two bounds.",
      "invalid_interval",
    );
  const lo = values[0]!;
  const hi = values[1]!;
  if (
    !(typeof lo === "number" && Number.isFinite(lo)) ||
    !(typeof hi === "number" && Number.isFinite(hi))
  )
    simpleError(
      field,
      "Interval bounds must be finite numbers.",
      "invalid_interval",
    );
  if (lo > hi)
    simpleError(
      field,
      "The lower bound must not exceed the upper bound.",
      "invalid_interval",
    );
  return [lo, hi];
};

/**
 * Lexis diagram relation: cohort = period - age. Fixing any two of the
 * three intervals determines the remaining one.
 */
export const calculateLexisDiagramCellClassifier = (
  input: LexisDiagramCellClassifierInput,
): LexisDiagramCellClassifierOutput => {
  const age = parseInterval(input.ageInterval, "ageInterval");
  const period = parseInterval(input.periodInterval, "periodInterval");
  const cohort = parseInterval(input.cohortInterval, "cohortInterval");
  const provided = [age, period, cohort].filter((entry) => entry !== undefined);
  if (provided.length !== 2)
    simpleError(
      "ageInterval",
      "Bound exactly two of age, period and cohort to classify a Lexis cell.",
      "invalid_interval",
    );
  if (age !== undefined && period !== undefined) {
    const impliedFreeInterval = [period[0] - age[1], period[1] - age[0]];
    return {
      lexisClassCode: "AP",
      className: "age-period cell",
      freeDimension: "cohort",
      impliedFreeInterval,
      freeSpanYears: impliedFreeInterval[1]! - impliedFreeInterval[0]!,
      isDiagonalLine: impliedFreeInterval[1] === impliedFreeInterval[0],
    };
  }
  if (period !== undefined && cohort !== undefined) {
    const impliedFreeInterval = [period[0] - cohort[1], period[1] - cohort[0]];
    return {
      lexisClassCode: "PC",
      className: "period-cohort cell",
      freeDimension: "age",
      impliedFreeInterval,
      freeSpanYears: impliedFreeInterval[1]! - impliedFreeInterval[0]!,
      isDiagonalLine: impliedFreeInterval[1] === impliedFreeInterval[0],
    };
  }
  const impliedFreeInterval = [age![0] + cohort![0], age![1] + cohort![1]];
  return {
    lexisClassCode: "LC",
    className: "cohort-age cell",
    freeDimension: "period",
    impliedFreeInterval,
    freeSpanYears: impliedFreeInterval[1]! - impliedFreeInterval[0]!,
    isDiagonalLine: impliedFreeInterval[1] === impliedFreeInterval[0],
  };
};

export const lexisDiagramCellClassifierExample = {
  input: { ageInterval: [60, 65], periodInterval: [2020, 2025] },
  output: {
    lexisClassCode: "AP",
    className: "age-period cell",
    freeDimension: "cohort",
    impliedFreeInterval: [1955, 1965],
    freeSpanYears: 10,
    isDiagonalLine: false,
  },
} satisfies ToolExample<
  LexisDiagramCellClassifierInput,
  LexisDiagramCellClassifierOutput
>;

export const lexisDiagramCellClassifierTool = createSimpleTool({
  id: "demography/lexis-diagram-cell-classifier",
  title: "Lexis Diagram Cell Classifier",
  description:
    "Classify a Lexis diagram cell from its two bounded dimensions using the relation cohort = period minus age, naming the class (age-period AP, period-cohort PC or cohort-age LC), the free dimension and the interval the free dimension sweeps.",
  inputs: [
    {
      default: [],
      description:
        "Age bounds; leave empty when age is not one of the bounded dimensions.",
      id: "ageInterval",
      kind: "numberList",
      label: "Age interval",
    },
    {
      default: [],
      description:
        "Calendar-period bounds; leave empty when period is unbounded.",
      id: "periodInterval",
      kind: "numberList",
      label: "Period interval",
    },
    {
      default: [],
      description: "Birth-cohort bounds; leave empty when cohort is unbounded.",
      id: "cohortInterval",
      kind: "numberList",
      label: "Cohort interval",
    },
  ],
  outputs: [
    {
      description: "Two-letter code of the Lexis class.",
      enum: ["AP", "PC", "LC"],
      id: "lexisClassCode",
      kind: "string",
      label: "Class",
    },
    {
      description: "Human-readable class name.",
      id: "className",
      kind: "string",
      label: "Class name",
    },
    {
      description: "Dimension left free by the two bounded ones.",
      enum: ["cohort", "age", "period"],
      id: "freeDimension",
      kind: "string",
      label: "Free dimension",
    },
    {
      description: "Lower and upper value swept by the free dimension.",
      id: "impliedFreeInterval",
      kind: "numberList",
      label: "Free interval",
    },
    {
      description:
        "Width of the interval swept by the free dimension in years.",
      id: "freeSpanYears",
      kind: "number",
      label: "Span",
    },
    {
      description:
        "True when the free span is zero, i.e. a single-cohort diagonal line.",
      id: "isDiagonalLine",
      kind: "boolean",
      label: "Diagonal",
    },
  ],
  calculate: (input) =>
    calculateLexisDiagramCellClassifier(
      input as unknown as LexisDiagramCellClassifierInput,
    ),
});

export const runLexisDiagramCellClassifier =
  lexisDiagramCellClassifierTool.execute;
export default lexisDiagramCellClassifierTool;
