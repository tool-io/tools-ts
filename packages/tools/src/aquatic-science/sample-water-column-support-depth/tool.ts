import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleTop: number;
  readonly sampleBottom: number;
  readonly waterDepth: number;
};
export type Output = {
  readonly supportDepth: number;
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleTop: { type: "number", minimum: 0 },
    sampleBottom: { type: "number" },
    waterDepth: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sampleTop", "sampleBottom", "waterDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supportDepth: { type: "number" },
    fraction: { type: "number" },
  },
  required: ["supportDepth", "fraction"],
} as const;
/** Calculate sample water column support depth from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleTop, sampleBottom, waterDepth } = request;
  const compute = (): Output => {
    H.positive(waterDepth);
    H.domain(
      sampleTop >= 0 && sampleBottom >= sampleTop && sampleBottom <= waterDepth,
    );
    return {
      supportDepth: sampleBottom - sampleTop,
      fraction: (sampleBottom - sampleTop) / waterDepth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleTop: 2, sampleBottom: 5, waterDepth: 10 },
  output: { supportDepth: 3, fraction: 0.3 },
} satisfies ToolExample<Input, Output>;
export const sampleWaterColumnSupportDepthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquatic-science/sample-water-column-support-depth",
    title: "Sample Water Column Support Depth Tool",
    description:
      "Calculate sample water column support depth from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleTop: { type: "number", minimum: 0 },
        sampleBottom: { type: "number" },
        waterDepth: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["sampleTop", "sampleBottom", "waterDepth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supportDepth: { type: "number" },
        fraction: { type: "number" },
      },
      required: ["supportDepth", "fraction"],
    },
    ports: {
      inputs: [
        {
          id: "sampleTop",
          label: "Sample Top",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleBottom",
          label: "Sample Bottom",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterDepth",
          label: "Water Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "supportDepth",
          label: "Support Depth",
          valueType: { type: "number" },
        },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sampleWaterColumnSupportDepthTool.execute;
export default sampleWaterColumnSupportDepthTool;
