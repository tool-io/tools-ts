import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pondVolume: number;
  readonly pondSalinity: number;
  readonly inflowVolume: number;
  readonly inflowSalinity: number;
};
export type Output = { readonly volume: number; readonly salinity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pondVolume: { type: "number", minimum: 0 },
    pondSalinity: { type: "number", minimum: 0 },
    inflowVolume: { type: "number", minimum: 0 },
    inflowSalinity: { type: "number", minimum: 0 },
  },
  required: ["pondVolume", "pondSalinity", "inflowVolume", "inflowSalinity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volume: { type: "number" }, salinity: { type: "number" } },
  required: ["volume", "salinity"],
} as const;
/** Conservative mixing with additive volumes and a concentration-like salinity basis; excludes density corrections. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pondVolume, pondSalinity, inflowVolume, inflowSalinity } = request;
  const compute = (): Output => {
    H.domain(
      pondVolume >= 0 &&
        inflowVolume >= 0 &&
        pondVolume + inflowVolume > 0 &&
        pondSalinity >= 0 &&
        inflowSalinity >= 0,
    );
    return {
      volume: pondVolume + inflowVolume,
      salinity:
        (pondVolume * pondSalinity + inflowVolume * inflowSalinity) /
        (pondVolume + inflowVolume),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pondVolume: 100,
    pondSalinity: 10,
    inflowVolume: 50,
    inflowSalinity: 20,
  },
  output: { volume: 150, salinity: 13.333333333333334 },
} satisfies ToolExample<Input, Output>;
export const pondSalinityMixingOneInflowTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaculture/pond-salinity-mixing-one-inflow",
    title: "Pond Salinity Mixing One Inflow Tool",
    description:
      "Conservative mixing with additive volumes and a concentration-like salinity basis; excludes density corrections.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pondVolume: { type: "number", minimum: 0 },
        pondSalinity: { type: "number", minimum: 0 },
        inflowVolume: { type: "number", minimum: 0 },
        inflowSalinity: { type: "number", minimum: 0 },
      },
      required: [
        "pondVolume",
        "pondSalinity",
        "inflowVolume",
        "inflowSalinity",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { volume: { type: "number" }, salinity: { type: "number" } },
      required: ["volume", "salinity"],
    },
    ports: {
      inputs: [
        {
          id: "pondVolume",
          label: "Pond Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pondSalinity",
          label: "Pond Salinity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inflowVolume",
          label: "Inflow Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inflowSalinity",
          label: "Inflow Salinity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "volume", label: "Volume", valueType: { type: "number" } },
        { id: "salinity", label: "Salinity", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pondSalinityMixingOneInflowTool.execute;
export default pondSalinityMixingOneInflowTool;
