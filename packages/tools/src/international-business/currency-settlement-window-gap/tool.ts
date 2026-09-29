import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly settledTime: number;
  readonly earliestAllowed: number;
  readonly latestAllowed: number;
  readonly suppliedClockOffset: number;
};
export type Output = {
  readonly lowerMargin: number;
  readonly upperMargin: number;
  readonly inside: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    settledTime: { type: "number" },
    earliestAllowed: { type: "number" },
    latestAllowed: { type: "number" },
    suppliedClockOffset: { type: "number" },
  },
  required: [
    "settledTime",
    "earliestAllowed",
    "latestAllowed",
    "suppliedClockOffset",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerMargin: { type: "number" },
    upperMargin: { type: "number" },
    inside: { type: "boolean" },
  },
  required: ["lowerMargin", "upperMargin", "inside"],
} as const;
/** Compare supplied settlement clocks/window bounds without selecting banking rules, holidays or legal deadlines. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { settledTime, earliestAllowed, latestAllowed, suppliedClockOffset } =
    request;
  const compute = (): Output => {
    H.domain(earliestAllowed <= latestAllowed);
    return {
      lowerMargin: settledTime - suppliedClockOffset - earliestAllowed,
      upperMargin: latestAllowed - settledTime + suppliedClockOffset,
      inside:
        settledTime - suppliedClockOffset >= earliestAllowed &&
        settledTime - suppliedClockOffset <= latestAllowed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    settledTime: 15,
    earliestAllowed: 10,
    latestAllowed: 20,
    suppliedClockOffset: 2,
  },
  output: { lowerMargin: 3, upperMargin: 7, inside: true },
} satisfies ToolExample<Input, Output>;
export const currencySettlementWindowGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-business/currency-settlement-window-gap",
    title: "Currency Settlement Window Gap Tool",
    description:
      "Compare supplied settlement clocks/window bounds without selecting banking rules, holidays or legal deadlines.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        settledTime: { type: "number" },
        earliestAllowed: { type: "number" },
        latestAllowed: { type: "number" },
        suppliedClockOffset: { type: "number" },
      },
      required: [
        "settledTime",
        "earliestAllowed",
        "latestAllowed",
        "suppliedClockOffset",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerMargin: { type: "number" },
        upperMargin: { type: "number" },
        inside: { type: "boolean" },
      },
      required: ["lowerMargin", "upperMargin", "inside"],
    },
    ports: {
      inputs: [
        {
          id: "settledTime",
          label: "Settled Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "earliestAllowed",
          label: "Earliest Allowed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "latestAllowed",
          label: "Latest Allowed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedClockOffset",
          label: "Supplied Clock Offset",
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
        { id: "inside", label: "Inside", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = currencySettlementWindowGapTool.execute;
export default currencySettlementWindowGapTool;
