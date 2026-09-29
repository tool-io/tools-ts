import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly headGradient: readonly number[];
  readonly direction: readonly number[];
};
export type Output = { readonly gradient: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headGradient: { type: "array", maxItems: 256, items: { type: "number" } },
    direction: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["headGradient", "direction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gradient: { type: "number" } },
  required: ["gradient"],
} as const;
/** Calculate groundwater hydraulic gradient projection from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { headGradient, direction } = request;
  const compute = (): Output => {
    H.sameLength(headGradient, direction);
    H.positive(Math.hypot(...direction));
    return {
      gradient: H.dot(headGradient, direction) / Math.hypot(...direction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { headGradient: [0.02, -0.01], direction: [3, 0] },
  output: { gradient: 0.02 },
} satisfies ToolExample<Input, Output>;
export const groundwaterHydraulicGradientProjectionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hydrology/groundwater-hydraulic-gradient-projection",
      title: "Groundwater Hydraulic Gradient Projection Tool",
      description:
        "Calculate groundwater hydraulic gradient projection from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          headGradient: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          direction: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["headGradient", "direction"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { gradient: { type: "number" } },
        required: ["gradient"],
      },
      ports: {
        inputs: [
          {
            id: "headGradient",
            label: "Head Gradient",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "direction",
            label: "Direction",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          { id: "gradient", label: "Gradient", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = groundwaterHydraulicGradientProjectionTool.execute;
export default groundwaterHydraulicGradientProjectionTool;
