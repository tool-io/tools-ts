import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frameCenterCoordinate: number;
  readonly opticalCenterCoordinate: number;
  readonly positiveMeansTemporal: boolean;
};
export type Output = { readonly temporalPositiveDecentration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frameCenterCoordinate: { type: "number" },
    opticalCenterCoordinate: { type: "number" },
    positiveMeansTemporal: { type: "boolean" },
  },
  required: [
    "frameCenterCoordinate",
    "opticalCenterCoordinate",
    "positiveMeansTemporal",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { temporalPositiveDecentration: { type: "number" } },
  required: ["temporalPositiveDecentration"],
} as const;
/** Reference an explicit optical-center coordinate to a supplied frame center and sign convention without selecting lens placement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    frameCenterCoordinate,
    opticalCenterCoordinate,
    positiveMeansTemporal,
  } = request;
  const compute = (): Output => {
    return {
      temporalPositiveDecentration:
        (opticalCenterCoordinate - frameCenterCoordinate) *
        (positiveMeansTemporal ? 1 : -1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    frameCenterCoordinate: 30,
    opticalCenterCoordinate: 32,
    positiveMeansTemporal: true,
  },
  output: { temporalPositiveDecentration: 2 },
} satisfies ToolExample<Input, Output>;
export const frameOpticalCenterDecentrationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["optometry", "health and medicine"],
      keywords: ["optometry", "health and medicine"],
    },
    id: "optometry/frame-optical-center-decentration",
    title: "Frame Optical Center Decentration",
    description:
      "Reference an explicit optical-center coordinate to a supplied frame center and sign convention without selecting lens placement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frameCenterCoordinate: { type: "number" },
        opticalCenterCoordinate: { type: "number" },
        positiveMeansTemporal: { type: "boolean" },
      },
      required: [
        "frameCenterCoordinate",
        "opticalCenterCoordinate",
        "positiveMeansTemporal",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { temporalPositiveDecentration: { type: "number" } },
      required: ["temporalPositiveDecentration"],
    },
    ports: {
      inputs: [
        {
          id: "frameCenterCoordinate",
          label: "Frame Center Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "opticalCenterCoordinate",
          label: "Optical Center Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveMeansTemporal",
          label: "Positive Means Temporal",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "temporalPositiveDecentration",
          label: "Temporal Positive Decentration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = frameOpticalCenterDecentrationTool.execute;
export default frameOpticalCenterDecentrationTool;
