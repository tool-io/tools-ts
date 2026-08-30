import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { matchesToolJsonSchema } from "../../core/contract.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";

export type FlankingJunctionType =
  "ceiling-wall" | "floor-wall" | "other" | "wall-wall";
export type FlankingJunctionMetric =
  "IIC" | "STC" | "other" | "transmission-loss";
export type FlankingJunctionRatingBasis =
  "estimated" | "manufacturer-claim" | "not-rated" | "tested";
export type FlankingJunctionTestMethod =
  | "ASTM E336"
  | "ISO 10848"
  | "ISO 15712-1"
  | "field-test"
  | "manufacturer-method";

export type FlankingPathJunctionDetailCorrectionRow = Readonly<{
  readonly apparentRating: number | null;
  readonly detailDescription: string;
  readonly detailId: string;
  readonly directRating: number | null;
  readonly documentedCorrectionDb: number | null;
  readonly junctionType: FlankingJunctionType;
  readonly metric: FlankingJunctionMetric;
  readonly ratingBasis: FlankingJunctionRatingBasis;
  readonly source: string;
  readonly testMethod: FlankingJunctionTestMethod;
  readonly testReference: string;
}>;

export type FlankingPathJunctionDetailCorrectionLookupInput = Readonly<{
  readonly details: readonly FlankingPathJunctionDetailCorrectionRow[];
  readonly queryDetailId: string;
}>;

export type FlankingPathJunctionDetailCorrectionLookupOutput = Readonly<{
  readonly calculation: "difference-of-reported-ratings" | "lookup-only";
  readonly caveat: string;
  readonly ratingDifferenceDecibels: number | null;
  readonly selectedDetail: FlankingPathJunctionDetailCorrectionRow;
}>;

const nullableNumberSchema = {
  anyOf: [{ type: "number" }, { type: "null" }],
} satisfies ToolJsonSchema;

const rowSchema = {
  additionalProperties: false,
  properties: {
    apparentRating: nullableNumberSchema,
    detailDescription: { minLength: 1, type: "string" },
    detailId: { minLength: 1, type: "string" },
    directRating: nullableNumberSchema,
    documentedCorrectionDb: nullableNumberSchema,
    junctionType: {
      enum: ["ceiling-wall", "floor-wall", "other", "wall-wall"],
      type: "string",
    },
    metric: {
      enum: ["IIC", "STC", "other", "transmission-loss"],
      type: "string",
    },
    ratingBasis: {
      enum: ["estimated", "manufacturer-claim", "not-rated", "tested"],
      type: "string",
    },
    source: { minLength: 1, type: "string" },
    testMethod: {
      enum: [
        "ASTM E336",
        "ISO 10848",
        "ISO 15712-1",
        "field-test",
        "manufacturer-method",
      ],
      type: "string",
    },
    testReference: { minLength: 1, type: "string" },
  },
  required: [
    "apparentRating",
    "detailDescription",
    "detailId",
    "directRating",
    "documentedCorrectionDb",
    "junctionType",
    "metric",
    "ratingBasis",
    "source",
    "testMethod",
    "testReference",
  ],
  type: "object",
} satisfies ToolJsonSchema;

export const flankingPathJunctionDetailCorrectionLookupInputSchema = {
  additionalProperties: false,
  properties: {
    details: {
      items: rowSchema,
      maxItems: 200,
      minItems: 1,
      type: "array",
    },
    queryDetailId: { minLength: 1, type: "string" },
  },
  required: ["details", "queryDetailId"],
  type: "object",
} satisfies ToolJsonSchema;

export const flankingPathJunctionDetailCorrectionLookupOutputSchema = {
  additionalProperties: false,
  properties: {
    calculation: {
      enum: ["difference-of-reported-ratings", "lookup-only"],
      type: "string",
    },
    caveat: { type: "string" },
    ratingDifferenceDecibels: nullableNumberSchema,
    selectedDetail: rowSchema,
  },
  required: [
    "calculation",
    "caveat",
    "ratingDifferenceDecibels",
    "selectedDetail",
  ],
  type: "object",
} satisfies ToolJsonSchema;

const caveat =
  "Junction corrections are construction- and path-specific. ASTM E90 laboratory STC suppresses significant flanking paths, while ASTM E336 field metrics include measured indirect paths; ISO 10848 and ISO 15712-1 address different flanking problems. The tool reports only caller-supplied evidence and does not invent a universal correction.";

const assertInput = (
  value: unknown,
): FlankingPathJunctionDetailCorrectionLookupInput => {
  if (
    !matchesToolJsonSchema(
      value,
      flankingPathJunctionDetailCorrectionLookupInputSchema,
    )
  )
    simpleError(
      "input",
      "Input does not match the flanking junction lookup schema.",
      "schema_invalid",
    );
  const input = value as FlankingPathJunctionDetailCorrectionLookupInput;
  const ids = new Set<string>();
  for (const row of input.details) {
    if (ids.has(row.detailId))
      simpleError(
        "details",
        "Junction detail identifiers must be unique.",
        "duplicate_detail_id",
      );
    ids.add(row.detailId);
    for (const value of [
      row.apparentRating,
      row.directRating,
      row.documentedCorrectionDb,
    ]) {
      if (value !== null && !Number.isFinite(value))
        simpleError(
          "details",
          "Junction ratings and corrections must be finite or null.",
          "invalid_detail_value",
        );
    }
  }
  return input;
};

export const calculateFlankingPathJunctionDetailCorrectionLookup = (
  input: FlankingPathJunctionDetailCorrectionLookupInput,
): FlankingPathJunctionDetailCorrectionLookupOutput => {
  const validated = assertInput(input);
  const selectedDetail =
    validated.details.find(
      (row) => row.detailId === validated.queryDetailId,
    ) ??
    simpleError(
      "queryDetailId",
      "The requested junction detail is not in the caller-supplied table.",
      "detail_not_found",
    );
  const ratingDifferenceDecibels =
    selectedDetail.directRating === null ||
    selectedDetail.apparentRating === null
      ? null
      : selectedDetail.directRating - selectedDetail.apparentRating;
  return {
    calculation:
      ratingDifferenceDecibels === null
        ? "lookup-only"
        : "difference-of-reported-ratings",
    caveat,
    ratingDifferenceDecibels,
    selectedDetail,
  };
};

const execute = (
  input: unknown,
): ToolResult<FlankingPathJunctionDetailCorrectionLookupOutput> => {
  try {
    return toolSuccess(
      calculateFlankingPathJunctionDetailCorrectionLookup(assertInput(input)),
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
        message: "The flanking junction lookup could not be completed.",
      },
    ]);
  }
};

export const example = {
  input: {
    details: [
      {
        apparentRating: null,
        detailDescription:
          "Continuous floor and wall junction with perimeter sealing and no documented universal rating",
        detailId: "nrc-sealed-junction-example",
        directRating: null,
        documentedCorrectionDb: null,
        junctionType: "floor-wall",
        metric: "STC",
        ratingBasis: "not-rated",
        source:
          "National Research Council Canada RR-331 and USG flanking guidance",
        testMethod: "ISO 10848",
        testReference: "Caller-selected detail; no rating supplied",
      },
    ],
    queryDetailId: "nrc-sealed-junction-example",
  },
  output: {
    calculation: "lookup-only",
    caveat,
    ratingDifferenceDecibels: null,
    selectedDetail: {
      apparentRating: null,
      detailDescription:
        "Continuous floor and wall junction with perimeter sealing and no documented universal rating",
      detailId: "nrc-sealed-junction-example",
      directRating: null,
      documentedCorrectionDb: null,
      junctionType: "floor-wall",
      metric: "STC",
      ratingBasis: "not-rated",
      source:
        "National Research Council Canada RR-331 and USG flanking guidance",
      testMethod: "ISO 10848",
      testReference: "Caller-selected detail; no rating supplied",
    },
  },
} satisfies ToolExample<
  FlankingPathJunctionDetailCorrectionLookupInput,
  FlankingPathJunctionDetailCorrectionLookupOutput
>;

export const flankingPathJunctionDetailCorrectionLookupTool = defineTool<
  FlankingPathJunctionDetailCorrectionLookupInput,
  FlankingPathJunctionDetailCorrectionLookupOutput
>({
  contractVersion: 1,
  description:
    "Look up a caller-supplied wall, floor, or ceiling junction detail, report its documented ratings and any direct-versus-apparent difference, and avoid universal flanking corrections.",
  execute,
  execution: { kind: "pure" },
  id: "acoustics/flanking-junction-record-lookup",
  inputSchema: flankingPathJunctionDetailCorrectionLookupInputSchema,
  outputSchema: flankingPathJunctionDetailCorrectionLookupOutputSchema,
  ports: {
    inputs: [
      {
        id: "details",
        label: "Junction detail table",
        required: true,
        valueType: {
          format: "toolio.flanking-junction-row.v1",
          items: { type: "object" },
          type: "list",
        },
      },
      {
        id: "queryDetailId",
        label: "Junction detail identifier",
        required: true,
        valueType: { type: "string", format: "identifier" },
      },
    ],
    outputs: [
      {
        id: "ratingDifferenceDecibels",
        label: "Reported rating difference",
        valueType: { type: "number", format: "rating-difference", unit: "dB" },
      },
      {
        id: "selectedDetail",
        label: "Selected junction detail",
        valueType: {
          format: "toolio.flanking-junction-row.v1",
          type: "object",
        },
      },
    ],
  },
  title: "Flanking Junction Record Lookup",
});

export const runFlankingPathJunctionDetailCorrectionLookup =
  flankingPathJunctionDetailCorrectionLookupTool.execute;

export default flankingPathJunctionDetailCorrectionLookupTool;
