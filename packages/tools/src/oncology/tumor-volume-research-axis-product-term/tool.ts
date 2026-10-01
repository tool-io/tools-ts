import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstAxes: readonly number[];
  readonly secondAxes: readonly number[];
  readonly shapeCoefficient: number;
};
export type Output = {
  readonly firstVolume: number;
  readonly secondVolume: number;
  readonly volumeRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAxes: { type: "array", maxItems: 256, items: { type: "number" } },
    secondAxes: { type: "array", maxItems: 256, items: { type: "number" } },
    shapeCoefficient: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstAxes", "secondAxes", "shapeCoefficient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstVolume: { type: "number" },
    secondVolume: { type: "number" },
    volumeRatio: { type: "number" },
  },
  required: ["firstVolume", "secondVolume", "volumeRatio"],
} as const;
/** Three-axis model-volume comparison with an explicit common shape coefficient, without image segmentation or response criteria. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstAxes, secondAxes, shapeCoefficient } = request;
  const compute = (): Output => {
    H.domain(
      firstAxes.length === 3 &&
        secondAxes.length === 3 &&
        firstAxes.every((x) => x > 0) &&
        secondAxes.every((x) => x >= 0) &&
        shapeCoefficient > 0,
    );
    return {
      firstVolume: shapeCoefficient * firstAxes.reduce((a, b) => a * b, 1),
      secondVolume: shapeCoefficient * secondAxes.reduce((a, b) => a * b, 1),
      volumeRatio:
        secondAxes.reduce((a, b) => a * b, 1) /
        firstAxes.reduce((a, b) => a * b, 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstAxes: [2, 3, 4],
    secondAxes: [2, 3, 2],
    shapeCoefficient: 0.5235987755982988,
  },
  output: {
    firstVolume: 12.566370614359172,
    secondVolume: 6.283185307179586,
    volumeRatio: 0.5,
  },
} satisfies ToolExample<Input, Output>;
export const tumorVolumeResearchAxisProductTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oncology/tumor-volume-research-axis-product-term",
    title: "Tumor Volume Research Axis Product Term Tool",
    description:
      "Three-axis model-volume comparison with an explicit common shape coefficient, without image segmentation or response criteria.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstAxes: { type: "array", maxItems: 256, items: { type: "number" } },
        secondAxes: { type: "array", maxItems: 256, items: { type: "number" } },
        shapeCoefficient: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstAxes", "secondAxes", "shapeCoefficient"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstVolume: { type: "number" },
        secondVolume: { type: "number" },
        volumeRatio: { type: "number" },
      },
      required: ["firstVolume", "secondVolume", "volumeRatio"],
    },
    ports: {
      inputs: [
        {
          id: "firstAxes",
          label: "First Axes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "secondAxes",
          label: "Second Axes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "shapeCoefficient",
          label: "Shape Coefficient",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstVolume",
          label: "First Volume",
          valueType: { type: "number" },
        },
        {
          id: "secondVolume",
          label: "Second Volume",
          valueType: { type: "number" },
        },
        {
          id: "volumeRatio",
          label: "Volume Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tumorVolumeResearchAxisProductTermTool.execute;
export default tumorVolumeResearchAxisProductTermTool;
