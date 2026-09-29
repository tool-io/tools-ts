import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly snowDepth: number;
  readonly suppliedSnowDensity: number;
  readonly suppliedWaterDensity: number;
  readonly coveredFraction: number;
};
export type Output = {
  readonly waterDepth: number;
  readonly weightedWaterDepth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    snowDepth: { type: "number", minimum: 0 },
    suppliedSnowDensity: { type: "number", minimum: 0 },
    suppliedWaterDensity: { type: "number", exclusiveMinimum: 0 },
    coveredFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "snowDepth",
    "suppliedSnowDensity",
    "suppliedWaterDensity",
    "coveredFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waterDepth: { type: "number" },
    weightedWaterDepth: { type: "number" },
  },
  required: ["waterDepth", "weightedWaterDepth"],
} as const;
/** Calculate snow water depth contribution from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    snowDepth,
    suppliedSnowDensity,
    suppliedWaterDensity,
    coveredFraction,
  } = request;
  const compute = (): Output => {
    H.domain(snowDepth >= 0 && suppliedSnowDensity >= 0);
    H.positive(suppliedWaterDensity);
    H.probability(coveredFraction);
    return {
      waterDepth: (snowDepth * suppliedSnowDensity) / suppliedWaterDensity,
      weightedWaterDepth:
        ((snowDepth * suppliedSnowDensity) / suppliedWaterDensity) *
        coveredFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    snowDepth: 100,
    suppliedSnowDensity: 200,
    suppliedWaterDensity: 1000,
    coveredFraction: 0.5,
  },
  output: { waterDepth: 20, weightedWaterDepth: 10 },
} satisfies ToolExample<Input, Output>;
export const snowWaterDepthContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/snow-water-depth-contribution",
    title: "Snow Water Depth Contribution Tool",
    description:
      "Calculate snow water depth contribution from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        snowDepth: { type: "number", minimum: 0 },
        suppliedSnowDensity: { type: "number", minimum: 0 },
        suppliedWaterDensity: { type: "number", exclusiveMinimum: 0 },
        coveredFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "snowDepth",
        "suppliedSnowDensity",
        "suppliedWaterDensity",
        "coveredFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waterDepth: { type: "number" },
        weightedWaterDepth: { type: "number" },
      },
      required: ["waterDepth", "weightedWaterDepth"],
    },
    ports: {
      inputs: [
        {
          id: "snowDepth",
          label: "Snow Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedSnowDensity",
          label: "Supplied Snow Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedWaterDensity",
          label: "Supplied Water Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coveredFraction",
          label: "Covered Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "waterDepth",
          label: "Water Depth",
          valueType: { type: "number" },
        },
        {
          id: "weightedWaterDepth",
          label: "Weighted Water Depth",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = snowWaterDepthContributionTool.execute;
export default snowWaterDepthContributionTool;
