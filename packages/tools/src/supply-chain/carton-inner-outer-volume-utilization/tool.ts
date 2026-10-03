import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly innerDimensions: readonly number[];
  readonly outerDimensions: readonly number[];
};
export type Output = {
  readonly innerVolume: number;
  readonly outerVolume: number;
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    innerDimensions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    outerDimensions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["innerDimensions", "outerDimensions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    innerVolume: { type: "number" },
    outerVolume: { type: "number" },
    fraction: { type: "number" },
  },
  required: ["innerVolume", "outerVolume", "fraction"],
} as const;
/** Calculate carton inner outer volume utilization from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { innerDimensions, outerDimensions } = request;
  const compute = (): Output => {
    H.domain(
      innerDimensions.length === 3 &&
        outerDimensions.length === 3 &&
        innerDimensions.every((x, i) => x >= 0 && x <= outerDimensions[i]) &&
        outerDimensions.every((x) => x > 0),
    );
    return {
      innerVolume: innerDimensions.reduce((a, b) => a * b, 1),
      outerVolume: outerDimensions.reduce((a, b) => a * b, 1),
      fraction:
        innerDimensions.reduce((a, b) => a * b, 1) /
        outerDimensions.reduce((a, b) => a * b, 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { innerDimensions: [8, 8, 8], outerDimensions: [10, 10, 10] },
  output: { innerVolume: 512, outerVolume: 1000, fraction: 0.512 },
} satisfies ToolExample<Input, Output>;
export const cartonInnerOuterVolumeUtilizationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/carton-inner-outer-volume-utilization",
    title: "Carton Inner Outer Volume Utilization Tool",
    description:
      "Calculate carton inner outer volume utilization from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        innerDimensions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        outerDimensions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["innerDimensions", "outerDimensions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        innerVolume: { type: "number" },
        outerVolume: { type: "number" },
        fraction: { type: "number" },
      },
      required: ["innerVolume", "outerVolume", "fraction"],
    },
    ports: {
      inputs: [
        {
          id: "innerDimensions",
          label: "Inner Dimensions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "outerDimensions",
          label: "Outer Dimensions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "innerVolume",
          label: "Inner Volume",
          valueType: { type: "number" },
        },
        {
          id: "outerVolume",
          label: "Outer Volume",
          valueType: { type: "number" },
        },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cartonInnerOuterVolumeUtilizationTool.execute;
export default cartonInnerOuterVolumeUtilizationTool;
