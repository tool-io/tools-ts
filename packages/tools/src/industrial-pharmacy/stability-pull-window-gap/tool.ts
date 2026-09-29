import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actualAt: number;
  readonly earliest: number;
  readonly latest: number;
};
export type Output = {
  readonly lowerSlack: number;
  readonly upperSlack: number;
  readonly withinWindow: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualAt: { type: "number" },
    earliest: { type: "number" },
    latest: { type: "number" },
  },
  required: ["actualAt", "earliest", "latest"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerSlack: { type: "number" },
    upperSlack: { type: "number" },
    withinWindow: { type: "boolean" },
  },
  required: ["lowerSlack", "upperSlack", "withinWindow"],
} as const;
/** Compare supplied research pull times with an explicit inclusive schedule window. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actualAt, earliest, latest } = request;
  const compute = (): Output => {
    H.domain(latest >= earliest);
    return {
      lowerSlack: actualAt - earliest,
      upperSlack: latest - actualAt,
      withinWindow: actualAt >= earliest && actualAt <= latest,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { actualAt: 15, earliest: 10, latest: 20 },
  output: { lowerSlack: 5, upperSlack: 5, withinWindow: true },
} satisfies ToolExample<Input, Output>;
export const stabilityPullWindowGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-pharmacy/stability-pull-window-gap",
    title: "Stability Pull Window Gap Tool",
    description:
      "Compare supplied research pull times with an explicit inclusive schedule window.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualAt: { type: "number" },
        earliest: { type: "number" },
        latest: { type: "number" },
      },
      required: ["actualAt", "earliest", "latest"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerSlack: { type: "number" },
        upperSlack: { type: "number" },
        withinWindow: { type: "boolean" },
      },
      required: ["lowerSlack", "upperSlack", "withinWindow"],
    },
    ports: {
      inputs: [
        {
          id: "actualAt",
          label: "Actual At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "earliest",
          label: "Earliest",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "latest",
          label: "Latest",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lowerSlack",
          label: "Lower Slack",
          valueType: { type: "number" },
        },
        {
          id: "upperSlack",
          label: "Upper Slack",
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
export const run = stabilityPullWindowGapTool.execute;
export default stabilityPullWindowGapTool;
