import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly origin: number;
  readonly resolution: number;
};
export type Output = {
  readonly index: number;
  readonly lower: number;
  readonly upper: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    origin: { type: "number" },
    resolution: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["value", "origin", "resolution"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    index: { type: "integer" },
    lower: { type: "number" },
    upper: { type: "number" },
  },
  required: ["index", "lower", "upper"],
} as const;
/** Calculate numeric feature caller resolution bin from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, origin, resolution } = request;
  const compute = (): Output => {
    H.positive(resolution);
    return {
      index: Math.floor((value - origin) / resolution),
      lower: origin + resolution * Math.floor((value - origin) / resolution),
      upper:
        origin + resolution * (Math.floor((value - origin) / resolution) + 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 5.5, origin: 0, resolution: 2 },
  output: { index: 2, lower: 4, upper: 6 },
} satisfies ToolExample<Input, Output>;
export const numericFeatureCallerResolutionBinTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/numeric-feature-caller-resolution-bin",
    title: "Numeric Feature Caller Resolution Bin Tool",
    description:
      "Calculate numeric feature caller resolution bin from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        origin: { type: "number" },
        resolution: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["value", "origin", "resolution"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        index: { type: "integer" },
        lower: { type: "number" },
        upper: { type: "number" },
      },
      required: ["index", "lower", "upper"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "resolution",
          label: "Resolution",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "index", label: "Index", valueType: { type: "integer" } },
        { id: "lower", label: "Lower", valueType: { type: "number" } },
        { id: "upper", label: "Upper", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = numericFeatureCallerResolutionBinTool.execute;
export default numericFeatureCallerResolutionBinTool;
