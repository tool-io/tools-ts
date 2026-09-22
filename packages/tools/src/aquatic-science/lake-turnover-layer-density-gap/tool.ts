import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly upperDensity: number;
  readonly lowerDensity: number;
  readonly upperDepth: number;
  readonly lowerDepth: number;
};
export type Output = {
  readonly densityGap: number;
  readonly gradient: number;
  readonly staticallyStable: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    upperDensity: { type: "number", exclusiveMinimum: 0 },
    lowerDensity: { type: "number", exclusiveMinimum: 0 },
    upperDepth: { type: "number" },
    lowerDepth: { type: "number" },
  },
  required: ["upperDensity", "lowerDensity", "upperDepth", "lowerDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    densityGap: { type: "number" },
    gradient: { type: "number" },
    staticallyStable: { type: "boolean" },
  },
  required: ["densityGap", "gradient", "staticallyStable"],
} as const;
/** Two-layer density-gradient sign only; does not predict lake turnover timing or wind mixing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { upperDensity, lowerDensity, upperDepth, lowerDepth } = request;
  const compute = (): Output => {
    H.positive(upperDensity);
    H.positive(lowerDensity);
    H.domain(lowerDepth > upperDepth);
    return {
      densityGap: lowerDensity - upperDensity,
      gradient: (lowerDensity - upperDensity) / (lowerDepth - upperDepth),
      staticallyStable: lowerDensity >= upperDensity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    upperDensity: 998,
    lowerDensity: 1000,
    upperDepth: 1,
    lowerDepth: 5,
  },
  output: { densityGap: 2, gradient: 0.5, staticallyStable: true },
} satisfies ToolExample<Input, Output>;
export const lakeTurnoverLayerDensityGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquatic-science/lake-turnover-layer-density-gap",
    title: "Lake Turnover Layer Density Gap Tool",
    description:
      "Two-layer density-gradient sign only; does not predict lake turnover timing or wind mixing.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        upperDensity: { type: "number", exclusiveMinimum: 0 },
        lowerDensity: { type: "number", exclusiveMinimum: 0 },
        upperDepth: { type: "number" },
        lowerDepth: { type: "number" },
      },
      required: ["upperDensity", "lowerDensity", "upperDepth", "lowerDepth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        densityGap: { type: "number" },
        gradient: { type: "number" },
        staticallyStable: { type: "boolean" },
      },
      required: ["densityGap", "gradient", "staticallyStable"],
    },
    ports: {
      inputs: [
        {
          id: "upperDensity",
          label: "Upper Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerDensity",
          label: "Lower Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperDepth",
          label: "Upper Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerDepth",
          label: "Lower Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "densityGap",
          label: "Density Gap",
          valueType: { type: "number" },
        },
        { id: "gradient", label: "Gradient", valueType: { type: "number" } },
        {
          id: "staticallyStable",
          label: "Statically Stable",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = lakeTurnoverLayerDensityGapTool.execute;
export default lakeTurnoverLayerDensityGapTool;
