import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly diffusionNumber: number;
  readonly dimensions: number;
};
export type Output = {
  readonly centerWeight: number;
  readonly negativeCenter: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diffusionNumber: { type: "number", minimum: 0 },
    dimensions: { type: "integer", minimum: 1 },
  },
  required: ["diffusionNumber", "dimensions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centerWeight: { type: "number" },
    negativeCenter: { type: "boolean" },
  },
  required: ["centerWeight", "negativeCenter"],
} as const;
/** Center weight of an equal-spacing explicit nearest-neighbor heat stencil; no general solver stability proof. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { diffusionNumber, dimensions } = request;
  const compute = (): Output => {
    H.domain(diffusionNumber >= 0);
    H.integer(dimensions, 1);
    return {
      centerWeight: 1 - 2 * dimensions * diffusionNumber,
      negativeCenter: 1 - 2 * dimensions * diffusionNumber < 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { diffusionNumber: 0.2, dimensions: 2 },
  output: { centerWeight: 0.19999999999999996, negativeCenter: false },
} satisfies ToolExample<Input, Output>;
export const heatStencilNegativeWeightFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-physics/heat-stencil-negative-weight-flag",
    title: "Heat Stencil Negative Weight Flag Tool",
    description:
      "Center weight of an equal-spacing explicit nearest-neighbor heat stencil; no general solver stability proof.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        diffusionNumber: { type: "number", minimum: 0 },
        dimensions: { type: "integer", minimum: 1 },
      },
      required: ["diffusionNumber", "dimensions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        centerWeight: { type: "number" },
        negativeCenter: { type: "boolean" },
      },
      required: ["centerWeight", "negativeCenter"],
    },
    ports: {
      inputs: [
        {
          id: "diffusionNumber",
          label: "Diffusion Number",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dimensions",
          label: "Dimensions",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "centerWeight",
          label: "Center Weight",
          valueType: { type: "number" },
        },
        {
          id: "negativeCenter",
          label: "Negative Center",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = heatStencilNegativeWeightFlagTool.execute;
export default heatStencilNegativeWeightFlagTool;
