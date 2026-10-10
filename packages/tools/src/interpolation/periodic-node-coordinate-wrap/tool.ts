import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinate: number;
  readonly origin: number;
  readonly period: number;
};
export type Output = { readonly wrappedCoordinate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinate: { type: "number" },
    origin: { type: "number" },
    period: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["coordinate", "origin", "period"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { wrappedCoordinate: { type: "number" } },
  required: ["wrappedCoordinate"],
} as const;
/** Wrap an explicit node coordinate into a supplied origin-inclusive periodic interval without interpolating values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinate, origin, period } = request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(period) && period > 0, "period"), period);
    return {
      wrappedCoordinate: (() => {
        const difference = coordinate - origin;
        const raw = Number.isFinite(difference)
          ? difference % period
          : ((coordinate % period) - (origin % period)) % period;
        const remainder =
          raw < 0 ? (raw + period === period ? 0 : raw + period) : raw;
        return origin + remainder;
      })(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinate: 13, origin: 2, period: 5 },
  output: { wrappedCoordinate: 3 },
} satisfies ToolExample<Input, Output>;
export const periodicNodeCoordinateWrapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["interpolation", "mathematics"],
      keywords: ["interpolation", "mathematics"],
    },
    id: "interpolation/periodic-node-coordinate-wrap",
    title: "Periodic Node Coordinate Wrap",
    description:
      "Wrap an explicit node coordinate into a supplied origin-inclusive periodic interval without interpolating values.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinate: { type: "number" },
        origin: { type: "number" },
        period: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["coordinate", "origin", "period"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { wrappedCoordinate: { type: "number" } },
      required: ["wrappedCoordinate"],
    },
    ports: {
      inputs: [
        {
          id: "coordinate",
          label: "Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "period",
          label: "Period",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "wrappedCoordinate",
          label: "Wrapped Coordinate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = periodicNodeCoordinateWrapTool.execute;
export default periodicNodeCoordinateWrapTool;
