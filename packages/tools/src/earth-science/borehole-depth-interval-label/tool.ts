import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly boreholeId: string;
  readonly fromDepth: number;
  readonly toDepth: number;
  readonly unitText: string;
};
export type Output = {
  readonly label: string;
  readonly intervalLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    boreholeId: { type: "string", maxLength: 8192, minLength: 1 },
    fromDepth: { type: "number", minimum: 0 },
    toDepth: { type: "number" },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["boreholeId", "fromDepth", "toDepth", "unitText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    intervalLength: { type: "number" },
  },
  required: ["label", "intervalLength"],
} as const;
/** Label an explicit downward-positive borehole interval and its length without inferring sampled material. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { boreholeId, fromDepth, toDepth, unitText } = request;
  const compute = (): Output => {
    H.domain(boreholeId.length > 0 && unitText.length > 0, "boreholeId");
    H.domain(fromDepth >= 0 && toDepth >= fromDepth, "fromDepth");
    return {
      label: boreholeId + "; " + fromDepth + "–" + toDepth + " " + unitText,
      intervalLength: toDepth - fromDepth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { boreholeId: "BH17", fromDepth: 10, toDepth: 15, unitText: "m" },
  output: { label: "BH17; 10–15 m", intervalLength: 5 },
} satisfies ToolExample<Input, Output>;
export const boreholeDepthIntervalLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "earth-science",
        "earth science",
        "earth and environmental sciences",
      ],
      keywords: ["earth science", "earth and environmental sciences"],
    },
    id: "earth-science/borehole-depth-interval-label",
    title: "Borehole Depth Interval Label",
    description:
      "Label an explicit downward-positive borehole interval and its length without inferring sampled material.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        boreholeId: { type: "string", maxLength: 8192, minLength: 1 },
        fromDepth: { type: "number", minimum: 0 },
        toDepth: { type: "number" },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["boreholeId", "fromDepth", "toDepth", "unitText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        intervalLength: { type: "number" },
      },
      required: ["label", "intervalLength"],
    },
    ports: {
      inputs: [
        {
          id: "boreholeId",
          label: "Borehole Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "fromDepth",
          label: "From Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "toDepth",
          label: "To Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitText",
          label: "Unit Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        {
          id: "intervalLength",
          label: "Interval Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = boreholeDepthIntervalLabelTool.execute;
export default boreholeDepthIntervalLabelTool;
