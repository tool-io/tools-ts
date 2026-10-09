import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly widthPixels: number;
  readonly heightPixels: number;
  readonly micrometersPerPixelX: number;
  readonly micrometersPerPixelY: number;
};
export type Output = {
  readonly squareMicrometers: number;
  readonly squareMillimeters: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    widthPixels: { type: "integer", minimum: 1 },
    heightPixels: { type: "integer", minimum: 1 },
    micrometersPerPixelX: { type: "number", exclusiveMinimum: 0 },
    micrometersPerPixelY: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "widthPixels",
    "heightPixels",
    "micrometersPerPixelX",
    "micrometersPerPixelY",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    squareMicrometers: { type: "number" },
    squareMillimeters: { type: "number" },
  },
  required: ["squareMicrometers", "squareMillimeters"],
} as const;
/** Calculate rectangular microscopy field area using explicit axis calibrations without estimating tissue area. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    widthPixels,
    heightPixels,
    micrometersPerPixelX,
    micrometersPerPixelY,
  } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(widthPixels) &&
        widthPixels >= 1 &&
        widthPixels <= Number.MAX_SAFE_INTEGER,
      "widthPixels",
    ),
      widthPixels);
    (H.domain(
      Number.isSafeInteger(heightPixels) &&
        heightPixels >= 1 &&
        heightPixels <= Number.MAX_SAFE_INTEGER,
      "heightPixels",
    ),
      heightPixels);
    (H.domain(micrometersPerPixelX > 0, "micrometersPerPixelX"),
      micrometersPerPixelX);
    (H.domain(micrometersPerPixelY > 0, "micrometersPerPixelY"),
      micrometersPerPixelY);
    return (() => {
      const squareMicrometers =
        widthPixels *
        micrometersPerPixelX *
        heightPixels *
        micrometersPerPixelY;
      return {
        squareMicrometers,
        squareMillimeters: squareMicrometers / 1000000,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    widthPixels: 1000,
    heightPixels: 800,
    micrometersPerPixelX: 0.5,
    micrometersPerPixelY: 0.5,
  },
  output: { squareMicrometers: 200000, squareMillimeters: 0.2 },
} satisfies ToolExample<Input, Output>;
export const microscopyFieldAreaCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["histology", "biology"],
      keywords: ["histology", "biology"],
    },
    id: "histology/microscopy-field-area-crosswalk",
    title: "Microscopy Field Area Crosswalk",
    description:
      "Calculate rectangular microscopy field area using explicit axis calibrations without estimating tissue area.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        widthPixels: { type: "integer", minimum: 1 },
        heightPixels: { type: "integer", minimum: 1 },
        micrometersPerPixelX: { type: "number", exclusiveMinimum: 0 },
        micrometersPerPixelY: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "widthPixels",
        "heightPixels",
        "micrometersPerPixelX",
        "micrometersPerPixelY",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        squareMicrometers: { type: "number" },
        squareMillimeters: { type: "number" },
      },
      required: ["squareMicrometers", "squareMillimeters"],
    },
    ports: {
      inputs: [
        {
          id: "widthPixels",
          label: "Width Pixels",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "heightPixels",
          label: "Height Pixels",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "micrometersPerPixelX",
          label: "Micrometers Per Pixel X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "micrometersPerPixelY",
          label: "Micrometers Per Pixel Y",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "squareMicrometers",
          label: "Square Micrometers",
          valueType: { type: "number" },
        },
        {
          id: "squareMillimeters",
          label: "Square Millimeters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = microscopyFieldAreaCrosswalkTool.execute;
export default microscopyFieldAreaCrosswalkTool;
