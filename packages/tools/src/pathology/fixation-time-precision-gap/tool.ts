import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earliestStart: number;
  readonly latestStart: number;
  readonly endAt: number;
};
export type Output = {
  readonly minimumDuration: number;
  readonly maximumDuration: number;
  readonly width: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earliestStart: { type: "number" },
    latestStart: { type: "number" },
    endAt: { type: "number" },
  },
  required: ["earliestStart", "latestStart", "endAt"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimumDuration: { type: "number" },
    maximumDuration: { type: "number" },
    width: { type: "number" },
  },
  required: ["minimumDuration", "maximumDuration", "width"],
} as const;
/** Calculate fixation time precision gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earliestStart, latestStart, endAt } = request;
  const compute = (): Output => {
    H.domain(latestStart >= earliestStart && endAt >= latestStart);
    return {
      minimumDuration: endAt - latestStart,
      maximumDuration: endAt - earliestStart,
      width: latestStart - earliestStart,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { earliestStart: 10, latestStart: 12, endAt: 20 },
  output: { minimumDuration: 8, maximumDuration: 10, width: 2 },
} satisfies ToolExample<Input, Output>;
export const fixationTimePrecisionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pathology/fixation-time-precision-gap",
    title: "Fixation Time Precision Gap Tool",
    description:
      "Calculate fixation time precision gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earliestStart: { type: "number" },
        latestStart: { type: "number" },
        endAt: { type: "number" },
      },
      required: ["earliestStart", "latestStart", "endAt"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minimumDuration: { type: "number" },
        maximumDuration: { type: "number" },
        width: { type: "number" },
      },
      required: ["minimumDuration", "maximumDuration", "width"],
    },
    ports: {
      inputs: [
        {
          id: "earliestStart",
          label: "Earliest Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "latestStart",
          label: "Latest Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endAt",
          label: "End At",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "minimumDuration",
          label: "Minimum Duration",
          valueType: { type: "number" },
        },
        {
          id: "maximumDuration",
          label: "Maximum Duration",
          valueType: { type: "number" },
        },
        { id: "width", label: "Width", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = fixationTimePrecisionGapTool.execute;
export default fixationTimePrecisionGapTool;
