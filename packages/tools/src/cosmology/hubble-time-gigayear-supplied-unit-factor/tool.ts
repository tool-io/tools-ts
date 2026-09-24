import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hubble: number;
  readonly inverseSecondsPerInputUnit: number;
  readonly secondsPerGigayear: number;
};
export type Output = {
  readonly hubbleTimeSeconds: number;
  readonly hubbleTimeGigayears: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hubble: { type: "number", exclusiveMinimum: 0 },
    inverseSecondsPerInputUnit: { type: "number", exclusiveMinimum: 0 },
    secondsPerGigayear: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["hubble", "inverseSecondsPerInputUnit", "secondsPerGigayear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hubbleTimeSeconds: { type: "number" },
    hubbleTimeGigayears: { type: "number" },
  },
  required: ["hubbleTimeSeconds", "hubbleTimeGigayears"],
} as const;
/** Inverse Hubble rate with caller-supplied unit conversion factors, not the age of a specified cosmological model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hubble, inverseSecondsPerInputUnit, secondsPerGigayear } = request;
  const compute = (): Output => {
    H.positive(hubble);
    H.positive(inverseSecondsPerInputUnit);
    H.positive(secondsPerGigayear);
    const hubbleTimeSeconds = 1 / (hubble * inverseSecondsPerInputUnit);
    return {
      hubbleTimeSeconds,
      hubbleTimeGigayears: hubbleTimeSeconds / secondsPerGigayear,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    hubble: 70,
    inverseSecondsPerInputUnit: 3.240779289444365e-20,
    secondsPerGigayear: 31557600000000000,
  },
  output: {
    hubbleTimeSeconds: 440811083070195400,
    hubbleTimeGigayears: 13.968460309725561,
  },
} satisfies ToolExample<Input, Output>;
export const hubbleTimeGigayearSuppliedUnitFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "cosmology/hubble-time-gigayear-supplied-unit-factor",
      title: "Hubble Time Gigayear Supplied Unit Factor Tool",
      description:
        "Inverse Hubble rate with caller-supplied unit conversion factors, not the age of a specified cosmological model.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          hubble: { type: "number", exclusiveMinimum: 0 },
          inverseSecondsPerInputUnit: { type: "number", exclusiveMinimum: 0 },
          secondsPerGigayear: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "hubble",
          "inverseSecondsPerInputUnit",
          "secondsPerGigayear",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          hubbleTimeSeconds: { type: "number" },
          hubbleTimeGigayears: { type: "number" },
        },
        required: ["hubbleTimeSeconds", "hubbleTimeGigayears"],
      },
      ports: {
        inputs: [
          {
            id: "hubble",
            label: "Hubble",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "inverseSecondsPerInputUnit",
            label: "Inverse Seconds Per Input Unit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondsPerGigayear",
            label: "Seconds Per Gigayear",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "hubbleTimeSeconds",
            label: "Hubble Time Seconds",
            valueType: { type: "number", unit: "s" },
          },
          {
            id: "hubbleTimeGigayears",
            label: "Hubble Time Gigayears",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = hubbleTimeGigayearSuppliedUnitFactorTool.execute;
export default hubbleTimeGigayearSuppliedUnitFactorTool;
