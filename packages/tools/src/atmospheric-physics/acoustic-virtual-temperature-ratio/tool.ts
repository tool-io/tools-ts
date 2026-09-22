import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly soundSpeed: number;
  readonly suppliedGamma: number;
  readonly suppliedGasConstant: number;
  readonly referenceKelvin: number;
};
export type Output = {
  readonly acousticTemperatureKelvin: number;
  readonly ratio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    soundSpeed: { type: "number", minimum: 0 },
    suppliedGamma: { type: "number", exclusiveMinimum: 0 },
    suppliedGasConstant: { type: "number", exclusiveMinimum: 0 },
    referenceKelvin: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "soundSpeed",
    "suppliedGamma",
    "suppliedGasConstant",
    "referenceKelvin",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    acousticTemperatureKelvin: { type: "number" },
    ratio: { type: "number" },
  },
  required: ["acousticTemperatureKelvin", "ratio"],
} as const;
/** Ideal acoustic temperature from c²/(gamma*R) with fully supplied constants, without humidity or wind correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { soundSpeed, suppliedGamma, suppliedGasConstant, referenceKelvin } =
    request;
  const compute = (): Output => {
    H.domain(soundSpeed >= 0);
    H.positive(suppliedGamma);
    H.positive(suppliedGasConstant);
    H.positive(referenceKelvin);
    return {
      acousticTemperatureKelvin:
        soundSpeed ** 2 / (suppliedGamma * suppliedGasConstant),
      ratio:
        soundSpeed ** 2 /
        (suppliedGamma * suppliedGasConstant * referenceKelvin),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    soundSpeed: 300,
    suppliedGamma: 1.5,
    suppliedGasConstant: 200,
    referenceKelvin: 300,
  },
  output: { acousticTemperatureKelvin: 300, ratio: 1 },
} satisfies ToolExample<Input, Output>;
export const acousticVirtualTemperatureRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-physics/acoustic-virtual-temperature-ratio",
    title: "Acoustic Virtual Temperature Ratio Tool",
    description:
      "Ideal acoustic temperature from c²/(gamma*R) with fully supplied constants, without humidity or wind correction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        soundSpeed: { type: "number", minimum: 0 },
        suppliedGamma: { type: "number", exclusiveMinimum: 0 },
        suppliedGasConstant: { type: "number", exclusiveMinimum: 0 },
        referenceKelvin: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "soundSpeed",
        "suppliedGamma",
        "suppliedGasConstant",
        "referenceKelvin",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        acousticTemperatureKelvin: { type: "number" },
        ratio: { type: "number" },
      },
      required: ["acousticTemperatureKelvin", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "soundSpeed",
          label: "Sound Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedGamma",
          label: "Supplied Gamma",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedGasConstant",
          label: "Supplied Gas Constant",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceKelvin",
          label: "Reference Kelvin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "acousticTemperatureKelvin",
          label: "Acoustic Temperature Kelvin",
          valueType: { type: "number" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = acousticVirtualTemperatureRatioTool.execute;
export default acousticVirtualTemperatureRatioTool;
