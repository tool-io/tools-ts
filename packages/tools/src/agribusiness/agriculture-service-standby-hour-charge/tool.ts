import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly standbyHours: number;
  readonly freeHours: number;
  readonly standbyRate: number;
  readonly workHours: number;
  readonly workRate: number;
};
export type Output = {
  readonly billableStandby: number;
  readonly standbyCharge: number;
  readonly totalCharge: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    standbyHours: { type: "number", minimum: 0 },
    freeHours: { type: "number", minimum: 0 },
    standbyRate: { type: "number", minimum: 0 },
    workHours: { type: "number", minimum: 0 },
    workRate: { type: "number", minimum: 0 },
  },
  required: [
    "standbyHours",
    "freeHours",
    "standbyRate",
    "workHours",
    "workRate",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    billableStandby: { type: "number" },
    standbyCharge: { type: "number" },
    totalCharge: { type: "number" },
  },
  required: ["billableStandby", "standbyCharge", "totalCharge"],
} as const;
/** Calculate agriculture service standby hour charge from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { standbyHours, freeHours, standbyRate, workHours, workRate } = request;
  const compute = (): Output => {
    H.domain(
      standbyHours >= 0 &&
        freeHours >= 0 &&
        standbyRate >= 0 &&
        workHours >= 0 &&
        workRate >= 0,
    );
    return {
      billableStandby: Math.max(0, standbyHours - freeHours),
      standbyCharge: Math.max(0, standbyHours - freeHours) * standbyRate,
      totalCharge:
        Math.max(0, standbyHours - freeHours) * standbyRate +
        workHours * workRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    standbyHours: 5,
    freeHours: 2,
    standbyRate: 20,
    workHours: 4,
    workRate: 50,
  },
  output: { billableStandby: 3, standbyCharge: 60, totalCharge: 260 },
} satisfies ToolExample<Input, Output>;
export const agricultureServiceStandbyHourChargeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agribusiness/agriculture-service-standby-hour-charge",
      title: "Agriculture Service Standby Hour Charge Tool",
      description:
        "Calculate agriculture service standby hour charge from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          standbyHours: { type: "number", minimum: 0 },
          freeHours: { type: "number", minimum: 0 },
          standbyRate: { type: "number", minimum: 0 },
          workHours: { type: "number", minimum: 0 },
          workRate: { type: "number", minimum: 0 },
        },
        required: [
          "standbyHours",
          "freeHours",
          "standbyRate",
          "workHours",
          "workRate",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          billableStandby: { type: "number" },
          standbyCharge: { type: "number" },
          totalCharge: { type: "number" },
        },
        required: ["billableStandby", "standbyCharge", "totalCharge"],
      },
      ports: {
        inputs: [
          {
            id: "standbyHours",
            label: "Standby Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "freeHours",
            label: "Free Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "standbyRate",
            label: "Standby Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "workHours",
            label: "Work Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "workRate",
            label: "Work Rate",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "billableStandby",
            label: "Billable Standby",
            valueType: { type: "number" },
          },
          {
            id: "standbyCharge",
            label: "Standby Charge",
            valueType: { type: "number" },
          },
          {
            id: "totalCharge",
            label: "Total Charge",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = agricultureServiceStandbyHourChargeTool.execute;
export default agricultureServiceStandbyHourChargeTool;
