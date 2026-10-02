import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outerRadius: number;
  readonly innerRadius: number;
  readonly height: number;
};
export type Output = {
  readonly wallThickness: number;
  readonly radiusRatio: number;
  readonly shellVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outerRadius: { type: "number", exclusiveMinimum: 0 },
    innerRadius: { type: "number", minimum: 0 },
    height: { type: "number", minimum: 0 },
  },
  required: ["outerRadius", "innerRadius", "height"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wallThickness: { type: "number" },
    radiusRatio: { type: "number" },
    shellVolume: { type: "number" },
  },
  required: ["wallThickness", "radiusRatio", "shellVolume"],
} as const;
/** Compare concentric cylindrical bench crown dimensions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outerRadius, innerRadius, height } = request;
  const compute = (): Output => {
    H.positive(outerRadius);
    H.domain(innerRadius >= 0 && innerRadius <= outerRadius && height >= 0);
    return {
      wallThickness: outerRadius - innerRadius,
      radiusRatio: innerRadius / outerRadius,
      shellVolume: Math.PI * (outerRadius ** 2 - innerRadius ** 2) * height,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outerRadius: 5, innerRadius: 4, height: 3 },
  output: {
    wallThickness: 1,
    radiusRatio: 0.8,
    shellVolume: 84.82300164692441,
  },
} satisfies ToolExample<Input, Output>;
export const prostheticCrownBenchThicknessRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "prosthodontics/prosthetic-crown-bench-thickness-ratio",
    title: "Prosthetic Crown Bench Thickness Ratio Tool",
    description: "Compare concentric cylindrical bench crown dimensions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outerRadius: { type: "number", exclusiveMinimum: 0 },
        innerRadius: { type: "number", minimum: 0 },
        height: { type: "number", minimum: 0 },
      },
      required: ["outerRadius", "innerRadius", "height"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wallThickness: { type: "number" },
        radiusRatio: { type: "number" },
        shellVolume: { type: "number" },
      },
      required: ["wallThickness", "radiusRatio", "shellVolume"],
    },
    ports: {
      inputs: [
        {
          id: "outerRadius",
          label: "Outer Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "innerRadius",
          label: "Inner Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "height",
          label: "Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "wallThickness",
          label: "Wall Thickness",
          valueType: { type: "number" },
        },
        {
          id: "radiusRatio",
          label: "Radius Ratio",
          valueType: { type: "number" },
        },
        {
          id: "shellVolume",
          label: "Shell Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = prostheticCrownBenchThicknessRatioTool.execute;
export default prostheticCrownBenchThicknessRatioTool;
