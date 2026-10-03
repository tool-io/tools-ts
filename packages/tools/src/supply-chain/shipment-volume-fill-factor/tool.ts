import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly occupiedVolume: number;
  readonly usableVolume: number;
};
export type Output = { readonly factor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occupiedVolume: { type: "number", minimum: 0 },
    usableVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["occupiedVolume", "usableVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { factor: { type: "number" } },
  required: ["factor"],
} as const;
/** Report supplied shipment volume utilization without packing or overlap inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { occupiedVolume, usableVolume } = request;
  const compute = (): Output => {
    H.domain(occupiedVolume >= 0);
    H.positive(usableVolume);
    return { factor: occupiedVolume / usableVolume };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { occupiedVolume: 8, usableVolume: 10 },
  output: { factor: 0.8 },
} satisfies ToolExample<Input, Output>;
export const shipmentVolumeFillFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/shipment-volume-fill-factor",
    title: "Shipment Volume Fill Factor Tool",
    description:
      "Report supplied shipment volume utilization without packing or overlap inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        occupiedVolume: { type: "number", minimum: 0 },
        usableVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["occupiedVolume", "usableVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { factor: { type: "number" } },
      required: ["factor"],
    },
    ports: {
      inputs: [
        {
          id: "occupiedVolume",
          label: "Occupied Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "usableVolume",
          label: "Usable Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "factor", label: "Factor", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = shipmentVolumeFillFactorTool.execute;
export default shipmentVolumeFillFactorTool;
