import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly displacementComponents: readonly number[] };
export type Output = { readonly squaredDisplacement: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    displacementComponents: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["displacementComponents"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { squaredDisplacement: { type: "number" } },
  required: ["squaredDisplacement"],
} as const;
/** Sum squares of supplied displacement components without averaging or estimating a diffusion coefficient. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { displacementComponents } = request;
  const compute = (): Output => {
    return {
      squaredDisplacement: displacementComponents.reduce(
        (sum, value) => sum + value * value,
        0,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { displacementComponents: [3, 4] },
  output: { squaredDisplacement: 25 },
} satisfies ToolExample<Input, Output>;
export const diffusionStepSquaredDisplacementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biophysics", "physics"],
      keywords: ["biophysics", "physics"],
    },
    id: "biophysics/diffusion-step-squared-displacement",
    title: "Diffusion Step Squared Displacement",
    description:
      "Sum squares of supplied displacement components without averaging or estimating a diffusion coefficient.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        displacementComponents: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["displacementComponents"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { squaredDisplacement: { type: "number" } },
      required: ["squaredDisplacement"],
    },
    ports: {
      inputs: [
        {
          id: "displacementComponents",
          label: "Displacement Components",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "squaredDisplacement",
          label: "Squared Displacement",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = diffusionStepSquaredDisplacementTool.execute;
export default diffusionStepSquaredDisplacementTool;
