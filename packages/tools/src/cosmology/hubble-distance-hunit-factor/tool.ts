import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hubbleParameter: number;
  readonly speed: number;
  readonly suppliedHubbleToInverseTime: number;
};
export type Output = {
  readonly inverseTimeHubble: number;
  readonly hubbleDistance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hubbleParameter: { type: "number", exclusiveMinimum: 0 },
    speed: { type: "number", minimum: 0 },
    suppliedHubbleToInverseTime: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["hubbleParameter", "speed", "suppliedHubbleToInverseTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inverseTimeHubble: { type: "number" },
    hubbleDistance: { type: "number" },
  },
  required: ["inverseTimeHubble", "hubbleDistance"],
} as const;
/** Hubble-distance unit arithmetic from an explicitly supplied conversion, not a distance-redshift integral. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hubbleParameter, speed, suppliedHubbleToInverseTime } = request;
  const compute = (): Output => {
    H.positive(hubbleParameter);
    H.domain(speed >= 0);
    H.positive(suppliedHubbleToInverseTime);
    return {
      inverseTimeHubble: hubbleParameter * suppliedHubbleToInverseTime,
      hubbleDistance: speed / (hubbleParameter * suppliedHubbleToInverseTime),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    hubbleParameter: 70,
    speed: 300000,
    suppliedHubbleToInverseTime: 0.001,
  },
  output: { inverseTimeHubble: 0.07, hubbleDistance: 4285714.285714285 },
} satisfies ToolExample<Input, Output>;
export const hubbleDistanceHunitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cosmology/hubble-distance-hunit-factor",
    title: "Hubble Distance Hunit Factor Tool",
    description:
      "Hubble-distance unit arithmetic from an explicitly supplied conversion, not a distance-redshift integral.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hubbleParameter: { type: "number", exclusiveMinimum: 0 },
        speed: { type: "number", minimum: 0 },
        suppliedHubbleToInverseTime: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["hubbleParameter", "speed", "suppliedHubbleToInverseTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inverseTimeHubble: { type: "number" },
        hubbleDistance: { type: "number" },
      },
      required: ["inverseTimeHubble", "hubbleDistance"],
    },
    ports: {
      inputs: [
        {
          id: "hubbleParameter",
          label: "Hubble Parameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "speed",
          label: "Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedHubbleToInverseTime",
          label: "Supplied Hubble To Inverse Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "inverseTimeHubble",
          label: "Inverse Time Hubble",
          valueType: { type: "number" },
        },
        {
          id: "hubbleDistance",
          label: "Hubble Distance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hubbleDistanceHunitFactorTool.execute;
export default hubbleDistanceHunitFactorTool;
