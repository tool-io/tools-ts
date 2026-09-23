import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reported: number;
  readonly counted: number;
  readonly countHalfwidth: number;
};
export type Output = {
  readonly nominalGap: number;
  readonly minimumGap: number;
  readonly maximumGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reported: { type: "number", minimum: 0 },
    counted: { type: "number", minimum: 0 },
    countHalfwidth: { type: "number", minimum: 0 },
  },
  required: ["reported", "counted", "countHalfwidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalGap: { type: "number" },
    minimumGap: { type: "number" },
    maximumGap: { type: "number" },
  },
  required: ["nominalGap", "minimumGap", "maximumGap"],
} as const;
/** Calculate biosafety reported actual quantity gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reported, counted, countHalfwidth } = request;
  const compute = (): Output => {
    H.domain(reported >= 0 && counted >= 0 && countHalfwidth >= 0);
    return {
      nominalGap: counted - reported,
      minimumGap: counted - reported - countHalfwidth,
      maximumGap: counted - reported + countHalfwidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reported: 100, counted: 95, countHalfwidth: 2 },
  output: { nominalGap: -5, minimumGap: -7, maximumGap: -3 },
} satisfies ToolExample<Input, Output>;
export const biosafetyReportedActualQuantityGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosafety/biosafety-reported-actual-quantity-gap",
    title: "Biosafety Reported Actual Quantity Gap Tool",
    description:
      "Calculate biosafety reported actual quantity gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reported: { type: "number", minimum: 0 },
        counted: { type: "number", minimum: 0 },
        countHalfwidth: { type: "number", minimum: 0 },
      },
      required: ["reported", "counted", "countHalfwidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalGap: { type: "number" },
        minimumGap: { type: "number" },
        maximumGap: { type: "number" },
      },
      required: ["nominalGap", "minimumGap", "maximumGap"],
    },
    ports: {
      inputs: [
        {
          id: "reported",
          label: "Reported",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "counted",
          label: "Counted",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "countHalfwidth",
          label: "Count Halfwidth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "nominalGap",
          label: "Nominal Gap",
          valueType: { type: "number" },
        },
        {
          id: "minimumGap",
          label: "Minimum Gap",
          valueType: { type: "number" },
        },
        {
          id: "maximumGap",
          label: "Maximum Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = biosafetyReportedActualQuantityGapTool.execute;
export default biosafetyReportedActualQuantityGapTool;
