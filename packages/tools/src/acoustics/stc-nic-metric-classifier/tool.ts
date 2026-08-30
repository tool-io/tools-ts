import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { matchesToolJsonSchema } from "../../core/contract.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";

export type StcNicTestMethod =
  "ASTM E336" | "ASTM E596" | "ASTM E90" | "ISO 10140-2" | "ISO 16283-1";
export type StcNicMetric =
  "ASTC" | "D_nT,w" | "FSTC" | "NIC" | "NNIC" | "Rw" | "STC";
export type StcNicEnvironment = "field" | "laboratory";

export type AstmE90LabStcVersusFieldNicRecord = Readonly<{
  readonly environment: StcNicEnvironment;
  readonly flankingPathsIncluded: boolean;
  readonly metric: StcNicMetric;
  readonly rating: number;
  readonly recordId: string;
  readonly source: string;
  readonly testMethod: StcNicTestMethod;
  readonly testReference: string;
}>;

export type AstmE90LabStcVersusFieldNicDistinctionLookupInput = Readonly<{
  readonly queryRecordId: string;
  readonly records: readonly AstmE90LabStcVersusFieldNicRecord[];
}>;

export type AstmE90LabStcVersusFieldNicDistinctionLookupOutput = Readonly<{
  readonly caveat: string;
  readonly classification:
    | "field-apparent-transmission"
    | "field-iso"
    | "field-reduced-flanking"
    | "field-room-isolation"
    | "laboratory-direct-transmission";
  readonly interpretation: string;
  readonly selectedRecord: AstmE90LabStcVersusFieldNicRecord;
}>;

const recordSchema = {
  additionalProperties: false,
  properties: {
    environment: { enum: ["field", "laboratory"], type: "string" },
    flankingPathsIncluded: { type: "boolean" },
    metric: {
      enum: ["ASTC", "D_nT,w", "FSTC", "NIC", "NNIC", "Rw", "STC"],
      type: "string",
    },
    rating: { minimum: 0, type: "number" },
    recordId: { minLength: 1, type: "string" },
    source: { minLength: 1, type: "string" },
    testMethod: {
      enum: [
        "ASTM E336",
        "ASTM E596",
        "ASTM E90",
        "ISO 10140-2",
        "ISO 16283-1",
      ],
      type: "string",
    },
    testReference: { minLength: 1, type: "string" },
  },
  required: [
    "environment",
    "flankingPathsIncluded",
    "metric",
    "rating",
    "recordId",
    "source",
    "testMethod",
    "testReference",
  ],
  type: "object",
} satisfies ToolJsonSchema;

export const astmE90LabStcVersusFieldNicDistinctionLookupInputSchema = {
  additionalProperties: false,
  properties: {
    queryRecordId: { minLength: 1, type: "string" },
    records: {
      items: recordSchema,
      maxItems: 200,
      minItems: 1,
      type: "array",
    },
  },
  required: ["queryRecordId", "records"],
  type: "object",
} satisfies ToolJsonSchema;

export const astmE90LabStcVersusFieldNicDistinctionLookupOutputSchema = {
  additionalProperties: false,
  properties: {
    caveat: { type: "string" },
    classification: {
      enum: [
        "field-apparent-transmission",
        "field-iso",
        "field-reduced-flanking",
        "field-room-isolation",
        "laboratory-direct-transmission",
      ],
      type: "string",
    },
    interpretation: { type: "string" },
    selectedRecord: recordSchema,
  },
  required: ["caveat", "classification", "interpretation", "selectedRecord"],
  type: "object",
} satisfies ToolJsonSchema;

const caveat =
  "STC, NIC, NNIC, ASTC, FSTC, Rw, and DnT,w are distinct metrics. ASTM E90 laboratory STC suppresses significant flanking paths and is not a field prediction; ASTM E336 field ratings include room and indirect-path effects according to the selected metric. Do not substitute one rating for another in a code or specification without the applicable test and reporting conditions.";

const interpretationFor = (
  record: AstmE90LabStcVersusFieldNicRecord,
): string => {
  if (record.testMethod === "ASTM E90")
    return "ASTM E90 with ASTM E413 produces a laboratory STC for the specimen under controlled direct-path conditions.";
  if (record.testMethod === "ASTM E596")
    return "ASTM E596 uses a laboratory enclosure procedure whose reported NIC is not a wall or floor assembly STC.";
  if (record.testMethod === "ISO 10140-2")
    return "ISO 10140-2 measures laboratory airborne sound insulation with flanking suppressed; the single-number rating is normally reported as Rw rather than STC.";
  if (record.metric === "ASTC")
    return "ASTM E336 ASTC is an apparent partition rating that includes direct and flanking transmission paths.";
  if (record.metric === "FSTC")
    return "ASTM E336 FSTC is a field rating obtained with stringent flanking controls and is not interchangeable with occupant room-isolation NIC.";
  if (record.metric === "NNIC")
    return "ASTM E336 NNIC normalizes the measured room isolation toward a standard furnished receiving-room condition.";
  if (record.metric === "NIC")
    return "ASTM E336 NIC describes measured sound isolation between rooms and is affected by flanking and receiving-room absorption.";
  return "ISO 16283-1 is a field airborne-sound measurement and its DnT,w rating is not an ASTM STC or NIC value.";
};

const assertInput = (
  value: unknown,
): AstmE90LabStcVersusFieldNicDistinctionLookupInput => {
  if (
    !matchesToolJsonSchema(
      value,
      astmE90LabStcVersusFieldNicDistinctionLookupInputSchema,
    )
  )
    simpleError(
      "input",
      "Input does not match the sound-rating record schema.",
      "schema_invalid",
    );
  const input = value as AstmE90LabStcVersusFieldNicDistinctionLookupInput;
  const ids = new Set<string>();
  for (const record of input.records) {
    if (ids.has(record.recordId))
      simpleError(
        "records",
        "Sound-rating record identifiers must be unique.",
        "duplicate_record_id",
      );
    ids.add(record.recordId);
    const valid =
      (record.testMethod === "ASTM E90" &&
        record.metric === "STC" &&
        record.environment === "laboratory" &&
        !record.flankingPathsIncluded) ||
      (record.testMethod === "ASTM E596" &&
        record.metric === "NIC" &&
        record.environment === "laboratory" &&
        !record.flankingPathsIncluded) ||
      (record.testMethod === "ISO 10140-2" &&
        record.metric === "Rw" &&
        record.environment === "laboratory" &&
        !record.flankingPathsIncluded) ||
      (record.testMethod === "ISO 16283-1" &&
        record.metric === "D_nT,w" &&
        record.environment === "field" &&
        record.flankingPathsIncluded) ||
      (record.testMethod === "ASTM E336" &&
        record.environment === "field" &&
        ((record.metric === "ASTC" && record.flankingPathsIncluded) ||
          (record.metric === "FSTC" && !record.flankingPathsIncluded) ||
          ((record.metric === "NIC" || record.metric === "NNIC") &&
            record.flankingPathsIncluded)));
    if (!valid)
      simpleError(
        "records",
        "The test method, metric, environment, and flanking flag do not identify a supported distinction.",
        "method_metric_mismatch",
      );
  }
  return input;
};

export const calculateAstmE90LabStcVersusFieldNicDistinctionLookup = (
  input: AstmE90LabStcVersusFieldNicDistinctionLookupInput,
): AstmE90LabStcVersusFieldNicDistinctionLookupOutput => {
  const validated = assertInput(input);
  const selectedRecord =
    validated.records.find(
      (record) => record.recordId === validated.queryRecordId,
    ) ??
    simpleError(
      "queryRecordId",
      "The requested sound-rating record is not in the caller-supplied table.",
      "record_not_found",
    );
  const classification =
    selectedRecord.testMethod === "ASTM E90" ||
    selectedRecord.testMethod === "ASTM E596" ||
    selectedRecord.testMethod === "ISO 10140-2"
      ? "laboratory-direct-transmission"
      : selectedRecord.metric === "ASTC"
        ? "field-apparent-transmission"
        : selectedRecord.metric === "FSTC"
          ? "field-reduced-flanking"
          : selectedRecord.metric === "NIC" || selectedRecord.metric === "NNIC"
            ? "field-room-isolation"
            : "field-iso";
  return {
    caveat,
    classification,
    interpretation: interpretationFor(selectedRecord),
    selectedRecord,
  };
};

const execute = (
  input: unknown,
): ToolResult<AstmE90LabStcVersusFieldNicDistinctionLookupOutput> => {
  try {
    return toolSuccess(
      calculateAstmE90LabStcVersusFieldNicDistinctionLookup(assertInput(input)),
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
        message:
          "The STC-versus-NIC distinction lookup could not be completed.",
      },
    ]);
  }
};

export const example = {
  input: {
    queryRecordId: "caller-lab-stc",
    records: [
      {
        environment: "laboratory",
        flankingPathsIncluded: false,
        metric: "STC",
        rating: 53,
        recordId: "caller-lab-stc",
        source: "Illustrative caller-supplied ASTM E90/E413 laboratory record",
        testMethod: "ASTM E90",
        testReference: "LAB-2026-001",
      },
      {
        environment: "field",
        flankingPathsIncluded: true,
        metric: "NIC",
        rating: 47,
        recordId: "caller-field-nic",
        source: "Illustrative caller-supplied ASTM E336/E413 field record",
        testMethod: "ASTM E336",
        testReference: "FIELD-2026-001",
      },
    ],
  },
  output: {
    caveat,
    classification: "laboratory-direct-transmission",
    interpretation:
      "ASTM E90 with ASTM E413 produces a laboratory STC for the specimen under controlled direct-path conditions.",
    selectedRecord: {
      environment: "laboratory",
      flankingPathsIncluded: false,
      metric: "STC",
      rating: 53,
      recordId: "caller-lab-stc",
      source: "Illustrative caller-supplied ASTM E90/E413 laboratory record",
      testMethod: "ASTM E90",
      testReference: "LAB-2026-001",
    },
  },
} satisfies ToolExample<
  AstmE90LabStcVersusFieldNicDistinctionLookupInput,
  AstmE90LabStcVersusFieldNicDistinctionLookupOutput
>;

export const astmE90LabStcVersusFieldNicDistinctionLookupTool = defineTool<
  AstmE90LabStcVersusFieldNicDistinctionLookupInput,
  AstmE90LabStcVersusFieldNicDistinctionLookupOutput
>({
  contractVersion: 1,
  description:
    "Classify a caller-supplied ASTM or ISO airborne-sound record as laboratory STC, field NIC, apparent ASTC, or the corresponding distinct rating without equating the metrics.",
  execute,
  execution: { kind: "pure" },
  id: "acoustics/stc-nic-metric-classifier",
  inputSchema: astmE90LabStcVersusFieldNicDistinctionLookupInputSchema,
  outputSchema: astmE90LabStcVersusFieldNicDistinctionLookupOutputSchema,
  ports: {
    inputs: [
      {
        id: "queryRecordId",
        label: "Sound-rating record identifier",
        required: true,
        valueType: { type: "string", format: "identifier" },
      },
      {
        id: "records",
        label: "Sound-rating records",
        required: true,
        valueType: {
          format: "toolio.sound-rating-record.v1",
          items: { type: "object" },
          type: "list",
        },
      },
    ],
    outputs: [
      {
        id: "classification",
        label: "Rating distinction",
        valueType: { type: "string", format: "sound-rating-classification" },
      },
      {
        id: "selectedRecord",
        label: "Selected sound-rating record",
        valueType: { format: "toolio.sound-rating-record.v1", type: "object" },
      },
    ],
  },
  title: "STC and NIC Metric Classifier",
});

export const runAstmE90LabStcVersusFieldNicDistinctionLookup =
  astmE90LabStcVersusFieldNicDistinctionLookupTool.execute;

export default astmE90LabStcVersusFieldNicDistinctionLookupTool;
