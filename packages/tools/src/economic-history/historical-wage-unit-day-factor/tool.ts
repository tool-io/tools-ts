import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedWage: number;
  readonly majorPerRecordedUnit: number;
  readonly paidDays: number;
};
export type Output = { readonly majorPerDay: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedWage: { type: "number", minimum: 0 },
    majorPerRecordedUnit: { type: "number", exclusiveMinimum: 0 },
    paidDays: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["recordedWage", "majorPerRecordedUnit", "paidDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { majorPerDay: { type: "number" } },
  required: ["majorPerDay"],
} as const;
/** Calculate historical wage unit day factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedWage, majorPerRecordedUnit, paidDays } = request;
  const compute = (): Output => {
    H.domain(recordedWage >= 0);
    H.positive(majorPerRecordedUnit);
    H.positive(paidDays);
    return { majorPerDay: (recordedWage * majorPerRecordedUnit) / paidDays };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedWage: 120, majorPerRecordedUnit: 0.5, paidDays: 10 },
  output: { majorPerDay: 6 },
} satisfies ToolExample<Input, Output>;
export const historicalWageUnitDayFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/historical-wage-unit-day-factor",
    title: "Historical Wage Unit Day Factor Tool",
    description:
      "Calculate historical wage unit day factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedWage: { type: "number", minimum: 0 },
        majorPerRecordedUnit: { type: "number", exclusiveMinimum: 0 },
        paidDays: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["recordedWage", "majorPerRecordedUnit", "paidDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { majorPerDay: { type: "number" } },
      required: ["majorPerDay"],
    },
    ports: {
      inputs: [
        {
          id: "recordedWage",
          label: "Recorded Wage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "majorPerRecordedUnit",
          label: "Major Per Recorded Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "paidDays",
          label: "Paid Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "majorPerDay",
          label: "Major Per Day",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = historicalWageUnitDayFactorTool.execute;
export default historicalWageUnitDayFactorTool;
