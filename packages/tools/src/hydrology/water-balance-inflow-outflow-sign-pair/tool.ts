import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inflowVolume: number;
  readonly outflowVolume: number;
  readonly inflowPositive: boolean;
};
export type Output = { readonly signedNetVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inflowVolume: { type: "number", minimum: 0 },
    outflowVolume: { type: "number", minimum: 0 },
    inflowPositive: { type: "boolean" },
  },
  required: ["inflowVolume", "outflowVolume", "inflowPositive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedNetVolume: { type: "number" } },
  required: ["signedNetVolume"],
} as const;
/** Apply an explicit net-flow sign convention to compatible supplied inflow and outflow volumes without estimating storage terms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inflowVolume, outflowVolume, inflowPositive } = request;
  const compute = (): Output => {
    H.domain(inflowVolume >= 0 && outflowVolume >= 0, "inflowVolume");
    return {
      signedNetVolume:
        (inflowVolume - outflowVolume) * (inflowPositive ? 1 : -1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inflowVolume: 120, outflowVolume: 80, inflowPositive: true },
  output: { signedNetVolume: 40 },
} satisfies ToolExample<Input, Output>;
export const waterBalanceInflowOutflowSignPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["hydrology", "earth and environmental sciences"],
      keywords: ["hydrology", "earth and environmental sciences"],
    },
    id: "hydrology/water-balance-inflow-outflow-sign-pair",
    title: "Water Balance Inflow Outflow Sign Pair",
    description:
      "Apply an explicit net-flow sign convention to compatible supplied inflow and outflow volumes without estimating storage terms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inflowVolume: { type: "number", minimum: 0 },
        outflowVolume: { type: "number", minimum: 0 },
        inflowPositive: { type: "boolean" },
      },
      required: ["inflowVolume", "outflowVolume", "inflowPositive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedNetVolume: { type: "number" } },
      required: ["signedNetVolume"],
    },
    ports: {
      inputs: [
        {
          id: "inflowVolume",
          label: "Inflow Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outflowVolume",
          label: "Outflow Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inflowPositive",
          label: "Inflow Positive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "signedNetVolume",
          label: "Signed Net Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = waterBalanceInflowOutflowSignPairTool.execute;
export default waterBalanceInflowOutflowSignPairTool;
