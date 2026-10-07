import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly volumeMilliliters: number };
export type Output = {
  readonly volumeCubicCentimeters: number;
  readonly volumeCubicMeters: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volumeMilliliters: { type: "number", minimum: 0 } },
  required: ["volumeMilliliters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volumeCubicCentimeters: { type: "number" },
    volumeCubicMeters: { type: "number" },
  },
  required: ["volumeCubicCentimeters", "volumeCubicMeters"],
} as const;
/** Convert an explicit nonnegative ear-canal volume from milliliters to cubic centimeters and cubic meters without interpreting measurements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volumeMilliliters } = request;
  const compute = (): Output => {
    H.domain(volumeMilliliters >= 0, "volumeMilliliters");
    return {
      volumeCubicCentimeters: volumeMilliliters,
      volumeCubicMeters: volumeMilliliters / 1000000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { volumeMilliliters: 1.5 },
  output: { volumeCubicCentimeters: 1.5, volumeCubicMeters: 0.0000015 },
} satisfies ToolExample<Input, Output>;
export const earCanalVolumeUnitprefixTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["audiology", "health and medicine"],
      keywords: ["audiology", "health and medicine"],
    },
    id: "audiology/ear-canal-volume-unit-prefix",
    title: "Ear Canal Volume Unit Prefix",
    description:
      "Convert an explicit nonnegative ear-canal volume from milliliters to cubic centimeters and cubic meters without interpreting measurements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { volumeMilliliters: { type: "number", minimum: 0 } },
      required: ["volumeMilliliters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volumeCubicCentimeters: { type: "number" },
        volumeCubicMeters: { type: "number" },
      },
      required: ["volumeCubicCentimeters", "volumeCubicMeters"],
    },
    ports: {
      inputs: [
        {
          id: "volumeMilliliters",
          label: "Volume Milliliters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "volumeCubicCentimeters",
          label: "Volume Cubic Centimeters",
          valueType: { type: "number" },
        },
        {
          id: "volumeCubicMeters",
          label: "Volume Cubic Meters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = earCanalVolumeUnitprefixTool.execute;
export default earCanalVolumeUnitprefixTool;
