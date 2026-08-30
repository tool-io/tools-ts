import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { matchesToolJsonSchema } from "../../core/contract.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";

export type MlvRatingBasis = "estimated" | "manufacturer-claim" | "tested";
export type MlvTestMethod =
  "ASTM E90/E413" | "ISO 10140-2/ISO 717-1" | "manufacturer-method";

export type MassLoadedVinylMlvStcSupplementRow = Readonly<{
  readonly applicationNotes: string;
  readonly manufacturer: string;
  readonly productId: string;
  readonly ratingBasis: MlvRatingBasis;
  readonly source: string;
  readonly standaloneReportedStc: number;
  readonly surfaceMassPoundsPerSquareFoot: number;
  readonly testMethod: MlvTestMethod;
  readonly testReference: string;
  readonly thicknessMillimeters: number;
}>;

export type MassLoadedVinylMlvStcSupplementLookupInput = Readonly<{
  readonly products: readonly MassLoadedVinylMlvStcSupplementRow[];
  readonly queryProductId: string;
}>;

export type MassLoadedVinylMlvStcSupplementLookupOutput = Readonly<{
  readonly caveat: string;
  readonly combinedAssemblyStc: null;
  readonly selectedProduct: MassLoadedVinylMlvStcSupplementRow;
  readonly surfaceMassKgPerSquareMeter: number;
}>;

const rowSchema = {
  additionalProperties: false,
  properties: {
    applicationNotes: { minLength: 1, type: "string" },
    manufacturer: { minLength: 1, type: "string" },
    productId: { minLength: 1, type: "string" },
    ratingBasis: {
      enum: ["estimated", "manufacturer-claim", "tested"],
      type: "string",
    },
    source: { minLength: 1, type: "string" },
    standaloneReportedStc: { minimum: 0, type: "number" },
    surfaceMassPoundsPerSquareFoot: { exclusiveMinimum: 0, type: "number" },
    testMethod: {
      enum: ["ASTM E90/E413", "ISO 10140-2/ISO 717-1", "manufacturer-method"],
      type: "string",
    },
    testReference: { minLength: 1, type: "string" },
    thicknessMillimeters: { exclusiveMinimum: 0, type: "number" },
  },
  required: [
    "applicationNotes",
    "manufacturer",
    "productId",
    "ratingBasis",
    "source",
    "standaloneReportedStc",
    "surfaceMassPoundsPerSquareFoot",
    "testMethod",
    "testReference",
    "thicknessMillimeters",
  ],
  type: "object",
} satisfies ToolJsonSchema;

export const massLoadedVinylMlvStcSupplementLookupInputSchema = {
  additionalProperties: false,
  properties: {
    products: {
      items: rowSchema,
      maxItems: 200,
      minItems: 1,
      type: "array",
    },
    queryProductId: { minLength: 1, type: "string" },
  },
  required: ["products", "queryProductId"],
  type: "object",
} satisfies ToolJsonSchema;

export const massLoadedVinylMlvStcSupplementLookupOutputSchema = {
  additionalProperties: false,
  properties: {
    caveat: { type: "string" },
    combinedAssemblyStc: { type: "null" },
    selectedProduct: rowSchema,
    surfaceMassKgPerSquareMeter: { exclusiveMinimum: 0, type: "number" },
  },
  required: [
    "caveat",
    "combinedAssemblyStc",
    "selectedProduct",
    "surfaceMassKgPerSquareMeter",
  ],
  type: "object",
} satisfies ToolJsonSchema;

const poundsPerSquareFootToKilogramsPerSquareMeter = 0.45359237;
const caveat =
  "The returned STC is the reported standalone laboratory specimen rating for the identified MLV product. MLV does not provide a universal additive STC supplement to a wall or floor assembly; combine mass, damping, seams, mounting, framing, fire requirements, and field flanking only through a matched assembly test or qualified design.";

const assertInput = (
  value: unknown,
): MassLoadedVinylMlvStcSupplementLookupInput => {
  if (
    !matchesToolJsonSchema(
      value,
      massLoadedVinylMlvStcSupplementLookupInputSchema,
    )
  )
    simpleError(
      "input",
      "Input does not match the MLV product table schema.",
      "schema_invalid",
    );
  const input = value as MassLoadedVinylMlvStcSupplementLookupInput;
  const ids = new Set<string>();
  for (const row of input.products) {
    if (ids.has(row.productId))
      simpleError(
        "products",
        "MLV product identifiers must be unique.",
        "duplicate_product_id",
      );
    ids.add(row.productId);
    if (
      !Number.isFinite(row.surfaceMassPoundsPerSquareFoot) ||
      !Number.isFinite(row.standaloneReportedStc) ||
      !Number.isFinite(row.thicknessMillimeters)
    )
      simpleError(
        "products",
        "MLV mass, thickness, and STC must be finite.",
        "invalid_product_value",
      );
  }
  return input;
};

export const calculateMassLoadedVinylMlvStcSupplementLookup = (
  input: MassLoadedVinylMlvStcSupplementLookupInput,
): MassLoadedVinylMlvStcSupplementLookupOutput => {
  const validated = assertInput(input);
  const selectedProduct =
    validated.products.find(
      (row) => row.productId === validated.queryProductId,
    ) ??
    simpleError(
      "queryProductId",
      "The requested MLV product is not in the caller-supplied table.",
      "product_not_found",
    );
  const surfaceMassKgPerSquareMeter =
    selectedProduct.surfaceMassPoundsPerSquareFoot *
    poundsPerSquareFootToKilogramsPerSquareMeter;
  if (!Number.isFinite(surfaceMassKgPerSquareMeter))
    simpleError(
      "surfaceMassKgPerSquareMeter",
      "The converted MLV mass is out of range.",
      "calculation_failed",
    );
  return {
    caveat,
    combinedAssemblyStc: null,
    selectedProduct,
    surfaceMassKgPerSquareMeter,
  };
};

const execute = (
  input: unknown,
): ToolResult<MassLoadedVinylMlvStcSupplementLookupOutput> => {
  try {
    return toolSuccess(
      calculateMassLoadedVinylMlvStcSupplementLookup(assertInput(input)),
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
        message: "The MLV product lookup could not be completed.",
      },
    ]);
  }
};

export const example = {
  input: {
    products: [
      {
        applicationNotes:
          "Standalone 4 ft by 8 ft sheet specimen; the report does not establish a complete wall or floor rating.",
        manufacturer: "Auralex Acoustics, Inc.",
        productId: "sheet-blok-1lb",
        ratingBasis: "tested",
        source: "Riverbank Acoustical Laboratories report RAL-TL20-215",
        standaloneReportedStc: 26,
        surfaceMassPoundsPerSquareFoot: 1.01,
        testMethod: "ASTM E90/E413",
        testReference: "RAL-TL20-215, 2020-08-05",
        thicknessMillimeters: 3.15,
      },
    ],
    queryProductId: "sheet-blok-1lb",
  },
  output: {
    caveat,
    combinedAssemblyStc: null,
    selectedProduct: {
      applicationNotes:
        "Standalone 4 ft by 8 ft sheet specimen; the report does not establish a complete wall or floor rating.",
      manufacturer: "Auralex Acoustics, Inc.",
      productId: "sheet-blok-1lb",
      ratingBasis: "tested",
      source: "Riverbank Acoustical Laboratories report RAL-TL20-215",
      standaloneReportedStc: 26,
      surfaceMassPoundsPerSquareFoot: 1.01,
      testMethod: "ASTM E90/E413",
      testReference: "RAL-TL20-215, 2020-08-05",
      thicknessMillimeters: 3.15,
    },
    surfaceMassKgPerSquareMeter: 0.4581282937,
  },
} satisfies ToolExample<
  MassLoadedVinylMlvStcSupplementLookupInput,
  MassLoadedVinylMlvStcSupplementLookupOutput
>;

export const massLoadedVinylMlvStcSupplementLookupTool = defineTool<
  MassLoadedVinylMlvStcSupplementLookupInput,
  MassLoadedVinylMlvStcSupplementLookupOutput
>({
  contractVersion: 1,
  description:
    "Look up a provenance-bearing MLV product row, convert its surface mass to metric units, and explicitly avoid treating a standalone specimen STC as an additive assembly supplement.",
  execute,
  execution: { kind: "pure" },
  id: "acoustics/mlv-product-stc-lookup",
  inputSchema: massLoadedVinylMlvStcSupplementLookupInputSchema,
  outputSchema: massLoadedVinylMlvStcSupplementLookupOutputSchema,
  ports: {
    inputs: [
      {
        id: "products",
        label: "MLV product table",
        required: true,
        valueType: {
          format: "toolio.mlv-product-row.v1",
          items: { type: "object" },
          type: "list",
        },
      },
      {
        id: "queryProductId",
        label: "MLV product identifier",
        required: true,
        valueType: { type: "string", format: "identifier" },
      },
    ],
    outputs: [
      {
        id: "combinedAssemblyStc",
        label: "Combined assembly STC",
        valueType: { type: "null" },
      },
      {
        id: "surfaceMassKgPerSquareMeter",
        label: "MLV surface mass",
        valueType: { type: "number", format: "surface-mass", unit: "kg/m2" },
      },
    ],
  },
  title: "MLV Product STC Lookup",
});

export const runMassLoadedVinylMlvStcSupplementLookup =
  massLoadedVinylMlvStcSupplementLookupTool.execute;

export default massLoadedVinylMlvStcSupplementLookupTool;
