import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedSpeed: number;
  readonly suppliedPolarSpeed: number;
};
export type Output = {
  readonly speedRatio: number;
  readonly speedDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedSpeed: { type: "number", minimum: 0 },
    suppliedPolarSpeed: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observedSpeed", "suppliedPolarSpeed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    speedRatio: { type: "number" },
    speedDifference: { type: "number" },
  },
  required: ["speedRatio", "speedDifference"],
} as const;
/** Compare an explicit observed speed with a supplied positive polar-table speed on the same units without interpolating a polar or routing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedSpeed, suppliedPolarSpeed } = request;
  const compute = (): Output => {
    H.domain(observedSpeed >= 0, "observedSpeed");
    (H.domain(
      Number.isFinite(suppliedPolarSpeed) && suppliedPolarSpeed > 0,
      "suppliedPolarSpeed",
    ),
      suppliedPolarSpeed);
    return {
      speedRatio: observedSpeed / suppliedPolarSpeed,
      speedDifference: observedSpeed - suppliedPolarSpeed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedSpeed: 6, suppliedPolarSpeed: 8 },
  output: { speedRatio: 0.75, speedDifference: -2 },
} satisfies ToolExample<Input, Output>;
export const sailingPolarSingleSpeedRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["nautical", "engineering"],
      keywords: ["nautical", "engineering"],
    },
    id: "nautical/sailing-polar-single-speed-ratio",
    title: "Sailing Polar Single Speed Ratio",
    description:
      "Compare an explicit observed speed with a supplied positive polar-table speed on the same units without interpolating a polar or routing.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedSpeed: { type: "number", minimum: 0 },
        suppliedPolarSpeed: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["observedSpeed", "suppliedPolarSpeed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        speedRatio: { type: "number" },
        speedDifference: { type: "number" },
      },
      required: ["speedRatio", "speedDifference"],
    },
    ports: {
      inputs: [
        {
          id: "observedSpeed",
          label: "Observed Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedPolarSpeed",
          label: "Supplied Polar Speed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "speedRatio",
          label: "Speed Ratio",
          valueType: { type: "number" },
        },
        {
          id: "speedDifference",
          label: "Speed Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sailingPolarSingleSpeedRatioTool.execute;
export default sailingPolarSingleSpeedRatioTool;
