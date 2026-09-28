import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingStock: number;
  readonly immigration: number;
  readonly emigration: number;
  readonly birthsIncluded: number;
  readonly deaths: number;
  readonly reclassification: number;
};
export type Output = {
  readonly closingStock: number;
  readonly netMigration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingStock: { type: "number", minimum: 0 },
    immigration: { type: "number", minimum: 0 },
    emigration: { type: "number", minimum: 0 },
    birthsIncluded: { type: "number", minimum: 0 },
    deaths: { type: "number", minimum: 0 },
    reclassification: { type: "number" },
  },
  required: [
    "openingStock",
    "immigration",
    "emigration",
    "birthsIncluded",
    "deaths",
    "reclassification",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    closingStock: { type: "number" },
    netMigration: { type: "number" },
  },
  required: ["closingStock", "netMigration"],
} as const;
/** Explicit stock-flow ledger with signed boundary reclassification and caller-defined inclusion of births; not a migration estimate from stock difference alone. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    openingStock,
    immigration,
    emigration,
    birthsIncluded,
    deaths,
    reclassification,
  } = request;
  const compute = (): Output => {
    H.domain(
      openingStock >= 0 &&
        immigration >= 0 &&
        emigration >= 0 &&
        birthsIncluded >= 0 &&
        deaths >= 0,
    );
    return {
      closingStock:
        openingStock +
        immigration -
        emigration +
        birthsIncluded -
        deaths +
        reclassification,
      netMigration: immigration - emigration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openingStock: 1000,
    immigration: 100,
    emigration: 60,
    birthsIncluded: 20,
    deaths: 10,
    reclassification: -5,
  },
  output: { closingStock: 1045, netMigration: 40 },
} satisfies ToolExample<Input, Output>;
export const internationalMigrantStockFlowBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "global-studies/international-migrant-stock-flow-balance",
      title: "International Migrant Stock Flow Balance Tool",
      description:
        "Explicit stock-flow ledger with signed boundary reclassification and caller-defined inclusion of births; not a migration estimate from stock difference alone.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          openingStock: { type: "number", minimum: 0 },
          immigration: { type: "number", minimum: 0 },
          emigration: { type: "number", minimum: 0 },
          birthsIncluded: { type: "number", minimum: 0 },
          deaths: { type: "number", minimum: 0 },
          reclassification: { type: "number" },
        },
        required: [
          "openingStock",
          "immigration",
          "emigration",
          "birthsIncluded",
          "deaths",
          "reclassification",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          closingStock: { type: "number" },
          netMigration: { type: "number" },
        },
        required: ["closingStock", "netMigration"],
      },
      ports: {
        inputs: [
          {
            id: "openingStock",
            label: "Opening Stock",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "immigration",
            label: "Immigration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "emigration",
            label: "Emigration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "birthsIncluded",
            label: "Births Included",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "deaths",
            label: "Deaths",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reclassification",
            label: "Reclassification",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "closingStock",
            label: "Closing Stock",
            valueType: { type: "number" },
          },
          {
            id: "netMigration",
            label: "Net Migration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = internationalMigrantStockFlowBalanceTool.execute;
export default internationalMigrantStockFlowBalanceTool;
