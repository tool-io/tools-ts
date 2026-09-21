import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly purchaseCost: number;
  readonly salvageValue: number;
  readonly lifeYears: number;
  readonly annualUseHours: number;
};
export type Output = {
  readonly depreciable: number;
  readonly annualStraightLine: number;
  readonly hourlyDepreciation: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    purchaseCost: { type: "number" },
    salvageValue: { type: "number", minimum: 0 },
    lifeYears: { type: "number", exclusiveMinimum: 0 },
    annualUseHours: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["purchaseCost", "salvageValue", "lifeYears", "annualUseHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depreciable: { type: "number" },
    annualStraightLine: { type: "number" },
    hourlyDepreciation: { type: "number" },
  },
  required: ["depreciable", "annualStraightLine", "hourlyDepreciation"],
} as const;
/** Calculate machinery replacement salvage share term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { purchaseCost, salvageValue, lifeYears, annualUseHours } = request;
  const compute = (): Output => {
    H.domain(salvageValue >= 0 && purchaseCost >= salvageValue);
    H.positive(lifeYears);
    H.positive(annualUseHours);
    return {
      depreciable: purchaseCost - salvageValue,
      annualStraightLine: (purchaseCost - salvageValue) / lifeYears,
      hourlyDepreciation:
        (purchaseCost - salvageValue) / (lifeYears * annualUseHours),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    purchaseCost: 100000,
    salvageValue: 20000,
    lifeYears: 10,
    annualUseHours: 1000,
  },
  output: {
    depreciable: 80000,
    annualStraightLine: 8000,
    hourlyDepreciation: 8,
  },
} satisfies ToolExample<Input, Output>;
export const machineryReplacementSalvageShareTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agricultural-economics/machinery-replacement-salvage-share-term",
      title: "Machinery Replacement Salvage Share Term Tool",
      description:
        "Calculate machinery replacement salvage share term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          purchaseCost: { type: "number" },
          salvageValue: { type: "number", minimum: 0 },
          lifeYears: { type: "number", exclusiveMinimum: 0 },
          annualUseHours: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "purchaseCost",
          "salvageValue",
          "lifeYears",
          "annualUseHours",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          depreciable: { type: "number" },
          annualStraightLine: { type: "number" },
          hourlyDepreciation: { type: "number" },
        },
        required: ["depreciable", "annualStraightLine", "hourlyDepreciation"],
      },
      ports: {
        inputs: [
          {
            id: "purchaseCost",
            label: "Purchase Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "salvageValue",
            label: "Salvage Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lifeYears",
            label: "Life Years",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "annualUseHours",
            label: "Annual Use Hours",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "depreciable",
            label: "Depreciable",
            valueType: { type: "number" },
          },
          {
            id: "annualStraightLine",
            label: "Annual Straight Line",
            valueType: { type: "number" },
          },
          {
            id: "hourlyDepreciation",
            label: "Hourly Depreciation",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = machineryReplacementSalvageShareTermTool.execute;
export default machineryReplacementSalvageShareTermTool;
