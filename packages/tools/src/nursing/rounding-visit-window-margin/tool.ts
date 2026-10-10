import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visitTime: number;
  readonly windowStart: number;
  readonly windowEnd: number;
};
export type Output = {
  readonly lowerMargin: number;
  readonly upperMargin: number;
  readonly withinWindow: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visitTime: { type: "number" },
    windowStart: { type: "number" },
    windowEnd: { type: "number" },
  },
  required: ["visitTime", "windowStart", "windowEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerMargin: { type: "number" },
    upperMargin: { type: "number" },
    withinWindow: { type: "boolean" },
  },
  required: ["lowerMargin", "upperMargin", "withinWindow"],
} as const;
/** Compare an explicit rounding-visit time with a supplied inclusive observation window without selecting care frequency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visitTime, windowStart, windowEnd } = request;
  const compute = (): Output => {
    H.domain(windowEnd >= windowStart, "windowEnd");
    return {
      lowerMargin: visitTime - windowStart,
      upperMargin: windowEnd - visitTime,
      withinWindow: visitTime >= windowStart && visitTime <= windowEnd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { visitTime: 15, windowStart: 10, windowEnd: 20 },
  output: { lowerMargin: 5, upperMargin: 5, withinWindow: true },
} satisfies ToolExample<Input, Output>;
export const roundingVisitWindowMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["nursing", "health and medicine"],
      keywords: ["nursing", "health and medicine"],
    },
    id: "nursing/rounding-visit-window-margin",
    title: "Rounding Visit Window Margin",
    description:
      "Compare an explicit rounding-visit time with a supplied inclusive observation window without selecting care frequency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visitTime: { type: "number" },
        windowStart: { type: "number" },
        windowEnd: { type: "number" },
      },
      required: ["visitTime", "windowStart", "windowEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerMargin: { type: "number" },
        upperMargin: { type: "number" },
        withinWindow: { type: "boolean" },
      },
      required: ["lowerMargin", "upperMargin", "withinWindow"],
    },
    ports: {
      inputs: [
        {
          id: "visitTime",
          label: "Visit Time",
          required: true,
          valueType: { type: "number" },
        },
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
      ],
      outputs: [
        {
          id: "lowerMargin",
          label: "Lower Margin",
          valueType: { type: "number" },
        },
        {
          id: "upperMargin",
          label: "Upper Margin",
          valueType: { type: "number" },
        },
        {
          id: "withinWindow",
          label: "Within Window",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = roundingVisitWindowMarginTool.execute;
export default roundingVisitWindowMarginTool;
