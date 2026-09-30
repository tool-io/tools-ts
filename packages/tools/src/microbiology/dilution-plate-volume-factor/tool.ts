import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedDilutionFraction: number;
  readonly platedVolume: number;
  readonly suppliedVolumeUnitFactor: number;
};
export type Output = {
  readonly effectiveSourceVolume: number;
  readonly inverseVolumeFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedDilutionFraction: {
      type: "number",
      exclusiveMinimum: 0,
      maximum: 1,
    },
    platedVolume: { type: "number", exclusiveMinimum: 0 },
    suppliedVolumeUnitFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "suppliedDilutionFraction",
    "platedVolume",
    "suppliedVolumeUnitFactor",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveSourceVolume: { type: "number" },
    inverseVolumeFactor: { type: "number" },
  },
  required: ["effectiveSourceVolume", "inverseVolumeFactor"],
} as const;
/** Arithmetic for already supplied benign assay volume/dilution metadata; no organism or laboratory procedure instructions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedDilutionFraction, platedVolume, suppliedVolumeUnitFactor } =
    request;
  const compute = (): Output => {
    H.domain(suppliedDilutionFraction > 0 && suppliedDilutionFraction <= 1);
    H.positive(platedVolume);
    H.positive(suppliedVolumeUnitFactor);
    return {
      effectiveSourceVolume:
        suppliedDilutionFraction * platedVolume * suppliedVolumeUnitFactor,
      inverseVolumeFactor:
        1 /
        (suppliedDilutionFraction * platedVolume * suppliedVolumeUnitFactor),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    suppliedDilutionFraction: 0.1,
    platedVolume: 2,
    suppliedVolumeUnitFactor: 1,
  },
  output: { effectiveSourceVolume: 0.2, inverseVolumeFactor: 5 },
} satisfies ToolExample<Input, Output>;
export const dilutionPlateVolumeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microbiology/dilution-plate-volume-factor",
    title: "Dilution Plate Volume Factor Tool",
    description:
      "Arithmetic for already supplied benign assay volume/dilution metadata; no organism or laboratory procedure instructions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedDilutionFraction: {
          type: "number",
          exclusiveMinimum: 0,
          maximum: 1,
        },
        platedVolume: { type: "number", exclusiveMinimum: 0 },
        suppliedVolumeUnitFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "suppliedDilutionFraction",
        "platedVolume",
        "suppliedVolumeUnitFactor",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveSourceVolume: { type: "number" },
        inverseVolumeFactor: { type: "number" },
      },
      required: ["effectiveSourceVolume", "inverseVolumeFactor"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedDilutionFraction",
          label: "Supplied Dilution Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "platedVolume",
          label: "Plated Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedVolumeUnitFactor",
          label: "Supplied Volume Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "effectiveSourceVolume",
          label: "Effective Source Volume",
          valueType: { type: "number" },
        },
        {
          id: "inverseVolumeFactor",
          label: "Inverse Volume Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dilutionPlateVolumeFactorTool.execute;
export default dilutionPlateVolumeFactorTool;
