import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly redOd: number;
  readonly greenOd: number;
  readonly blueOd: number;
  readonly coefficientRed: number;
  readonly coefficientGreen: number;
  readonly coefficientBlue: number;
};
export type Output = { readonly concentrationCoordinate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    redOd: { type: "number" },
    greenOd: { type: "number" },
    blueOd: { type: "number" },
    coefficientRed: { type: "number" },
    coefficientGreen: { type: "number" },
    coefficientBlue: { type: "number" },
  },
  required: [
    "redOd",
    "greenOd",
    "blueOd",
    "coefficientRed",
    "coefficientGreen",
    "coefficientBlue",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { concentrationCoordinate: { type: "number" } },
  required: ["concentrationCoordinate"],
} as const;
/** One supplied inverse-stain-matrix row dotted with optical-density channels; no stain basis estimation or RGB-to-OD calibration is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    redOd,
    greenOd,
    blueOd,
    coefficientRed,
    coefficientGreen,
    coefficientBlue,
  } = request;
  const compute = (): Output => {
    return {
      concentrationCoordinate:
        redOd * coefficientRed +
        greenOd * coefficientGreen +
        blueOd * coefficientBlue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    redOd: 0.2,
    greenOd: 0.4,
    blueOd: 0.1,
    coefficientRed: 1,
    coefficientGreen: 0.5,
    coefficientBlue: -1,
  },
  output: { concentrationCoordinate: 0.30000000000000004 },
} satisfies ToolExample<Input, Output>;
export const histologyStainDeconvolutionOneChannelTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "histology/histology-stain-deconvolution-one-channel-term",
      title: "Histology Stain Deconvolution One Channel Term Tool",
      description:
        "One supplied inverse-stain-matrix row dotted with optical-density channels; no stain basis estimation or RGB-to-OD calibration is inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          redOd: { type: "number" },
          greenOd: { type: "number" },
          blueOd: { type: "number" },
          coefficientRed: { type: "number" },
          coefficientGreen: { type: "number" },
          coefficientBlue: { type: "number" },
        },
        required: [
          "redOd",
          "greenOd",
          "blueOd",
          "coefficientRed",
          "coefficientGreen",
          "coefficientBlue",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { concentrationCoordinate: { type: "number" } },
        required: ["concentrationCoordinate"],
      },
      ports: {
        inputs: [
          {
            id: "redOd",
            label: "Red Od",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "greenOd",
            label: "Green Od",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "blueOd",
            label: "Blue Od",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "coefficientRed",
            label: "Coefficient Red",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "coefficientGreen",
            label: "Coefficient Green",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "coefficientBlue",
            label: "Coefficient Blue",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "concentrationCoordinate",
            label: "Concentration Coordinate",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = histologyStainDeconvolutionOneChannelTermTool.execute;
export default histologyStainDeconvolutionOneChannelTermTool;
