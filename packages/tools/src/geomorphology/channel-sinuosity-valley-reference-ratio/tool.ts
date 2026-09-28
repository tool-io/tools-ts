import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly channelLength: number;
  readonly valleyLength: number;
  readonly straightDistance: number;
};
export type Output = {
  readonly valleySinuosity: number;
  readonly directSinuosity: number;
  readonly valleyTortuosity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    channelLength: { type: "number" },
    valleyLength: { type: "number" },
    straightDistance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["channelLength", "valleyLength", "straightDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valleySinuosity: { type: "number" },
    directSinuosity: { type: "number" },
    valleyTortuosity: { type: "number" },
  },
  required: ["valleySinuosity", "directSinuosity", "valleyTortuosity"],
} as const;
/** Distinguish channel/valley sinuosity from channel/direct endpoint ratio in a consistent planar projection. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { channelLength, valleyLength, straightDistance } = request;
  const compute = (): Output => {
    H.positive(straightDistance);
    H.domain(valleyLength >= straightDistance && channelLength >= valleyLength);
    return {
      valleySinuosity: channelLength / valleyLength,
      directSinuosity: channelLength / straightDistance,
      valleyTortuosity: valleyLength / straightDistance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { channelLength: 150, valleyLength: 120, straightDistance: 100 },
  output: {
    valleySinuosity: 1.25,
    directSinuosity: 1.5,
    valleyTortuosity: 1.2,
  },
} satisfies ToolExample<Input, Output>;
export const channelSinuosityValleyReferenceRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geomorphology/channel-sinuosity-valley-reference-ratio",
      title: "Channel Sinuosity Valley Reference Ratio Tool",
      description:
        "Distinguish channel/valley sinuosity from channel/direct endpoint ratio in a consistent planar projection.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          channelLength: { type: "number" },
          valleyLength: { type: "number" },
          straightDistance: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["channelLength", "valleyLength", "straightDistance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          valleySinuosity: { type: "number" },
          directSinuosity: { type: "number" },
          valleyTortuosity: { type: "number" },
        },
        required: ["valleySinuosity", "directSinuosity", "valleyTortuosity"],
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
          {
            id: "straightDistance",
            label: "Straight Distance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "valleySinuosity",
            label: "Valley Sinuosity",
            valueType: { type: "number" },
          },
          {
            id: "directSinuosity",
            label: "Direct Sinuosity",
            valueType: { type: "number" },
          },
          {
            id: "valleyTortuosity",
            label: "Valley Tortuosity",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = channelSinuosityValleyReferenceRatioTool.execute;
export default channelSinuosityValleyReferenceRatioTool;
