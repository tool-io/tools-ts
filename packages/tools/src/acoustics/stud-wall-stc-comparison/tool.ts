import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { matchesToolJsonSchema } from "../../core/contract.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";

export type DoubleStudComparisonRatingBasis =
  "estimated" | "manufacturer-claim" | "tested";
export type DoubleStudComparisonTestMethod =
  "ASTM E90/E413" | "ISO 10140-2/ISO 717-1" | "manufacturer-method";

export type DoubleStudVsSingleStudDecouplingComparisonRow = Readonly<{
  readonly comparisonId: string;
  readonly doubleStudAssembly: string;
  readonly doubleStudStc: number;
  readonly framing: string;
  readonly ratingBasis: DoubleStudComparisonRatingBasis;
  readonly singleStudAssembly: string;
  readonly singleStudStc: number;
  readonly source: string;
  readonly testMethod: DoubleStudComparisonTestMethod;
  readonly testReference: string;
}>;

export type DoubleStudVsSingleStudDecouplingCompareLookupInput = Readonly<{
  readonly comparisons: readonly DoubleStudVsSingleStudDecouplingComparisonRow[];
  readonly queryComparisonId: string;
}>;

export type DoubleStudVsSingleStudDecouplingCompareLookupOutput = Readonly<{
  readonly caveat: string;
  readonly higherRatedConfiguration: "double-stud" | "single-stud" | "tie";
  readonly selectedComparison: DoubleStudVsSingleStudDecouplingComparisonRow;
  readonly stcDifferencePoints: number;
}>;

const rowSchema = {
  additionalProperties: false,
  properties: {
    comparisonId: { minLength: 1, type: "string" },
    doubleStudAssembly: { minLength: 1, type: "string" },
    doubleStudStc: { minimum: 0, type: "number" },
    framing: { minLength: 1, type: "string" },
    ratingBasis: {
      enum: ["estimated", "manufacturer-claim", "tested"],
      type: "string",
    },
    singleStudAssembly: { minLength: 1, type: "string" },
    singleStudStc: { minimum: 0, type: "number" },
    source: { minLength: 1, type: "string" },
    testMethod: {
      enum: ["ASTM E90/E413", "ISO 10140-2/ISO 717-1", "manufacturer-method"],
      type: "string",
    },
    testReference: { minLength: 1, type: "string" },
  },
  required: [
    "comparisonId",
    "doubleStudAssembly",
    "doubleStudStc",
    "framing",
    "ratingBasis",
    "singleStudAssembly",
    "singleStudStc",
    "source",
    "testMethod",
    "testReference",
  ],
  type: "object",
} satisfies ToolJsonSchema;

export const doubleStudVsSingleStudDecouplingCompareLookupInputSchema = {
  additionalProperties: false,
  properties: {
    comparisons: {
      items: rowSchema,
      maxItems: 200,
      minItems: 1,
      type: "array",
    },
    queryComparisonId: { minLength: 1, type: "string" },
  },
  required: ["comparisons", "queryComparisonId"],
  type: "object",
} satisfies ToolJsonSchema;

export const doubleStudVsSingleStudDecouplingCompareLookupOutputSchema = {
  additionalProperties: false,
  properties: {
    caveat: { type: "string" },
    higherRatedConfiguration: {
      enum: ["double-stud", "single-stud", "tie"],
      type: "string",
    },
    selectedComparison: rowSchema,
    stcDifferencePoints: { type: "number" },
  },
  required: [
    "caveat",
    "higherRatedConfiguration",
    "selectedComparison",
    "stcDifferencePoints",
  ],
  type: "object",
} satisfies ToolJsonSchema;

const caveat =
  "A double-stud or resiliently attached assembly is not automatically superior. Compare only caller-supplied rows with equivalent framing, mass, insulation, fasteners, test conditions, and rating method; laboratory STC does not predict field isolation without flanking and workmanship checks.";

const assertInput = (
  value: unknown,
): DoubleStudVsSingleStudDecouplingCompareLookupInput => {
  if (
    !matchesToolJsonSchema(
      value,
      doubleStudVsSingleStudDecouplingCompareLookupInputSchema,
    )
  )
    simpleError(
      "input",
      "Input does not match the stud comparison table schema.",
      "schema_invalid",
    );
  const input = value as DoubleStudVsSingleStudDecouplingCompareLookupInput;
  const ids = new Set<string>();
  for (const row of input.comparisons) {
    if (ids.has(row.comparisonId))
      simpleError(
        "comparisons",
        "Comparison identifiers must be unique.",
        "duplicate_comparison_id",
      );
    ids.add(row.comparisonId);
    if (
      !Number.isFinite(row.singleStudStc) ||
      !Number.isFinite(row.doubleStudStc)
    )
      simpleError(
        "comparisons",
        "Both STC values must be finite.",
        "invalid_rating",
      );
  }
  return input;
};

export const calculateDoubleStudVsSingleStudDecouplingCompareLookup = (
  input: DoubleStudVsSingleStudDecouplingCompareLookupInput,
): DoubleStudVsSingleStudDecouplingCompareLookupOutput => {
  const validated = assertInput(input);
  const selected =
    validated.comparisons.find(
      (row) => row.comparisonId === validated.queryComparisonId,
    ) ??
    simpleError(
      "queryComparisonId",
      "The requested comparison is not in the caller-supplied table.",
      "comparison_not_found",
    );
  const stcDifferencePoints = selected.doubleStudStc - selected.singleStudStc;
  return {
    caveat,
    higherRatedConfiguration:
      stcDifferencePoints > 0
        ? "double-stud"
        : stcDifferencePoints < 0
          ? "single-stud"
          : "tie",
    selectedComparison: selected,
    stcDifferencePoints,
  };
};

const execute = (
  input: unknown,
): ToolResult<DoubleStudVsSingleStudDecouplingCompareLookupOutput> => {
  try {
    return toolSuccess(
      calculateDoubleStudVsSingleStudDecouplingCompareLookup(
        assertInput(input),
      ),
    );
  } catch (error) {
    if (error instanceof SimpleToolError)
      return invalidInput([
        { code: error.code, field: error.field, message: error.message },
      ]);
    return invalidInput([
      {
        code: "calculation_failed",
        field: "",
        message: "The stud comparison lookup could not be completed.",
      },
    ]);
  }
};

export const example = {
  input: {
    comparisons: [
      {
        comparisonId: "published-examples",
        doubleStudAssembly:
          "CEMCO 2-1/2 in double steel-stud rows, 1 in separation, four layers total",
        doubleStudStc: 62,
        framing: "steel",
        ratingBasis: "tested",
        singleStudAssembly:
          "ClarkDietrich single steel-stud wall with RC-Deluxe on one side",
        singleStudStc: 54,
        source: "Independent laboratory reports supplied by the caller",
        testMethod: "ASTM E90/E413",
        testReference: "CEMCO NOAL-19-1045; ClarkDietrich TL18-302",
      },
    ],
    queryComparisonId: "published-examples",
  },
  output: {
    caveat,
    higherRatedConfiguration: "double-stud",
    selectedComparison: {
      comparisonId: "published-examples",
      doubleStudAssembly:
        "CEMCO 2-1/2 in double steel-stud rows, 1 in separation, four layers total",
      doubleStudStc: 62,
      framing: "steel",
      ratingBasis: "tested",
      singleStudAssembly:
        "ClarkDietrich single steel-stud wall with RC-Deluxe on one side",
      singleStudStc: 54,
      source: "Independent laboratory reports supplied by the caller",
      testMethod: "ASTM E90/E413",
      testReference: "CEMCO NOAL-19-1045; ClarkDietrich TL18-302",
    },
    stcDifferencePoints: 8,
  },
} satisfies ToolExample<
  DoubleStudVsSingleStudDecouplingCompareLookupInput,
  DoubleStudVsSingleStudDecouplingCompareLookupOutput
>;

export const doubleStudVsSingleStudDecouplingCompareLookupTool = defineTool<
  DoubleStudVsSingleStudDecouplingCompareLookupInput,
  DoubleStudVsSingleStudDecouplingCompareLookupOutput
>({
  contractVersion: 1,
  description:
    "Compare a caller-supplied single-stud and double-stud laboratory STC pair, return the signed point difference, and preserve each test reference without treating the result as a universal construction rule.",
  execute,
  execution: { kind: "pure" },
  id: "acoustics/stud-wall-stc-comparison",
  inputSchema: doubleStudVsSingleStudDecouplingCompareLookupInputSchema,
  outputSchema: doubleStudVsSingleStudDecouplingCompareLookupOutputSchema,
  ports: {
    inputs: [
      {
        id: "comparisons",
        label: "Stud comparison table",
        required: true,
        valueType: {
          format: "toolio.stud-comparison-row.v1",
          items: { type: "object" },
          type: "list",
        },
      },
      {
        id: "queryComparisonId",
        label: "Comparison identifier",
        required: true,
        valueType: { type: "string", format: "identifier" },
      },
    ],
    outputs: [
      {
        id: "higherRatedConfiguration",
        label: "Higher-rated configuration",
        valueType: { type: "string", format: "wall-configuration" },
      },
      {
        id: "stcDifferencePoints",
        label: "STC difference",
        valueType: { type: "number", format: "stc-difference", unit: "STC" },
      },
    ],
  },
  title: "Stud Wall STC Comparison",
});

export const runDoubleStudVsSingleStudDecouplingCompareLookup =
  doubleStudVsSingleStudDecouplingCompareLookupTool.execute;

export default doubleStudVsSingleStudDecouplingCompareLookupTool;
