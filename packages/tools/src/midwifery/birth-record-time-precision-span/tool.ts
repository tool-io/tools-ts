import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earliestTime: number;
  readonly latestTime: number;
  readonly suppliedUnitFactor: number;
};
export type Output = { readonly width: number; readonly midpoint: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earliestTime: { type: "number" },
    latestTime: { type: "number" },
    suppliedUnitFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["earliestTime", "latestTime", "suppliedUnitFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { width: { type: "number" }, midpoint: { type: "number" } },
  required: ["width", "midpoint"],
} as const;
/** Summarize a supplied birth-record timestamp uncertainty envelope without inferring an exact event time. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earliestTime, latestTime, suppliedUnitFactor } = request;
  const compute = (): Output => {
    H.domain(earliestTime <= latestTime);
    H.positive(suppliedUnitFactor);
    return {
      width: (latestTime - earliestTime) * suppliedUnitFactor,
      midpoint:
        (earliestTime + (latestTime - earliestTime) / 2) * suppliedUnitFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { earliestTime: 100, latestTime: 110, suppliedUnitFactor: 60 },
  output: { width: 600, midpoint: 6300 },
} satisfies ToolExample<Input, Output>;
export const birthRecordTimePrecisionSpanTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "midwifery/birth-record-time-precision-span",
    title: "Birth Record Time Precision Span Tool",
    description:
      "Summarize a supplied birth-record timestamp uncertainty envelope without inferring an exact event time.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earliestTime: { type: "number" },
        latestTime: { type: "number" },
        suppliedUnitFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["earliestTime", "latestTime", "suppliedUnitFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { width: { type: "number" }, midpoint: { type: "number" } },
      required: ["width", "midpoint"],
    },
    ports: {
      inputs: [
        {
          id: "earliestTime",
          label: "Earliest Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "latestTime",
          label: "Latest Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedUnitFactor",
          label: "Supplied Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "width", label: "Width", valueType: { type: "number" } },
        { id: "midpoint", label: "Midpoint", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = birthRecordTimePrecisionSpanTool.execute;
export default birthRecordTimePrecisionSpanTool;
