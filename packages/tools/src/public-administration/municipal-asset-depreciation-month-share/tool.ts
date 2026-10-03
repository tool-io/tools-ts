import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cost: number;
  readonly salvage: number;
  readonly lifeMonths: number;
  readonly elapsedMonths: number;
};
export type Output = {
  readonly depreciable: number;
  readonly accumulated: number;
  readonly bookValue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cost: { type: "number" },
    salvage: { type: "number", minimum: 0 },
    lifeMonths: { type: "integer", minimum: 1 },
    elapsedMonths: { type: "integer", minimum: 0 },
  },
  required: ["cost", "salvage", "lifeMonths", "elapsedMonths"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depreciable: { type: "number" },
    accumulated: { type: "number" },
    bookValue: { type: "number" },
  },
  required: ["depreciable", "accumulated", "bookValue"],
} as const;
/** Straight-line monthly depreciation capped at salvage, with explicit useful life and no accounting-rule lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cost, salvage, lifeMonths, elapsedMonths } = request;
  const compute = (): Output => {
    H.domain(salvage >= 0 && cost >= salvage);
    H.integer(lifeMonths, 1);
    H.integer(elapsedMonths, 0);
    return {
      depreciable: cost - salvage,
      accumulated:
        ((cost - salvage) * Math.min(elapsedMonths, lifeMonths)) / lifeMonths,
      bookValue:
        cost -
        ((cost - salvage) * Math.min(elapsedMonths, lifeMonths)) / lifeMonths,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cost: 12000, salvage: 2000, lifeMonths: 100, elapsedMonths: 30 },
  output: { depreciable: 10000, accumulated: 3000, bookValue: 9000 },
} satisfies ToolExample<Input, Output>;
export const municipalAssetDepreciationMonthShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "public-administration/municipal-asset-depreciation-month-share",
      title: "Municipal Asset Depreciation Month Share Tool",
      description:
        "Straight-line monthly depreciation capped at salvage, with explicit useful life and no accounting-rule lookup.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cost: { type: "number" },
          salvage: { type: "number", minimum: 0 },
          lifeMonths: { type: "integer", minimum: 1 },
          elapsedMonths: { type: "integer", minimum: 0 },
        },
        required: ["cost", "salvage", "lifeMonths", "elapsedMonths"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          depreciable: { type: "number" },
          accumulated: { type: "number" },
          bookValue: { type: "number" },
        },
        required: ["depreciable", "accumulated", "bookValue"],
      },
      ports: {
        inputs: [
          {
            id: "cost",
            label: "Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "salvage",
            label: "Salvage",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lifeMonths",
            label: "Life Months",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "elapsedMonths",
            label: "Elapsed Months",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "depreciable",
            label: "Depreciable",
            valueType: { type: "number" },
          },
          {
            id: "accumulated",
            label: "Accumulated",
            valueType: { type: "number" },
          },
          {
            id: "bookValue",
            label: "Book Value",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = municipalAssetDepreciationMonthShareTool.execute;
export default municipalAssetDepreciationMonthShareTool;
