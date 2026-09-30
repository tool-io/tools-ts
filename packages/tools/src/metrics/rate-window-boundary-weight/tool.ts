import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly windowStart: number;
  readonly windowEnd: number;
  readonly boundary: number;
};
export type Output = {
  readonly earlierWeight: number;
  readonly laterWeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    windowStart: { type: "number" },
    windowEnd: { type: "number" },
    boundary: { type: "number" },
  },
  required: ["windowStart", "windowEnd", "boundary"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earlierWeight: { type: "number" },
    laterWeight: { type: "number" },
  },
  required: ["earlierWeight", "laterWeight"],
} as const;
/** Split a uniform rate-window exposure at an explicit boundary; point membership has zero duration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { windowStart, windowEnd, boundary } = request;
  const compute = (): Output => {
    H.domain(windowEnd > windowStart);
    return {
      earlierWeight:
        boundary <= windowStart
          ? 0
          : boundary >= windowEnd
            ? 1
            : (boundary - windowStart) / (windowEnd - windowStart),
      laterWeight:
        boundary <= windowStart
          ? 1
          : boundary >= windowEnd
            ? 0
            : (windowEnd - boundary) / (windowEnd - windowStart),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { windowStart: 0, windowEnd: 10, boundary: 4 },
  output: { earlierWeight: 0.4, laterWeight: 0.6 },
} satisfies ToolExample<Input, Output>;
export const rateWindowBoundaryWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/rate-window-boundary-weight",
    title: "Rate Window Boundary Weight Tool",
    description:
      "Split a uniform rate-window exposure at an explicit boundary; point membership has zero duration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        windowStart: { type: "number" },
        windowEnd: { type: "number" },
        boundary: { type: "number" },
      },
      required: ["windowStart", "windowEnd", "boundary"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earlierWeight: { type: "number" },
        laterWeight: { type: "number" },
      },
      required: ["earlierWeight", "laterWeight"],
    },
    ports: {
      inputs: [
        {
          id: "windowStart",
          label: "Window Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowEnd",
          label: "Window End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "boundary",
          label: "Boundary",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "earlierWeight",
          label: "Earlier Weight",
          valueType: { type: "number" },
        },
        {
          id: "laterWeight",
          label: "Later Weight",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rateWindowBoundaryWeightTool.execute;
export default rateWindowBoundaryWeightTool;
