import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly channelLength: number;
  readonly valleyLength: number;
};
export type Output = {
  readonly sinuosity: number;
  readonly excessLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    channelLength: { type: "number" },
    valleyLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["channelLength", "valleyLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sinuosity: { type: "number" },
    excessLength: { type: "number" },
  },
  required: ["sinuosity", "excessLength"],
} as const;
/** Calculate channel sinuosity distance factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { channelLength, valleyLength } = request;
  const compute = (): Output => {
    H.positive(valleyLength);
    H.domain(channelLength >= valleyLength);
    return {
      sinuosity: channelLength / valleyLength,
      excessLength: channelLength - valleyLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { channelLength: 15, valleyLength: 10 },
  output: { sinuosity: 1.5, excessLength: 5 },
} satisfies ToolExample<Input, Output>;
export const channelSinuosityDistanceFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/channel-sinuosity-distance-factor",
    title: "Channel Sinuosity Distance Factor Tool",
    description:
      "Calculate channel sinuosity distance factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        channelLength: { type: "number" },
        valleyLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["channelLength", "valleyLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sinuosity: { type: "number" },
        excessLength: { type: "number" },
      },
      required: ["sinuosity", "excessLength"],
    },
    ports: {
      inputs: [
        {
          id: "channelLength",
          label: "Channel Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "valleyLength",
          label: "Valley Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "sinuosity", label: "Sinuosity", valueType: { type: "number" } },
        {
          id: "excessLength",
          label: "Excess Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = channelSinuosityDistanceFactorTool.execute;
export default channelSinuosityDistanceFactorTool;
