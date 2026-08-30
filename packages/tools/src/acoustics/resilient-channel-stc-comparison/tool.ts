import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { matchesToolJsonSchema } from "../../core/contract.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";

export type ResilientChannelRatingBasis =
  "estimated" | "manufacturer-claim" | "tested";
export type ResilientChannelTestMethod =
  "ASTM E90/E413" | "ISO 10140-2/ISO 717-1" | "manufacturer-method";

export type ResilientChannelStcImprovementRow = Readonly<{
  readonly baselineAssembly: string;
  readonly baselineStc: number;
  readonly benefitId: string;
  readonly channelProduct: string;
  readonly channelSpacingMillimeters: number;
  readonly installationCondition: string;
  readonly ratingBasis: ResilientChannelRatingBasis;
  readonly resilientChannelAssembly: string;
  readonly source: string;
  readonly testMethod: ResilientChannelTestMethod;
  readonly testReference: string;
  readonly withResilientChannelStc: number;
}>;

export type ResilientChannelStcImprovementBenefitLookupInput = Readonly<{
  readonly benefits: readonly ResilientChannelStcImprovementRow[];
  readonly queryBenefitId: string;
}>;

export type ResilientChannelStcImprovementBenefitLookupOutput = Readonly<{
  readonly benefitClassification: "does-not-improve" | "improves" | "tie";
  readonly caveat: string;
  readonly selectedBenefit: ResilientChannelStcImprovementRow;
  readonly stcImprovementPoints: number;
}>;

const rowSchema = {
  additionalProperties: false,
  properties: {
    baselineAssembly: { minLength: 1, type: "string" },
    baselineStc: { minimum: 0, type: "number" },
    benefitId: { minLength: 1, type: "string" },
    channelProduct: { minLength: 1, type: "string" },
    channelSpacingMillimeters: { exclusiveMinimum: 0, type: "number" },
    installationCondition: { minLength: 1, type: "string" },
    ratingBasis: {
      enum: ["estimated", "manufacturer-claim", "tested"],
      type: "string",
    },
    resilientChannelAssembly: { minLength: 1, type: "string" },
    source: { minLength: 1, type: "string" },
    testMethod: {
      enum: ["ASTM E90/E413", "ISO 10140-2/ISO 717-1", "manufacturer-method"],
      type: "string",
    },
    testReference: { minLength: 1, type: "string" },
    withResilientChannelStc: { minimum: 0, type: "number" },
  },
  required: [
    "baselineAssembly",
    "baselineStc",
    "benefitId",
    "channelProduct",
    "channelSpacingMillimeters",
    "installationCondition",
    "ratingBasis",
    "resilientChannelAssembly",
    "source",
    "testMethod",
    "testReference",
    "withResilientChannelStc",
  ],
  type: "object",
} satisfies ToolJsonSchema;

export const resilientChannelStcImprovementBenefitLookupInputSchema = {
  additionalProperties: false,
  properties: {
    benefits: {
      items: rowSchema,
      maxItems: 200,
      minItems: 1,
      type: "array",
    },
    queryBenefitId: { minLength: 1, type: "string" },
  },
  required: ["benefits", "queryBenefitId"],
  type: "object",
} satisfies ToolJsonSchema;

export const resilientChannelStcImprovementBenefitLookupOutputSchema = {
  additionalProperties: false,
  properties: {
    benefitClassification: {
      enum: ["does-not-improve", "improves", "tie"],
      type: "string",
    },
    caveat: { type: "string" },
    selectedBenefit: rowSchema,
    stcImprovementPoints: { type: "number" },
  },
  required: [
    "benefitClassification",
    "caveat",
    "selectedBenefit",
    "stcImprovementPoints",
  ],
  type: "object",
} satisfies ToolJsonSchema;

const caveat =
  "A resilient channel can improve laboratory transmission loss by decoupling the board, but the benefit depends on channel design, orientation, spacing, fastening, board mass, cavity insulation, perimeter sealing, and flanking. Do not subtract or add the returned points to another assembly without matched test evidence.";

const assertInput = (
  value: unknown,
): ResilientChannelStcImprovementBenefitLookupInput => {
  if (
    !matchesToolJsonSchema(
      value,
      resilientChannelStcImprovementBenefitLookupInputSchema,
    )
  )
    simpleError(
      "input",
      "Input does not match the resilient-channel benefit table schema.",
      "schema_invalid",
    );
  const input = value as ResilientChannelStcImprovementBenefitLookupInput;
  const ids = new Set<string>();
  for (const row of input.benefits) {
    if (ids.has(row.benefitId))
      simpleError(
        "benefits",
        "Benefit identifiers must be unique.",
        "duplicate_benefit_id",
      );
    ids.add(row.benefitId);
    if (
      !Number.isFinite(row.baselineStc) ||
      !Number.isFinite(row.withResilientChannelStc)
    )
      simpleError(
        "benefits",
        "Both STC values must be finite.",
        "invalid_rating",
      );
  }
  return input;
};

export const calculateResilientChannelStcImprovementBenefitLookup = (
  input: ResilientChannelStcImprovementBenefitLookupInput,
): ResilientChannelStcImprovementBenefitLookupOutput => {
  const validated = assertInput(input);
  const selectedBenefit =
    validated.benefits.find(
      (row) => row.benefitId === validated.queryBenefitId,
    ) ??
    simpleError(
      "queryBenefitId",
      "The requested benefit is not in the caller-supplied table.",
      "benefit_not_found",
    );
  const stcImprovementPoints =
    selectedBenefit.withResilientChannelStc - selectedBenefit.baselineStc;
  return {
    benefitClassification:
      stcImprovementPoints > 0
        ? "improves"
        : stcImprovementPoints < 0
          ? "does-not-improve"
          : "tie",
    caveat,
    selectedBenefit,
    stcImprovementPoints,
  };
};

const execute = (
  input: unknown,
): ToolResult<ResilientChannelStcImprovementBenefitLookupOutput> => {
  try {
    return toolSuccess(
      calculateResilientChannelStcImprovementBenefitLookup(assertInput(input)),
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
        message: "The resilient-channel benefit lookup could not be completed.",
      },
    ]);
  }
};

export const example = {
  input: {
    benefits: [
      {
        baselineAssembly:
          "Single-layer steel-stud wall attached directly to framing with cavity insulation",
        baselineStc: 40,
        benefitId: "usg-steel-single-layer",
        channelProduct: "Resilient channel or equivalent",
        channelSpacingMillimeters: 610,
        installationCondition:
          "Single layer on each side; published summary, not a matched universal control",
        ratingBasis: "manufacturer-claim",
        resilientChannelAssembly:
          "Single-layer steel-stud wall with board attached through resilient channel",
        source: "USG Acoustical Assemblies SA200",
        testMethod: "ASTM E90/E413",
        testReference:
          "USG steel direct versus steel/resilient-channel summary",
        withResilientChannelStc: 56,
      },
    ],
    queryBenefitId: "usg-steel-single-layer",
  },
  output: {
    benefitClassification: "improves",
    caveat,
    selectedBenefit: {
      baselineAssembly:
        "Single-layer steel-stud wall attached directly to framing with cavity insulation",
      baselineStc: 40,
      benefitId: "usg-steel-single-layer",
      channelProduct: "Resilient channel or equivalent",
      channelSpacingMillimeters: 610,
      installationCondition:
        "Single layer on each side; published summary, not a matched universal control",
      ratingBasis: "manufacturer-claim",
      resilientChannelAssembly:
        "Single-layer steel-stud wall with board attached through resilient channel",
      source: "USG Acoustical Assemblies SA200",
      testMethod: "ASTM E90/E413",
      testReference: "USG steel direct versus steel/resilient-channel summary",
      withResilientChannelStc: 56,
    },
    stcImprovementPoints: 16,
  },
} satisfies ToolExample<
  ResilientChannelStcImprovementBenefitLookupInput,
  ResilientChannelStcImprovementBenefitLookupOutput
>;

export const resilientChannelStcImprovementBenefitLookupTool = defineTool<
  ResilientChannelStcImprovementBenefitLookupInput,
  ResilientChannelStcImprovementBenefitLookupOutput
>({
  contractVersion: 1,
  description:
    "Look up the caller-supplied STC change from direct board attachment to a specified resilient-channel assembly, preserving channel, spacing, test, and manufacturer caveats.",
  execute,
  execution: { kind: "pure" },
  id: "acoustics/resilient-channel-stc-comparison",
  inputSchema: resilientChannelStcImprovementBenefitLookupInputSchema,
  outputSchema: resilientChannelStcImprovementBenefitLookupOutputSchema,
  ports: {
    inputs: [
      {
        id: "benefits",
        label: "Resilient-channel benefit table",
        required: true,
        valueType: {
          format: "toolio.resilient-channel-benefit-row.v1",
          items: { type: "object" },
          type: "list",
        },
      },
      {
        id: "queryBenefitId",
        label: "Benefit identifier",
        required: true,
        valueType: { type: "string", format: "identifier" },
      },
    ],
    outputs: [
      {
        id: "benefitClassification",
        label: "Benefit classification",
        valueType: { type: "string", format: "acoustic-benefit" },
      },
      {
        id: "stcImprovementPoints",
        label: "STC improvement",
        valueType: { type: "number", format: "stc-difference", unit: "STC" },
      },
    ],
  },
  title: "Resilient Channel STC Comparison",
});

export const runResilientChannelStcImprovementBenefitLookup =
  resilientChannelStcImprovementBenefitLookupTool.execute;

export default resilientChannelStcImprovementBenefitLookupTool;
