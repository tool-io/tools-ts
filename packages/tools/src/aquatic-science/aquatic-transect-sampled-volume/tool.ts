import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly transectLengthMeters: number;
  readonly sampledWidthMeters: number;
  readonly sampledDepthMeters: number;
};
export type Output = { readonly sampledVolumeCubicMeters: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transectLengthMeters: { type: "number", minimum: 0 },
    sampledWidthMeters: { type: "number", minimum: 0 },
    sampledDepthMeters: { type: "number", minimum: 0 },
  },
  required: [
    "transectLengthMeters",
    "sampledWidthMeters",
    "sampledDepthMeters",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sampledVolumeCubicMeters: { type: "number" } },
  required: ["sampledVolumeCubicMeters"],
} as const;
/** Compute an explicitly rectangular sampled transect volume without inferring capture or detection efficiency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { transectLengthMeters, sampledWidthMeters, sampledDepthMeters } =
    request;
  const compute = (): Output => {
    H.domain(
      transectLengthMeters >= 0 &&
        sampledWidthMeters >= 0 &&
        sampledDepthMeters >= 0,
      "transectLengthMeters",
    );
    return {
      sampledVolumeCubicMeters:
        transectLengthMeters * sampledWidthMeters * sampledDepthMeters,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    transectLengthMeters: 100,
    sampledWidthMeters: 2,
    sampledDepthMeters: 0.5,
  },
  output: { sampledVolumeCubicMeters: 100 },
} satisfies ToolExample<Input, Output>;
export const aquaticTransectSampledVolumeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "aquatic-science",
        "aquatic science",
        "earth and environmental sciences",
      ],
      keywords: ["aquatic science", "earth and environmental sciences"],
    },
    id: "aquatic-science/aquatic-transect-sampled-volume",
    title: "Aquatic Transect Sampled Volume",
    description:
      "Compute an explicitly rectangular sampled transect volume without inferring capture or detection efficiency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        transectLengthMeters: { type: "number", minimum: 0 },
        sampledWidthMeters: { type: "number", minimum: 0 },
        sampledDepthMeters: { type: "number", minimum: 0 },
      },
      required: [
        "transectLengthMeters",
        "sampledWidthMeters",
        "sampledDepthMeters",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sampledVolumeCubicMeters: { type: "number" } },
      required: ["sampledVolumeCubicMeters"],
    },
    ports: {
      inputs: [
        {
          id: "transectLengthMeters",
          label: "Transect Length Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampledWidthMeters",
          label: "Sampled Width Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampledDepthMeters",
          label: "Sampled Depth Meters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sampledVolumeCubicMeters",
          label: "Sampled Volume Cubic Meters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = aquaticTransectSampledVolumeTool.execute;
export default aquaticTransectSampledVolumeTool;
