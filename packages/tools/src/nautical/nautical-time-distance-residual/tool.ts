import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly speedKnots: number;
  readonly elapsedHours: number;
  readonly loggedNauticalMiles: number;
};
export type Output = {
  readonly modelNauticalMiles: number;
  readonly residualNauticalMiles: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    speedKnots: { type: "number", minimum: 0 },
    elapsedHours: { type: "number", minimum: 0 },
    loggedNauticalMiles: { type: "number", minimum: 0 },
  },
  required: ["speedKnots", "elapsedHours", "loggedNauticalMiles"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    modelNauticalMiles: { type: "number" },
    residualNauticalMiles: { type: "number" },
  },
  required: ["modelNauticalMiles", "residualNauticalMiles"],
} as const;
/** Compare a logged distance with an explicit constant-speed nautical time model, without route planning. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { speedKnots, elapsedHours, loggedNauticalMiles } = request;
  const compute = (): Output => {
    H.domain(speedKnots >= 0 && elapsedHours >= 0 && loggedNauticalMiles >= 0);
    return {
      modelNauticalMiles: speedKnots * elapsedHours,
      residualNauticalMiles: loggedNauticalMiles - speedKnots * elapsedHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { speedKnots: 12, elapsedHours: 2, loggedNauticalMiles: 25 },
  output: { modelNauticalMiles: 24, residualNauticalMiles: 1 },
} satisfies ToolExample<Input, Output>;
export const nauticalTimeDistanceResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/nautical-time-distance-residual",
    title: "Nautical Time Distance Residual Tool",
    description:
      "Compare a logged distance with an explicit constant-speed nautical time model, without route planning.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        speedKnots: { type: "number", minimum: 0 },
        elapsedHours: { type: "number", minimum: 0 },
        loggedNauticalMiles: { type: "number", minimum: 0 },
      },
      required: ["speedKnots", "elapsedHours", "loggedNauticalMiles"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        modelNauticalMiles: { type: "number" },
        residualNauticalMiles: { type: "number" },
      },
      required: ["modelNauticalMiles", "residualNauticalMiles"],
    },
    ports: {
      inputs: [
        {
          id: "speedKnots",
          label: "Speed Knots",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedHours",
          label: "Elapsed Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "loggedNauticalMiles",
          label: "Logged Nautical Miles",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "modelNauticalMiles",
          label: "Model Nautical Miles",
          valueType: { type: "number" },
        },
        {
          id: "residualNauticalMiles",
          label: "Residual Nautical Miles",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nauticalTimeDistanceResidualTool.execute;
export default nauticalTimeDistanceResidualTool;
