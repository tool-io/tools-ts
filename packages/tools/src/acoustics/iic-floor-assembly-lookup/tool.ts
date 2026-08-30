import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { matchesToolJsonSchema } from "../../core/contract.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";

export type IicFloorAssemblyRatingBasis =
  "estimated" | "manufacturer-claim" | "tested";
export type IicFloorAssemblyTestMethod =
  | "ASTM E1007/E989"
  | "ASTM E492/E989"
  | "ISO 10140-3/ISO 717-2"
  | "manufacturer-method";

export type ImpactInsulationClassIicFloorAssemblyRow = Readonly<{
  readonly assemblyDescription: string;
  readonly assemblyId: string;
  readonly floorCovering: string;
  readonly floorStructure: string;
  readonly ratingBasis: IicFloorAssemblyRatingBasis;
  readonly reportedIic: number;
  readonly resilientUnderlayment: string;
  readonly source: string;
  readonly testMethod: IicFloorAssemblyTestMethod;
  readonly testReference: string;
}>;

export type ImpactInsulationClassIicFloorAssemblyTableLookupInput = Readonly<{
  readonly assemblies: readonly ImpactInsulationClassIicFloorAssemblyRow[];
  readonly query: Readonly<{
    readonly assemblyId?: string;
    readonly minimumIic?: number;
  }>;
}>;

export type ImpactInsulationClassIicFloorAssemblyTableLookupOutput = Readonly<{
  readonly caveat: string;
  readonly matchedAssemblyIds: readonly string[];
  readonly selectedAssembly: ImpactInsulationClassIicFloorAssemblyRow;
}>;

const rowSchema = {
  additionalProperties: false,
  properties: {
    assemblyDescription: { minLength: 1, type: "string" },
    assemblyId: { minLength: 1, type: "string" },
    floorCovering: { minLength: 1, type: "string" },
    floorStructure: { minLength: 1, type: "string" },
    ratingBasis: {
      enum: ["estimated", "manufacturer-claim", "tested"],
      type: "string",
    },
    reportedIic: { minimum: 0, type: "number" },
    resilientUnderlayment: { minLength: 1, type: "string" },
    source: { minLength: 1, type: "string" },
    testMethod: {
      enum: [
        "ASTM E1007/E989",
        "ASTM E492/E989",
        "ISO 10140-3/ISO 717-2",
        "manufacturer-method",
      ],
      type: "string",
    },
    testReference: { minLength: 1, type: "string" },
  },
  required: [
    "assemblyDescription",
    "assemblyId",
    "floorCovering",
    "floorStructure",
    "ratingBasis",
    "reportedIic",
    "resilientUnderlayment",
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
    minimumIic: { minimum: 0, type: "number" },
  },
  type: "object",
} satisfies ToolJsonSchema;

export const impactInsulationClassIicFloorAssemblyTableLookupInputSchema = {
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

export const impactInsulationClassIicFloorAssemblyTableLookupOutputSchema = {
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
  "IIC is the ASTM E989 single-number classification associated with the ASTM E492 laboratory tapping-machine test. It does not describe low-frequency walking impacts, squeaks, or all field sources; ASTM E1007 field impact measurements and the exact floor, underlayment, covering, supports, and test conditions must be identified.";

const assertInput = (
  value: unknown,
): ImpactInsulationClassIicFloorAssemblyTableLookupInput => {
  if (
    !matchesToolJsonSchema(
      value,
      impactInsulationClassIicFloorAssemblyTableLookupInputSchema,
    )
  )
    simpleError(
      "input",
      "Input does not match the IIC floor assembly table schema.",
      "schema_invalid",
    );
  const input = value as ImpactInsulationClassIicFloorAssemblyTableLookupInput;
  const ids = new Set<string>();
  for (const row of input.assemblies) {
    if (ids.has(row.assemblyId))
      simpleError(
        "assemblies",
        "IIC assembly identifiers must be unique.",
        "duplicate_assembly_id",
      );
    ids.add(row.assemblyId);
    if (!Number.isFinite(row.reportedIic))
      simpleError("assemblies", "IIC values must be finite.", "invalid_iic");
  }
  return input;
};

const selectRows = (
  input: ImpactInsulationClassIicFloorAssemblyTableLookupInput,
): readonly ImpactInsulationClassIicFloorAssemblyRow[] => {
  const matches = input.assemblies.filter(
    (row) =>
      (input.query.assemblyId === undefined ||
        row.assemblyId === input.query.assemblyId) &&
      (input.query.minimumIic === undefined ||
        row.reportedIic >= input.query.minimumIic),
  );
  if (matches.length === 0)
    simpleError(
      "query",
      "No floor assembly matches the caller-supplied filters.",
      "no_matching_assembly",
    );
  return [...matches].sort(
    (left, right) =>
      right.reportedIic - left.reportedIic ||
      left.assemblyId.localeCompare(right.assemblyId, "en-US"),
  );
};

export const calculateImpactInsulationClassIicFloorAssemblyTableLookup = (
  input: ImpactInsulationClassIicFloorAssemblyTableLookupInput,
): ImpactInsulationClassIicFloorAssemblyTableLookupOutput => {
  const validated = assertInput(input);
  const matches = selectRows(validated);
  const selectedAssembly = matches[0];
  if (selectedAssembly === undefined)
    simpleError(
      "assemblies",
      "No floor assembly matches the supplied filters.",
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
): ToolResult<ImpactInsulationClassIicFloorAssemblyTableLookupOutput> => {
  try {
    return toolSuccess(
      calculateImpactInsulationClassIicFloorAssemblyTableLookup(
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
        message: "The IIC floor assembly lookup could not be completed.",
      },
    ]);
  }
};

export const example = {
  input: {
    assemblies: [
      {
        assemblyDescription:
          "LVT over USG Levelrock 2500 underlayment and SAM-N25 over OSB, open-web truss, R-13 batts, resilient channel, and gypsum",
        assemblyId: "cemco-fc21-0303",
        floorCovering: "Shaw Expo luxury vinyl tile",
        floorStructure: "Open-web wood truss with OSB sheathing",
        ratingBasis: "tested",
        reportedIic: 51,
        resilientUnderlayment: "USG SAM-N25 and Levelrock 2500",
        source: "CEMCO FC21-0303 laboratory acoustical test report",
        testMethod: "ASTM E492/E989",
        testReference: "FC21-0303, 2021-09-17",
      },
    ],
    query: { minimumIic: 50 },
  },
  output: {
    caveat,
    matchedAssemblyIds: ["cemco-fc21-0303"],
    selectedAssembly: {
      assemblyDescription:
        "LVT over USG Levelrock 2500 underlayment and SAM-N25 over OSB, open-web truss, R-13 batts, resilient channel, and gypsum",
      assemblyId: "cemco-fc21-0303",
      floorCovering: "Shaw Expo luxury vinyl tile",
      floorStructure: "Open-web wood truss with OSB sheathing",
      ratingBasis: "tested",
      reportedIic: 51,
      resilientUnderlayment: "USG SAM-N25 and Levelrock 2500",
      source: "CEMCO FC21-0303 laboratory acoustical test report",
      testMethod: "ASTM E492/E989",
      testReference: "FC21-0303, 2021-09-17",
    },
  },
} satisfies ToolExample<
  ImpactInsulationClassIicFloorAssemblyTableLookupInput,
  ImpactInsulationClassIicFloorAssemblyTableLookupOutput
>;

export const impactInsulationClassIicFloorAssemblyTableLookupTool = defineTool<
  ImpactInsulationClassIicFloorAssemblyTableLookupInput,
  ImpactInsulationClassIicFloorAssemblyTableLookupOutput
>({
  contractVersion: 1,
  description:
    "Select a caller-supplied floor assembly by identifier and minimum ASTM E989 IIC while preserving the exact floor, covering, underlayment, test method, and rating provenance.",
  execute,
  execution: { kind: "pure" },
  id: "acoustics/iic-floor-assembly-lookup",
  inputSchema: impactInsulationClassIicFloorAssemblyTableLookupInputSchema,
  outputSchema: impactInsulationClassIicFloorAssemblyTableLookupOutputSchema,
  ports: {
    inputs: [
      {
        id: "assemblies",
        label: "IIC floor assembly table",
        required: true,
        valueType: {
          format: "toolio.iic-floor-assembly-row.v1",
          items: { type: "object" },
          type: "list",
        },
      },
      {
        id: "query",
        label: "IIC assembly filters",
        required: true,
        valueType: { format: "toolio.iic-floor-query.v1", type: "object" },
      },
    ],
    outputs: [
      {
        id: "matchedAssemblyIds",
        label: "Matched IIC assembly identifiers",
        valueType: {
          format: "toolio.identifier-list.v1",
          items: { type: "string" },
          type: "list",
        },
      },
      {
        id: "selectedAssembly",
        label: "Selected IIC assembly",
        valueType: {
          format: "toolio.iic-floor-assembly-row.v1",
          type: "object",
        },
      },
    ],
  },
  title: "IIC Floor Assembly Lookup",
});

export const runImpactInsulationClassIicFloorAssemblyTableLookup =
  impactInsulationClassIicFloorAssemblyTableLookupTool.execute;

export default impactInsulationClassIicFloorAssemblyTableLookupTool;
