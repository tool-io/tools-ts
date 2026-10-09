import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly rise: number; readonly horizontalRun: number };
export type Output = {
  readonly gradient: number;
  readonly percentGrade: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rise: { type: "number" },
    horizontalRun: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["rise", "horizontalRun"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gradient: { type: "number" },
    percentGrade: { type: "number" },
  },
  required: ["gradient", "percentGrade"],
} as const;
/** Express supplied signed terrain rise over positive horizontal run as a ratio and percent grade. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rise, horizontalRun } = request;
  const compute = (): Output => {
    (H.domain(horizontalRun > 0, "horizontalRun"), horizontalRun);
    return {
      gradient: rise / horizontalRun,
      percentGrade: (100 * rise) / horizontalRun,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rise: 12, horizontalRun: 300 },
  output: { gradient: 0.04, percentGrade: 4 },
} satisfies ToolExample<Input, Output>;
export const terrainRiseRunGradientTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geomorphology", "earth and environmental sciences"],
      keywords: ["geomorphology", "earth and environmental sciences"],
    },
    id: "geomorphology/terrain-rise-run-gradient",
    title: "Terrain Rise Run Gradient",
    description:
      "Express supplied signed terrain rise over positive horizontal run as a ratio and percent grade.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rise: { type: "number" },
        horizontalRun: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["rise", "horizontalRun"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gradient: { type: "number" },
        percentGrade: { type: "number" },
      },
      required: ["gradient", "percentGrade"],
    },
    ports: {
      inputs: [
        {
          id: "rise",
          label: "Rise",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "horizontalRun",
          label: "Horizontal Run",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gradient", label: "Gradient", valueType: { type: "number" } },
        {
          id: "percentGrade",
          label: "Percent Grade",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = terrainRiseRunGradientTool.execute;
export default terrainRiseRunGradientTool;
