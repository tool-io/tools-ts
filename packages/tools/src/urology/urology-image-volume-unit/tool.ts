import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volume: number;
  readonly inputIsCubicMillimeters: boolean;
};
export type Output = {
  readonly cubicMillimeters: number;
  readonly milliliters: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volume: { type: "number", minimum: 0 },
    inputIsCubicMillimeters: { type: "boolean" },
  },
  required: ["volume", "inputIsCubicMillimeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cubicMillimeters: { type: "number" },
    milliliters: { type: "number" },
  },
  required: ["cubicMillimeters", "milliliters"],
} as const;
/** Convert an explicit image-derived volume between cubic millimeters and milliliters without estimating an organ volume. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volume, inputIsCubicMillimeters } = request;
  const compute = (): Output => {
    H.domain(volume >= 0, "volume");
    return {
      cubicMillimeters: inputIsCubicMillimeters ? volume : volume * 1000,
      milliliters: inputIsCubicMillimeters ? volume / 1000 : volume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { volume: 5000, inputIsCubicMillimeters: true },
  output: { cubicMillimeters: 5000, milliliters: 5 },
} satisfies ToolExample<Input, Output>;
export const urologyImageVolumeUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["urology", "health and medicine"],
      keywords: ["urology", "health and medicine"],
    },
    id: "urology/urology-image-volume-unit",
    title: "Urology Image Volume Unit",
    description:
      "Convert an explicit image-derived volume between cubic millimeters and milliliters without estimating an organ volume.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volume: { type: "number", minimum: 0 },
        inputIsCubicMillimeters: { type: "boolean" },
      },
      required: ["volume", "inputIsCubicMillimeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cubicMillimeters: { type: "number" },
        milliliters: { type: "number" },
      },
      required: ["cubicMillimeters", "milliliters"],
    },
    ports: {
      inputs: [
        {
          id: "volume",
          label: "Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inputIsCubicMillimeters",
          label: "Input Is Cubic Millimeters",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "cubicMillimeters",
          label: "Cubic Millimeters",
          valueType: { type: "number" },
        },
        {
          id: "milliliters",
          label: "Milliliters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = urologyImageVolumeUnitTool.execute;
export default urologyImageVolumeUnitTool;
