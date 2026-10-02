import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stored: number;
  readonly reserve: number;
  readonly dailyLoss: number;
  readonly days: number;
};
export type Output = {
  readonly endingStorage: number;
  readonly reserveMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stored: { type: "number", minimum: 0 },
    reserve: { type: "number", minimum: 0 },
    dailyLoss: { type: "number", minimum: 0 },
    days: { type: "number", minimum: 0 },
  },
  required: ["stored", "reserve", "dailyLoss", "days"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    endingStorage: { type: "number" },
    reserveMargin: { type: "number" },
  },
  required: ["endingStorage", "reserveMargin"],
} as const;
/** Calculate rainfed bed dry period storage gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stored, reserve, dailyLoss, days } = request;
  const compute = (): Output => {
    H.domain(stored >= 0 && reserve >= 0 && dailyLoss >= 0 && days >= 0);
    return {
      endingStorage: stored - dailyLoss * days,
      reserveMargin: stored - dailyLoss * days - reserve,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stored: 100, reserve: 20, dailyLoss: 5, days: 10 },
  output: { endingStorage: 50, reserveMargin: 30 },
} satisfies ToolExample<Input, Output>;
export const rainfedBedDryPeriodStorageGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "permaculture/rainfed-bed-dry-period-storage-gap",
    title: "Rainfed BED Dry Period Storage Gap Tool",
    description:
      "Calculate rainfed bed dry period storage gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stored: { type: "number", minimum: 0 },
        reserve: { type: "number", minimum: 0 },
        dailyLoss: { type: "number", minimum: 0 },
        days: { type: "number", minimum: 0 },
      },
      required: ["stored", "reserve", "dailyLoss", "days"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        endingStorage: { type: "number" },
        reserveMargin: { type: "number" },
      },
      required: ["endingStorage", "reserveMargin"],
    },
    ports: {
      inputs: [
        {
          id: "stored",
          label: "Stored",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reserve",
          label: "Reserve",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dailyLoss",
          label: "Daily Loss",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "days",
          label: "Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "endingStorage",
          label: "Ending Storage",
          valueType: { type: "number" },
        },
        {
          id: "reserveMargin",
          label: "Reserve Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rainfedBedDryPeriodStorageGapTool.execute;
export default rainfedBedDryPeriodStorageGapTool;
