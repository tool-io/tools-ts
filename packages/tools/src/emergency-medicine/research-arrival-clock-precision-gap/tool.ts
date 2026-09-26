import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earliestArrival: number;
  readonly latestArrival: number;
  readonly referenceTime: number;
};
export type Output = {
  readonly width: number;
  readonly earliestOffset: number;
  readonly latestOffset: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earliestArrival: { type: "number" },
    latestArrival: { type: "number" },
    referenceTime: { type: "number" },
  },
  required: ["earliestArrival", "latestArrival", "referenceTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number" },
    earliestOffset: { type: "number" },
    latestOffset: { type: "number" },
  },
  required: ["width", "earliestOffset", "latestOffset"],
} as const;
/** Calculate research arrival clock precision gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earliestArrival, latestArrival, referenceTime } = request;
  const compute = (): Output => {
    H.domain(latestArrival >= earliestArrival);
    return {
      width: latestArrival - earliestArrival,
      earliestOffset: earliestArrival - referenceTime,
      latestOffset: latestArrival - referenceTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { earliestArrival: 10, latestArrival: 15, referenceTime: 12 },
  output: { width: 5, earliestOffset: -2, latestOffset: 3 },
} satisfies ToolExample<Input, Output>;
export const researchArrivalClockPrecisionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "emergency-medicine/research-arrival-clock-precision-gap",
    title: "Research Arrival Clock Precision Gap Tool",
    description:
      "Calculate research arrival clock precision gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earliestArrival: { type: "number" },
        latestArrival: { type: "number" },
        referenceTime: { type: "number" },
      },
      required: ["earliestArrival", "latestArrival", "referenceTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number" },
        earliestOffset: { type: "number" },
        latestOffset: { type: "number" },
      },
      required: ["width", "earliestOffset", "latestOffset"],
    },
    ports: {
      inputs: [
        {
          id: "earliestArrival",
          label: "Earliest Arrival",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "latestArrival",
          label: "Latest Arrival",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceTime",
          label: "Reference Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "width", label: "Width", valueType: { type: "number" } },
        {
          id: "earliestOffset",
          label: "Earliest Offset",
          valueType: { type: "number" },
        },
        {
          id: "latestOffset",
          label: "Latest Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchArrivalClockPrecisionGapTool.execute;
export default researchArrivalClockPrecisionGapTool;
