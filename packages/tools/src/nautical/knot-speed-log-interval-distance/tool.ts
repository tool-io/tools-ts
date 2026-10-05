import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly speedKnots: number;
  readonly intervalSeconds: number;
};
export type Output = { readonly distanceNauticalMiles: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    speedKnots: { type: "number", minimum: 0 },
    intervalSeconds: { type: "number", minimum: 0 },
  },
  required: ["speedKnots", "intervalSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distanceNauticalMiles: { type: "number" } },
  required: ["distanceNauticalMiles"],
} as const;
/** Convert a constant nonnegative speed log in knots over an explicit interval into nautical miles. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { speedKnots, intervalSeconds } = request;
  const compute = (): Output => {
    H.domain(speedKnots >= 0 && intervalSeconds >= 0, "speedKnots");
    return { distanceNauticalMiles: (speedKnots * intervalSeconds) / 3600 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { speedKnots: 12, intervalSeconds: 900 },
  output: { distanceNauticalMiles: 3 },
} satisfies ToolExample<Input, Output>;
export const knotSpeedLogIntervalDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/knot-speed-log-interval-distance",
    title: "Knot Speed Log Interval Distance Tool",
    description:
      "Convert a constant nonnegative speed log in knots over an explicit interval into nautical miles.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        speedKnots: { type: "number", minimum: 0 },
        intervalSeconds: { type: "number", minimum: 0 },
      },
      required: ["speedKnots", "intervalSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { distanceNauticalMiles: { type: "number" } },
      required: ["distanceNauticalMiles"],
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
          id: "intervalSeconds",
          label: "Interval Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "distanceNauticalMiles",
          label: "Distance Nautical Miles",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = knotSpeedLogIntervalDistanceTool.execute;
export default knotSpeedLogIntervalDistanceTool;
