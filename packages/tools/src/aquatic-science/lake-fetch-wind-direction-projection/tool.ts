import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly fetch: number; readonly angleRadians: number };
export type Output = { readonly alongWind: number; readonly crossWind: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fetch: { type: "number", minimum: 0 },
    angleRadians: { type: "number" },
  },
  required: ["fetch", "angleRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { alongWind: { type: "number" }, crossWind: { type: "number" } },
  required: ["alongWind", "crossWind"],
} as const;
/** Resolve a supplied fetch segment relative to a caller-defined wind axis in radians. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fetch, angleRadians } = request;
  const compute = (): Output => {
    H.domain(fetch >= 0);
    return {
      alongWind: fetch * Math.cos(angleRadians),
      crossWind: fetch * Math.sin(angleRadians),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fetch: 10, angleRadians: 0 },
  output: { alongWind: 10, crossWind: 0 },
} satisfies ToolExample<Input, Output>;
export const lakeFetchWindDirectionProjectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquatic-science/lake-fetch-wind-direction-projection",
    title: "Lake Fetch Wind Direction Projection Tool",
    description:
      "Resolve a supplied fetch segment relative to a caller-defined wind axis in radians.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fetch: { type: "number", minimum: 0 },
        angleRadians: { type: "number" },
      },
      required: ["fetch", "angleRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        alongWind: { type: "number" },
        crossWind: { type: "number" },
      },
      required: ["alongWind", "crossWind"],
    },
    ports: {
      inputs: [
        {
          id: "fetch",
          label: "Fetch",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "angleRadians",
          label: "Angle Radians",
          required: true,
          valueType: { type: "number", unit: "rad" },
        },
      ],
      outputs: [
        { id: "alongWind", label: "Along Wind", valueType: { type: "number" } },
        { id: "crossWind", label: "Cross Wind", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = lakeFetchWindDirectionProjectionTool.execute;
export default lakeFetchWindDirectionProjectionTool;
