import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pickedTime: number;
  readonly sampleInterval: number;
  readonly analystHalfwidth: number;
  readonly additionalHalfwidth: number;
};
export type Output = {
  readonly lower: number;
  readonly upper: number;
  readonly totalHalfwidth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pickedTime: { type: "number" },
    sampleInterval: { type: "number", minimum: 0 },
    analystHalfwidth: { type: "number", minimum: 0 },
    additionalHalfwidth: { type: "number", minimum: 0 },
  },
  required: [
    "pickedTime",
    "sampleInterval",
    "analystHalfwidth",
    "additionalHalfwidth",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number" },
    upper: { type: "number" },
    totalHalfwidth: { type: "number" },
  },
  required: ["lower", "upper", "totalHalfwidth"],
} as const;
/** Additive worst-case supplied pick-time envelope, not a statistical confidence interval or event location. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pickedTime, sampleInterval, analystHalfwidth, additionalHalfwidth } =
    request;
  const compute = (): Output => {
    H.domain(
      sampleInterval >= 0 && analystHalfwidth >= 0 && additionalHalfwidth >= 0,
    );
    return {
      lower:
        pickedTime -
        sampleInterval / 2 -
        analystHalfwidth -
        additionalHalfwidth,
      upper:
        pickedTime +
        sampleInterval / 2 +
        analystHalfwidth +
        additionalHalfwidth,
      totalHalfwidth:
        sampleInterval / 2 + analystHalfwidth + additionalHalfwidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pickedTime: 10,
    sampleInterval: 0.2,
    analystHalfwidth: 0.3,
    additionalHalfwidth: 0.1,
  },
  output: { lower: 9.5, upper: 10.5, totalHalfwidth: 0.5 },
} satisfies ToolExample<Input, Output>;
export const seismicPickTimePrecisionBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geophysics/seismic-pick-time-precision-budget",
    title: "Seismic Pick Time Precision Budget Tool",
    description:
      "Additive worst-case supplied pick-time envelope, not a statistical confidence interval or event location.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pickedTime: { type: "number" },
        sampleInterval: { type: "number", minimum: 0 },
        analystHalfwidth: { type: "number", minimum: 0 },
        additionalHalfwidth: { type: "number", minimum: 0 },
      },
      required: [
        "pickedTime",
        "sampleInterval",
        "analystHalfwidth",
        "additionalHalfwidth",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lower: { type: "number" },
        upper: { type: "number" },
        totalHalfwidth: { type: "number" },
      },
      required: ["lower", "upper", "totalHalfwidth"],
    },
    ports: {
      inputs: [
        {
          id: "pickedTime",
          label: "Picked Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleInterval",
          label: "Sample Interval",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "analystHalfwidth",
          label: "Analyst Halfwidth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "additionalHalfwidth",
          label: "Additional Halfwidth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "lower", label: "Lower", valueType: { type: "number" } },
        { id: "upper", label: "Upper", valueType: { type: "number" } },
        {
          id: "totalHalfwidth",
          label: "Total Halfwidth",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = seismicPickTimePrecisionBudgetTool.execute;
export default seismicPickTimePrecisionBudgetTool;
