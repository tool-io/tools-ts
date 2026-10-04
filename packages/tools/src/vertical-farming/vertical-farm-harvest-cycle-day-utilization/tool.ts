import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly growingDays: number;
  readonly cleaningDays: number;
  readonly idleDays: number;
  readonly horizonDays: number;
};
export type Output = {
  readonly cycleDays: number;
  readonly completeCycles: number;
  readonly productiveShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    growingDays: { type: "number", minimum: 0 },
    cleaningDays: { type: "number", minimum: 0 },
    idleDays: { type: "number", minimum: 0 },
    horizonDays: { type: "number", minimum: 0 },
  },
  required: ["growingDays", "cleaningDays", "idleDays", "horizonDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cycleDays: { type: "number" },
    completeCycles: { type: "integer" },
    productiveShare: { type: "number" },
  },
  required: ["cycleDays", "completeCycles", "productiveShare"],
} as const;
/** Calculate vertical farm harvest cycle day utilization from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { growingDays, cleaningDays, idleDays, horizonDays } = request;
  const compute = (): Output => {
    H.domain(
      growingDays >= 0 &&
        cleaningDays >= 0 &&
        idleDays >= 0 &&
        growingDays + cleaningDays + idleDays > 0 &&
        horizonDays >= 0,
    );
    return {
      cycleDays: growingDays + cleaningDays + idleDays,
      completeCycles: Math.floor(
        horizonDays / (growingDays + cleaningDays + idleDays),
      ),
      productiveShare: growingDays / (growingDays + cleaningDays + idleDays),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { growingDays: 20, cleaningDays: 3, idleDays: 2, horizonDays: 100 },
  output: { cycleDays: 25, completeCycles: 4, productiveShare: 0.8 },
} satisfies ToolExample<Input, Output>;
export const verticalFarmHarvestCycleDayUtilizationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "vertical-farming/vertical-farm-harvest-cycle-day-utilization",
      title: "Vertical Farm Harvest Cycle Day Utilization Tool",
      description:
        "Calculate vertical farm harvest cycle day utilization from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          growingDays: { type: "number", minimum: 0 },
          cleaningDays: { type: "number", minimum: 0 },
          idleDays: { type: "number", minimum: 0 },
          horizonDays: { type: "number", minimum: 0 },
        },
        required: ["growingDays", "cleaningDays", "idleDays", "horizonDays"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cycleDays: { type: "number" },
          completeCycles: { type: "integer" },
          productiveShare: { type: "number" },
        },
        required: ["cycleDays", "completeCycles", "productiveShare"],
      },
      ports: {
        inputs: [
          {
            id: "growingDays",
            label: "Growing Days",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "cleaningDays",
            label: "Cleaning Days",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "idleDays",
            label: "Idle Days",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "horizonDays",
            label: "Horizon Days",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "cycleDays",
            label: "Cycle Days",
            valueType: { type: "number" },
          },
          {
            id: "completeCycles",
            label: "Complete Cycles",
            valueType: { type: "integer" },
          },
          {
            id: "productiveShare",
            label: "Productive Share",
            valueType: { type: "number", unit: "1" },
          },
        ],
      },
    },
    calculate,
  });
export const run = verticalFarmHarvestCycleDayUtilizationTool.execute;
export default verticalFarmHarvestCycleDayUtilizationTool;
