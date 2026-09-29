import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly snowDepth: number;
  readonly snowDensity: number;
  readonly waterDensity: number;
  readonly liquidWaterDepth: number;
};
export type Output = {
  readonly solidWaterEquivalent: number;
  readonly totalWaterEquivalent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    snowDepth: { type: "number", minimum: 0 },
    snowDensity: { type: "number", minimum: 0 },
    waterDensity: { type: "number", exclusiveMinimum: 0 },
    liquidWaterDepth: { type: "number", minimum: 0 },
  },
  required: ["snowDepth", "snowDensity", "waterDensity", "liquidWaterDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    solidWaterEquivalent: { type: "number" },
    totalWaterEquivalent: { type: "number" },
  },
  required: ["solidWaterEquivalent", "totalWaterEquivalent"],
} as const;
/** One layer water-equivalent depth with separately supplied liquid depth; snowDensity must exclude liquid already represented by that extra term. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { snowDepth, snowDensity, waterDensity, liquidWaterDepth } = request;
  const compute = (): Output => {
    H.domain(snowDepth >= 0 && snowDensity >= 0 && liquidWaterDepth >= 0);
    H.positive(waterDensity);
    return {
      solidWaterEquivalent: (snowDepth * snowDensity) / waterDensity,
      totalWaterEquivalent:
        (snowDepth * snowDensity) / waterDensity + liquidWaterDepth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    snowDepth: 0.5,
    snowDensity: 300,
    waterDensity: 1000,
    liquidWaterDepth: 0.02,
  },
  output: {
    solidWaterEquivalent: 0.15,
    totalWaterEquivalent: 0.16999999999999998,
  },
} satisfies ToolExample<Input, Output>;
export const snowWaterEquivalentOneLayerTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/snow-water-equivalent-one-layer-term",
    title: "Snow Water Equivalent One Layer Term Tool",
    description:
      "One layer water-equivalent depth with separately supplied liquid depth; snowDensity must exclude liquid already represented by that extra term.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        snowDepth: { type: "number", minimum: 0 },
        snowDensity: { type: "number", minimum: 0 },
        waterDensity: { type: "number", exclusiveMinimum: 0 },
        liquidWaterDepth: { type: "number", minimum: 0 },
      },
      required: [
        "snowDepth",
        "snowDensity",
        "waterDensity",
        "liquidWaterDepth",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        solidWaterEquivalent: { type: "number" },
        totalWaterEquivalent: { type: "number" },
      },
      required: ["solidWaterEquivalent", "totalWaterEquivalent"],
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
          id: "snowDensity",
          label: "Snow Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterDensity",
          label: "Water Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "liquidWaterDepth",
          label: "Liquid Water Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "solidWaterEquivalent",
          label: "Solid Water Equivalent",
          valueType: { type: "number" },
        },
        {
          id: "totalWaterEquivalent",
          label: "Total Water Equivalent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = snowWaterEquivalentOneLayerTermTool.execute;
export default snowWaterEquivalentOneLayerTermTool;
