import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousValue: number;
  readonly currentValue: number;
  readonly previousTime: number;
  readonly currentTime: number;
  readonly divideByGap: boolean;
};
export type Output = {
  readonly difference: number;
  readonly elapsed: number;
  readonly result: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousValue: { type: "number" },
    currentValue: { type: "number" },
    previousTime: { type: "number" },
    currentTime: { type: "number" },
    divideByGap: { type: "boolean" },
  },
  required: [
    "previousValue",
    "currentValue",
    "previousTime",
    "currentTime",
    "divideByGap",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    difference: { type: "number" },
    elapsed: { type: "number" },
    result: { type: "number" },
  },
  required: ["difference", "elapsed", "result"],
} as const;
/** Calculate panel timegap difference sign from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    previousValue,
    currentValue,
    previousTime,
    currentTime,
    divideByGap,
  } = request;
  const compute = (): Output => {
    H.domain(currentTime > previousTime);
    return {
      difference: currentValue - previousValue,
      elapsed: currentTime - previousTime,
      result: divideByGap
        ? (currentValue - previousValue) / (currentTime - previousTime)
        : currentValue - previousValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousValue: 10,
    currentValue: 16,
    previousTime: 1,
    currentTime: 3,
    divideByGap: true,
  },
  output: { difference: 6, elapsed: 2, result: 3 },
} satisfies ToolExample<Input, Output>;
export const panelTimegapDifferenceSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/panel-timegap-difference-sign",
    title: "Panel Timegap Difference Sign Tool",
    description:
      "Calculate panel timegap difference sign from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousValue: { type: "number" },
        currentValue: { type: "number" },
        previousTime: { type: "number" },
        currentTime: { type: "number" },
        divideByGap: { type: "boolean" },
      },
      required: [
        "previousValue",
        "currentValue",
        "previousTime",
        "currentTime",
        "divideByGap",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        difference: { type: "number" },
        elapsed: { type: "number" },
        result: { type: "number" },
      },
      required: ["difference", "elapsed", "result"],
    },
    ports: {
      inputs: [
        {
          id: "previousValue",
          label: "Previous Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentValue",
          label: "Current Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "previousTime",
          label: "Previous Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentTime",
          label: "Current Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "divideByGap",
          label: "Divide By Gap",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        { id: "result", label: "Result", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = panelTimegapDifferenceSignTool.execute;
export default panelTimegapDifferenceSignTool;
