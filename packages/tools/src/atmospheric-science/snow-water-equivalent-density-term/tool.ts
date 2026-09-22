import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly snowDepth: number;
  readonly snowDensity: number;
  readonly waterDensity: number;
};
export type Output = { readonly waterEquivalentDepth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    snowDepth: { type: "number", minimum: 0 },
    snowDensity: { type: "number", minimum: 0 },
    waterDensity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["snowDepth", "snowDensity", "waterDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { waterEquivalentDepth: { type: "number" } },
  required: ["waterEquivalentDepth"],
} as const;
/** Calculate snow water equivalent density term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { snowDepth, snowDensity, waterDensity } = request;
  const compute = (): Output => {
    H.domain(snowDepth >= 0 && snowDensity >= 0);
    H.positive(waterDensity);
    return { waterEquivalentDepth: (snowDepth * snowDensity) / waterDensity };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { snowDepth: 0.5, snowDensity: 200, waterDensity: 1000 },
  output: { waterEquivalentDepth: 0.1 },
} satisfies ToolExample<Input, Output>;
export const snowWaterEquivalentDensityTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-science/snow-water-equivalent-density-term",
    title: "Snow Water Equivalent Density Term Tool",
    description:
      "Calculate snow water equivalent density term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        snowDepth: { type: "number", minimum: 0 },
        snowDensity: { type: "number", minimum: 0 },
        waterDensity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["snowDepth", "snowDensity", "waterDensity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { waterEquivalentDepth: { type: "number" } },
      required: ["waterEquivalentDepth"],
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
      ],
      outputs: [
        {
          id: "waterEquivalentDepth",
          label: "Water Equivalent Depth",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = snowWaterEquivalentDensityTermTool.execute;
export default snowWaterEquivalentDensityTermTool;
