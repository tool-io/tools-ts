import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly soluteVolume: number;
  readonly carrierVolume: number;
  readonly measuredTotal: number;
};
export type Output = {
  readonly additiveTotal: number;
  readonly contraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    soluteVolume: { type: "number", minimum: 0 },
    carrierVolume: { type: "number", minimum: 0 },
    measuredTotal: { type: "number", minimum: 0 },
  },
  required: ["soluteVolume", "carrierVolume", "measuredTotal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    additiveTotal: { type: "number" },
    contraction: { type: "number" },
  },
  required: ["additiveTotal", "contraction"],
} as const;
/** Calculate dilution carrier volume additivity gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { soluteVolume, carrierVolume, measuredTotal } = request;
  const compute = (): Output => {
    H.domain(soluteVolume >= 0 && carrierVolume >= 0 && measuredTotal >= 0);
    const additiveTotal = soluteVolume + carrierVolume;
    return { additiveTotal, contraction: additiveTotal - measuredTotal };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { soluteVolume: 20, carrierVolume: 80, measuredTotal: 98 },
  output: { additiveTotal: 100, contraction: 2 },
} satisfies ToolExample<Input, Output>;
export const dilutionCarrierVolumeAdditivityGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/dilution-carrier-volume-additivity-gap",
    title: "Dilution Carrier Volume Additivity Gap Tool",
    description:
      "Calculate dilution carrier volume additivity gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        soluteVolume: { type: "number", minimum: 0 },
        carrierVolume: { type: "number", minimum: 0 },
        measuredTotal: { type: "number", minimum: 0 },
      },
      required: ["soluteVolume", "carrierVolume", "measuredTotal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        additiveTotal: { type: "number" },
        contraction: { type: "number" },
      },
      required: ["additiveTotal", "contraction"],
    },
    ports: {
      inputs: [
        {
          id: "soluteVolume",
          label: "Solute Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "carrierVolume",
          label: "Carrier Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredTotal",
          label: "Measured Total",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "additiveTotal",
          label: "Additive Total",
          valueType: { type: "number" },
        },
        {
          id: "contraction",
          label: "Contraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dilutionCarrierVolumeAdditivityGapTool.execute;
export default dilutionCarrierVolumeAdditivityGapTool;
