import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly setupCost: number;
  readonly setupMinutes: number;
  readonly hourlyMachineCost: number;
  readonly lotUnits: number;
  readonly variableUnitCost: number;
};
export type Output = {
  readonly setupTotal: number;
  readonly setupPerUnit: number;
  readonly totalUnitCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    setupCost: { type: "number" },
    setupMinutes: { type: "number", minimum: 0 },
    hourlyMachineCost: { type: "number", minimum: 0 },
    lotUnits: { type: "integer", minimum: 1 },
    variableUnitCost: { type: "number", minimum: 0 },
  },
  required: [
    "setupCost",
    "setupMinutes",
    "hourlyMachineCost",
    "lotUnits",
    "variableUnitCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    setupTotal: { type: "number" },
    setupPerUnit: { type: "number" },
    totalUnitCost: { type: "number" },
  },
  required: ["setupTotal", "setupPerUnit", "totalUnitCost"],
} as const;
/** Calculate setup lot one unit amortization term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    setupCost,
    setupMinutes,
    hourlyMachineCost,
    lotUnits,
    variableUnitCost,
  } = request;
  const compute = (): Output => {
    H.domain(
      setupMinutes >= 0 && hourlyMachineCost >= 0 && variableUnitCost >= 0,
    );
    H.integer(lotUnits, 1);
    return {
      setupTotal: setupCost + (setupMinutes * hourlyMachineCost) / 60,
      setupPerUnit:
        (setupCost + (setupMinutes * hourlyMachineCost) / 60) / lotUnits,
      totalUnitCost:
        variableUnitCost +
        (setupCost + (setupMinutes * hourlyMachineCost) / 60) / lotUnits,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    setupCost: 100,
    setupMinutes: 30,
    hourlyMachineCost: 60,
    lotUnits: 100,
    variableUnitCost: 5,
  },
  output: { setupTotal: 130, setupPerUnit: 1.3, totalUnitCost: 6.3 },
} satisfies ToolExample<Input, Output>;
export const setupLotOneUnitAmortizationTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/setup-lot-one-unit-amortization-term",
    title: "Setup Lot One Unit Amortization Term Tool",
    description:
      "Calculate setup lot one unit amortization term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        setupCost: { type: "number" },
        setupMinutes: { type: "number", minimum: 0 },
        hourlyMachineCost: { type: "number", minimum: 0 },
        lotUnits: { type: "integer", minimum: 1 },
        variableUnitCost: { type: "number", minimum: 0 },
      },
      required: [
        "setupCost",
        "setupMinutes",
        "hourlyMachineCost",
        "lotUnits",
        "variableUnitCost",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        setupTotal: { type: "number" },
        setupPerUnit: { type: "number" },
        totalUnitCost: { type: "number" },
      },
      required: ["setupTotal", "setupPerUnit", "totalUnitCost"],
    },
    ports: {
      inputs: [
        {
          id: "setupCost",
          label: "Setup Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "setupMinutes",
          label: "Setup Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "hourlyMachineCost",
          label: "Hourly Machine Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lotUnits",
          label: "Lot Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "variableUnitCost",
          label: "Variable Unit Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "setupTotal",
          label: "Setup Total",
          valueType: { type: "number" },
        },
        {
          id: "setupPerUnit",
          label: "Setup Per Unit",
          valueType: { type: "number" },
        },
        {
          id: "totalUnitCost",
          label: "Total Unit Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = setupLotOneUnitAmortizationTermTool.execute;
export default setupLotOneUnitAmortizationTermTool;
