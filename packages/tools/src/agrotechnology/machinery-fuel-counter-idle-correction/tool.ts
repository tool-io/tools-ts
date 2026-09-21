import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalFuel: number;
  readonly totalHours: number;
  readonly idleHours: number;
  readonly idleRate: number;
};
export type Output = {
  readonly workingFuel: number;
  readonly workingRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalFuel: { type: "number" },
    totalHours: { type: "number" },
    idleHours: { type: "number", minimum: 0 },
    idleRate: { type: "number", minimum: 0 },
  },
  required: ["totalFuel", "totalHours", "idleHours", "idleRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workingFuel: { type: "number" },
    workingRate: { type: "number" },
  },
  required: ["workingFuel", "workingRate"],
} as const;
/** Calculate machinery fuel counter idle correction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalFuel, totalHours, idleHours, idleRate } = request;
  const compute = (): Output => {
    H.domain(
      totalHours > idleHours &&
        idleHours >= 0 &&
        idleRate >= 0 &&
        totalFuel >= idleHours * idleRate,
    );
    return {
      workingFuel: totalFuel - idleHours * idleRate,
      workingRate:
        (totalFuel - idleHours * idleRate) / (totalHours - idleHours),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalFuel: 100, totalHours: 10, idleHours: 2, idleRate: 5 },
  output: { workingFuel: 90, workingRate: 11.25 },
} satisfies ToolExample<Input, Output>;
export const machineryFuelCounterIdleCorrectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/machinery-fuel-counter-idle-correction",
    title: "Machinery Fuel Counter Idle Correction Tool",
    description:
      "Calculate machinery fuel counter idle correction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalFuel: { type: "number" },
        totalHours: { type: "number" },
        idleHours: { type: "number", minimum: 0 },
        idleRate: { type: "number", minimum: 0 },
      },
      required: ["totalFuel", "totalHours", "idleHours", "idleRate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        workingFuel: { type: "number" },
        workingRate: { type: "number" },
      },
      required: ["workingFuel", "workingRate"],
    },
    ports: {
      inputs: [
        {
          id: "totalFuel",
          label: "Total Fuel",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalHours",
          label: "Total Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "idleHours",
          label: "Idle Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "idleRate",
          label: "Idle Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "workingFuel",
          label: "Working Fuel",
          valueType: { type: "number" },
        },
        {
          id: "workingRate",
          label: "Working Rate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = machineryFuelCounterIdleCorrectionTool.execute;
export default machineryFuelCounterIdleCorrectionTool;
