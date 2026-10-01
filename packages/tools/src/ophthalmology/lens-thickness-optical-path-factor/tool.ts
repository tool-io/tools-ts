import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly thickness: number;
  readonly refractiveIndex: number;
  readonly surroundingIndex: number;
};
export type Output = {
  readonly opticalPath: number;
  readonly excessOpticalPath: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    thickness: { type: "number", minimum: 0 },
    refractiveIndex: { type: "number", exclusiveMinimum: 0 },
    surroundingIndex: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["thickness", "refractiveIndex", "surroundingIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opticalPath: { type: "number" },
    excessOpticalPath: { type: "number" },
  },
  required: ["opticalPath", "excessOpticalPath"],
} as const;
/** Uniform-index slab optical path and excess over a supplied surrounding medium, not a full crystalline-lens model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { thickness, refractiveIndex, surroundingIndex } = request;
  const compute = (): Output => {
    H.domain(thickness >= 0);
    H.positive(refractiveIndex);
    H.positive(surroundingIndex);
    return {
      opticalPath: thickness * refractiveIndex,
      excessOpticalPath: thickness * (refractiveIndex - surroundingIndex),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { thickness: 5, refractiveIndex: 1.5, surroundingIndex: 1 },
  output: { opticalPath: 7.5, excessOpticalPath: 2.5 },
} satisfies ToolExample<Input, Output>;
export const lensThicknessOpticalPathFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ophthalmology/lens-thickness-optical-path-factor",
    title: "Lens Thickness Optical Path Factor Tool",
    description:
      "Uniform-index slab optical path and excess over a supplied surrounding medium, not a full crystalline-lens model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        thickness: { type: "number", minimum: 0 },
        refractiveIndex: { type: "number", exclusiveMinimum: 0 },
        surroundingIndex: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["thickness", "refractiveIndex", "surroundingIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        opticalPath: { type: "number" },
        excessOpticalPath: { type: "number" },
      },
      required: ["opticalPath", "excessOpticalPath"],
    },
    ports: {
      inputs: [
        {
          id: "thickness",
          label: "Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "refractiveIndex",
          label: "Refractive Index",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "surroundingIndex",
          label: "Surrounding Index",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "opticalPath",
          label: "Optical Path",
          valueType: { type: "number" },
        },
        {
          id: "excessOpticalPath",
          label: "Excess Optical Path",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lensThicknessOpticalPathFactorTool.execute;
export default lensThicknessOpticalPathFactorTool;
