import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalVolume: number;
  readonly carrierVolume: number;
  readonly measuredComponent: number;
  readonly excludeCarrier: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly componentPerVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalVolume: { type: "number", exclusiveMinimum: 0 },
    carrierVolume: { type: "number", minimum: 0 },
    measuredComponent: { type: "number" },
    excludeCarrier: { type: "boolean" },
  },
  required: [
    "totalVolume",
    "carrierVolume",
    "measuredComponent",
    "excludeCarrier",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "number" },
    componentPerVolume: { type: "number" },
  },
  required: ["denominator", "componentPerVolume"],
} as const;
/** Compare supplied component measures across explicit carrier-included/excluded volume bases, without a bioink recipe. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalVolume, carrierVolume, measuredComponent, excludeCarrier } =
    request;
  const compute = (): Output => {
    H.positive(totalVolume);
    H.domain(carrierVolume >= 0 && carrierVolume < totalVolume);
    return {
      denominator: totalVolume - (excludeCarrier ? carrierVolume : 0),
      componentPerVolume:
        measuredComponent /
        (totalVolume - (excludeCarrier ? carrierVolume : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    totalVolume: 100,
    carrierVolume: 60,
    measuredComponent: 20,
    excludeCarrier: true,
  },
  output: { denominator: 40, componentPerVolume: 0.5 },
} satisfies ToolExample<Input, Output>;
export const bioinkCarrierVolumeBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biofabrication/bioink-carrier-volume-base-flag",
    title: "Bioink Carrier Volume Base Flag Tool",
    description:
      "Compare supplied component measures across explicit carrier-included/excluded volume bases, without a bioink recipe.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalVolume: { type: "number", exclusiveMinimum: 0 },
        carrierVolume: { type: "number", minimum: 0 },
        measuredComponent: { type: "number" },
        excludeCarrier: { type: "boolean" },
      },
      required: [
        "totalVolume",
        "carrierVolume",
        "measuredComponent",
        "excludeCarrier",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "number" },
        componentPerVolume: { type: "number" },
      },
      required: ["denominator", "componentPerVolume"],
    },
    ports: {
      inputs: [
        {
          id: "totalVolume",
          label: "Total Volume",
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
          id: "measuredComponent",
          label: "Measured Component",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludeCarrier",
          label: "Exclude Carrier",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "number" },
        },
        {
          id: "componentPerVolume",
          label: "Component Per Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bioinkCarrierVolumeBaseFlagTool.execute;
export default bioinkCarrierVolumeBaseFlagTool;
