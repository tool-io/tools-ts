import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly packCost: number;
  readonly packUnits: number;
  readonly reportingUnits: number;
};
export type Output = { readonly costPerReportingUnits: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packCost: { type: "number", minimum: 0 },
    packUnits: { type: "integer", minimum: 1 },
    reportingUnits: { type: "integer", minimum: 1 },
  },
  required: ["packCost", "packUnits", "reportingUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { costPerReportingUnits: { type: "number" } },
  required: ["costPerReportingUnits"],
} as const;
/** Calculate pharmacy pack unit cost factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { packCost, packUnits, reportingUnits } = request;
  const compute = (): Output => {
    H.domain(packCost >= 0);
    H.integer(packUnits, 1);
    H.integer(reportingUnits, 1);
    return { costPerReportingUnits: (packCost / packUnits) * reportingUnits };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { packCost: 24, packUnits: 12, reportingUnits: 5 },
  output: { costPerReportingUnits: 10 },
} satisfies ToolExample<Input, Output>;
export const pharmacyPackUnitCostFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-pharmacy/pharmacy-pack-unit-cost-factor",
    title: "Pharmacy Pack Unit Cost Factor Tool",
    description:
      "Calculate pharmacy pack unit cost factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        packCost: { type: "number", minimum: 0 },
        packUnits: { type: "integer", minimum: 1 },
        reportingUnits: { type: "integer", minimum: 1 },
      },
      required: ["packCost", "packUnits", "reportingUnits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { costPerReportingUnits: { type: "number" } },
      required: ["costPerReportingUnits"],
    },
    ports: {
      inputs: [
        {
          id: "packCost",
          label: "Pack Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "packUnits",
          label: "Pack Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reportingUnits",
          label: "Reporting Units",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "costPerReportingUnits",
          label: "Cost Per Reporting Units",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pharmacyPackUnitCostFactorTool.execute;
export default pharmacyPackUnitCostFactorTool;
