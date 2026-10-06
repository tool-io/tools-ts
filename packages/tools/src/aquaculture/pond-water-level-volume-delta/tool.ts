import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly surfaceAreaSquareMeters: number;
  readonly beforeLevelMeters: number;
  readonly afterLevelMeters: number;
};
export type Output = { readonly volumeChangeCubicMeters: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surfaceAreaSquareMeters: { type: "number", minimum: 0 },
    beforeLevelMeters: { type: "number" },
    afterLevelMeters: { type: "number" },
  },
  required: [
    "surfaceAreaSquareMeters",
    "beforeLevelMeters",
    "afterLevelMeters",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volumeChangeCubicMeters: { type: "number" } },
  required: ["volumeChangeCubicMeters"],
} as const;
/** Convert a measured pond level change to signed volume change under an explicit constant surface-area approximation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { surfaceAreaSquareMeters, beforeLevelMeters, afterLevelMeters } =
    request;
  const compute = (): Output => {
    H.domain(surfaceAreaSquareMeters >= 0, "surfaceAreaSquareMeters");
    return {
      volumeChangeCubicMeters:
        surfaceAreaSquareMeters * (afterLevelMeters - beforeLevelMeters),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    surfaceAreaSquareMeters: 200,
    beforeLevelMeters: 1.2,
    afterLevelMeters: 1.3,
  },
  output: { volumeChangeCubicMeters: 20.000000000000018 },
} satisfies ToolExample<Input, Output>;
export const pondWaterLevelVolumeDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["aquaculture", "agriculture"],
      keywords: ["aquaculture", "agriculture"],
    },
    id: "aquaculture/pond-water-level-volume-delta",
    title: "Pond Water Level Volume Delta",
    description:
      "Convert a measured pond level change to signed volume change under an explicit constant surface-area approximation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        surfaceAreaSquareMeters: { type: "number", minimum: 0 },
        beforeLevelMeters: { type: "number" },
        afterLevelMeters: { type: "number" },
      },
      required: [
        "surfaceAreaSquareMeters",
        "beforeLevelMeters",
        "afterLevelMeters",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { volumeChangeCubicMeters: { type: "number" } },
      required: ["volumeChangeCubicMeters"],
    },
    ports: {
      inputs: [
        {
          id: "surfaceAreaSquareMeters",
          label: "Surface Area Square Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "beforeLevelMeters",
          label: "Before Level Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "afterLevelMeters",
          label: "After Level Meters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "volumeChangeCubicMeters",
          label: "Volume Change Cubic Meters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pondWaterLevelVolumeDeltaTool.execute;
export default pondWaterLevelVolumeDeltaTool;
