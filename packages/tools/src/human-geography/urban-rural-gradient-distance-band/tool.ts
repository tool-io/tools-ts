import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distance: number;
  readonly origin: number;
  readonly bandWidth: number;
};
export type Output = {
  readonly band: number;
  readonly lowerDistance: number;
  readonly upperDistance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number", minimum: 0 },
    origin: { type: "number", minimum: 0 },
    bandWidth: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["distance", "origin", "bandWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    band: { type: "integer" },
    lowerDistance: { type: "number" },
    upperDistance: { type: "number" },
  },
  required: ["band", "lowerDistance", "upperDistance"],
} as const;
/** Half-open distance band relative to a caller-defined gradient origin, without an urban/rural classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { distance, origin, bandWidth } = request;
  const compute = (): Output => {
    H.domain(distance >= 0 && origin >= 0);
    H.positive(bandWidth);
    return {
      band: Math.floor((distance - origin) / bandWidth),
      lowerDistance:
        origin + bandWidth * Math.floor((distance - origin) / bandWidth),
      upperDistance:
        origin + bandWidth * (Math.floor((distance - origin) / bandWidth) + 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { distance: 12, origin: 0, bandWidth: 5 },
  output: { band: 2, lowerDistance: 10, upperDistance: 15 },
} satisfies ToolExample<Input, Output>;
export const urbanRuralGradientDistanceBandTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/urban-rural-gradient-distance-band",
    title: "Urban Rural Gradient Distance Band Tool",
    description:
      "Half-open distance band relative to a caller-defined gradient origin, without an urban/rural classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "number", minimum: 0 },
        origin: { type: "number", minimum: 0 },
        bandWidth: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["distance", "origin", "bandWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        band: { type: "integer" },
        lowerDistance: { type: "number" },
        upperDistance: { type: "number" },
      },
      required: ["band", "lowerDistance", "upperDistance"],
    },
    ports: {
      inputs: [
        {
          id: "distance",
          label: "Distance",
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
          id: "bandWidth",
          label: "Band Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "band", label: "Band", valueType: { type: "integer" } },
        {
          id: "lowerDistance",
          label: "Lower Distance",
          valueType: { type: "number" },
        },
        {
          id: "upperDistance",
          label: "Upper Distance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = urbanRuralGradientDistanceBandTool.execute;
export default urbanRuralGradientDistanceBandTool;
