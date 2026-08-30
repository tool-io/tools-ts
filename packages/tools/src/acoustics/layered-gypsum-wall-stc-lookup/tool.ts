import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { matchesToolJsonSchema } from "../../core/contract.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";

export type StcWallAssemblyFraming = "other" | "steel" | "wood";
export type StcWallAssemblyRatingBasis =
  "estimated" | "manufacturer-claim" | "tested";
export type StcWallAssemblyTestMethod =
  "ASTM E90/E413" | "ISO 10140-2/ISO 717-1" | "manufacturer-method";

export type StcWallAssemblyLayeredGypsumRow = Readonly<{
  readonly assemblyId: string;
  readonly cavityInsulation: string;
  readonly decoupling: string;
  readonly framing: StcWallAssemblyFraming;
  readonly gypsumLayersPerSide: number;
  readonly gypsumThicknessMillimeters: number;
  readonly ratingBasis: StcWallAssemblyRatingBasis;
  readonly reportedStc: number;
  readonly source: string;
  readonly testMethod: StcWallAssemblyTestMethod;
  readonly testReference: string;
}>;

export type StcWallAssemblyLayeredGypsumQuery = Readonly<{
  readonly assemblyId?: string;
  readonly framing?: StcWallAssemblyFraming;
  readonly minimumStc?: number;
}>;

export type StcWallAssemblyLayeredGypsumConfigurationsTableInput = Readonly<{
  readonly assemblies: readonly StcWallAssemblyLayeredGypsumRow[];
  readonly query: StcWallAssemblyLayeredGypsumQuery;
}>;

export type StcWallAssemblyLayeredGypsumConfigurationsTableOutput = Readonly<{
  readonly caveat: string;
  readonly matchedAssemblyIds: readonly string[];
  readonly selectedAssembly: StcWallAssemblyLayeredGypsumRow;
}>;

const rowSchema = {
  additionalProperties: false,
  properties: {
    assemblyId: { minLength: 1, type: "string" },
    cavityInsulation: { minLength: 1, type: "string" },
    decoupling: { minLength: 1, type: "string" },
    framing: { enum: ["other", "steel", "wood"], type: "string" },
    gypsumLayersPerSide: { minimum: 1, type: "integer" },
    gypsumThicknessMillimeters: { exclusiveMinimum: 0, type: "number" },
    ratingBasis: {
      enum: ["estimated", "manufacturer-claim", "tested"],
      type: "string",
    },
    reportedStc: { minimum: 0, type: "number" },
    source: { minLength: 1, type: "string" },
    testMethod: {
      enum: ["ASTM E90/E413", "ISO 10140-2/ISO 717-1", "manufacturer-method"],
      type: "string",
    },
    testReference: { minLength: 1, type: "string" },
  },
  required: [
    "assemblyId",
    "cavityInsulation",
    "decoupling",
    "framing",
    "gypsumLayersPerSide",
    "gypsumThicknessMillimeters",
    "ratingBasis",
    "reportedStc",
    "source",
    "testMethod",
    "testReference",
  ],
  type: "object",
} satisfies ToolJsonSchema;

const querySchema = {
  additionalProperties: false,
  properties: {
    assemblyId: { minLength: 1, type: "string" },
    framing: { enum: ["other", "steel", "wood"], type: "string" },
    minimumStc: { minimum: 0, type: "number" },
  },
  type: "object",
} satisfies ToolJsonSchema;

export const stcWallAssemblyLayeredGypsumConfigurationsTableInputSchema = {
  additionalProperties: false,
  properties: {
    assemblies: {
      items: rowSchema,
      maxItems: 500,
      minItems: 1,
      type: "array",
    },
    query: querySchema,
  },
  required: ["assemblies", "query"],
  type: "object",
} satisfies ToolJsonSchema;

export const stcWallAssemblyLayeredGypsumConfigurationsTableOutputSchema = {
  additionalProperties: false,
  properties: {
    caveat: { type: "string" },
    matchedAssemblyIds: {
      items: { minLength: 1, type: "string" },
      maxItems: 500,
      type: "array",
    },
    selectedAssembly: rowSchema,
  },
  required: ["caveat", "matchedAssemblyIds", "selectedAssembly"],
  type: "object",
} satisfies ToolJsonSchema;

const caveat =
  "STC is a laboratory single-number rating derived from a specified test method, not a guaranteed field result. Preserve the exact tested construction, test reference, rating basis, and source; flanking, leakage, substitutions, and workmanship can change installed performance.";

const assertInput = (
  value: unknown,
): StcWallAssemblyLayeredGypsumConfigurationsTableInput => {
  if (
    !matchesToolJsonSchema(
      value,
      stcWallAssemblyLayeredGypsumConfigurationsTableInputSchema,
    )
  )
    simpleError(
      "input",
      "Input does not match the STC assembly table schema.",
      "schema_invalid",
    );
  const input = value as StcWallAssemblyLayeredGypsumConfigurationsTableInput;
  const ids = new Set<string>();
  for (const row of input.assemblies) {
    if (ids.has(row.assemblyId))
      simpleError(
        "assemblies",
        "Assembly identifiers must be unique.",
        "duplicate_assembly_id",
      );
    ids.add(row.assemblyId);
    if (!Number.isSafeInteger(row.gypsumLayersPerSide))
      simpleError(
        "assemblies",
        "Gypsum layer counts must be safe integers.",
        "invalid_layer_count",
      );
  }
  return input;
};

const selectRows = (
  input: StcWallAssemblyLayeredGypsumConfigurationsTableInput,
): readonly StcWallAssemblyLayeredGypsumRow[] => {
  const filtered = input.assemblies.filter(
    (row) =>
      (input.query.assemblyId === undefined ||
        row.assemblyId === input.query.assemblyId) &&
      (input.query.framing === undefined ||
        row.framing === input.query.framing) &&
      (input.query.minimumStc === undefined ||
        row.reportedStc >= input.query.minimumStc),
  );
  if (filtered.length === 0)
    simpleError(
      "query",
      "No assembly matches the caller-supplied filters.",
      "no_matching_assembly",
    );
  return [...filtered].sort(
    (left, right) =>
      right.reportedStc - left.reportedStc ||
      left.assemblyId.localeCompare(right.assemblyId, "en-US"),
  );
};

export const calculateStcWallAssemblyLayeredGypsumConfigurationsTable = (
  input: StcWallAssemblyLayeredGypsumConfigurationsTableInput,
): StcWallAssemblyLayeredGypsumConfigurationsTableOutput => {
  const validated = assertInput(input);
  const matches = selectRows(validated);
  const selectedAssembly = matches[0];
  if (selectedAssembly === undefined)
    simpleError(
      "assemblies",
      "No wall assembly matches the supplied filters.",
      "no_matching_assembly",
    );
  return {
    caveat,
    matchedAssemblyIds: matches.map((row) => row.assemblyId),
    selectedAssembly,
  };
};

const execute = (
  input: unknown,
): ToolResult<StcWallAssemblyLayeredGypsumConfigurationsTableOutput> => {
  try {
    return toolSuccess(
      calculateStcWallAssemblyLayeredGypsumConfigurationsTable(
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
        message: "The STC assembly lookup could not be completed.",
      },
    ]);
  }
};

export const example = {
  input: {
    assemblies: [
      {
        assemblyId: "usg-steel-resilient-single",
        cavityInsulation: "3 in sound attenuation fire blanket",
        decoupling: "RC-1 or equivalent resilient channel, 24 in o.c.",
        framing: "steel",
        gypsumLayersPerSide: 1,
        gypsumThicknessMillimeters: 15.9,
        ratingBasis: "manufacturer-claim",
        reportedStc: 56,
        source: "USG Acoustical Assemblies SA200",
        testMethod: "ASTM E90/E413",
        testReference: "USG steel/resilient-channel summary",
      },
      {
        assemblyId: "usg-steel-resilient-double",
        cavityInsulation: "3 in sound attenuation fire blanket",
        decoupling: "RC-1 or equivalent resilient channel, 24 in o.c.",
        framing: "steel",
        gypsumLayersPerSide: 2,
        gypsumThicknessMillimeters: 31.8,
        ratingBasis: "manufacturer-claim",
        reportedStc: 63,
        source: "USG Acoustical Assemblies SA200",
        testMethod: "ASTM E90/E413",
        testReference: "USG steel/resilient-channel double-layer summary",
      },
    ],
    query: { framing: "steel", minimumStc: 60 },
  },
  output: {
    caveat,
    matchedAssemblyIds: ["usg-steel-resilient-double"],
    selectedAssembly: {
      assemblyId: "usg-steel-resilient-double",
      cavityInsulation: "3 in sound attenuation fire blanket",
      decoupling: "RC-1 or equivalent resilient channel, 24 in o.c.",
      framing: "steel",
      gypsumLayersPerSide: 2,
      gypsumThicknessMillimeters: 31.8,
      ratingBasis: "manufacturer-claim",
      reportedStc: 63,
      source: "USG Acoustical Assemblies SA200",
      testMethod: "ASTM E90/E413",
      testReference: "USG steel/resilient-channel double-layer summary",
    },
  },
} satisfies ToolExample<
  StcWallAssemblyLayeredGypsumConfigurationsTableInput,
  StcWallAssemblyLayeredGypsumConfigurationsTableOutput
>;

export const stcWallAssemblyLayeredGypsumConfigurationsTableTool = defineTool<
  StcWallAssemblyLayeredGypsumConfigurationsTableInput,
  StcWallAssemblyLayeredGypsumConfigurationsTableOutput
>({
  contractVersion: 1,
  description:
    "Select the highest-rated caller-supplied layered gypsum wall assembly matching framing, identifier, and minimum-STC filters while preserving laboratory, manufacturer, and test-report provenance.",
  execute,
  execution: { kind: "pure" },
  id: "acoustics/layered-gypsum-wall-stc-lookup",
  inputSchema: stcWallAssemblyLayeredGypsumConfigurationsTableInputSchema,
  outputSchema: stcWallAssemblyLayeredGypsumConfigurationsTableOutputSchema,
  ports: {
    inputs: [
      {
        id: "assemblies",
        label: "Layered gypsum assembly table",
        required: true,
        valueType: {
          format: "toolio.stc-wall-assembly-row.v1",
          items: { type: "object" },
          type: "list",
        },
      },
      {
        id: "query",
        label: "Assembly filters",
        required: true,
        valueType: {
          format: "toolio.stc-wall-assembly-query.v1",
          type: "object",
        },
      },
    ],
    outputs: [
      {
        id: "matchedAssemblyIds",
        label: "Matched assembly identifiers",
        valueType: {
          format: "toolio.identifier-list.v1",
          items: { type: "string" },
          type: "list",
        },
      },
      {
        id: "selectedAssembly",
        label: "Selected STC assembly",
        valueType: {
          format: "toolio.stc-wall-assembly-row.v1",
          type: "object",
        },
      },
    ],
  },
  title: "Layered Gypsum Wall STC Lookup",
});

export const runStcWallAssemblyLayeredGypsumConfigurationsTable =
  stcWallAssemblyLayeredGypsumConfigurationsTableTool.execute;

export default stcWallAssemblyLayeredGypsumConfigurationsTableTool;
