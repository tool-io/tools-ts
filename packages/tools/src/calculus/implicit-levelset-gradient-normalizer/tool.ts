import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  positive,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly gradient: readonly number[] };
export type Output = {
  readonly normal: readonly number[];
  readonly magnitude: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gradient: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["gradient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normal: { type: "array", maxItems: 256, items: { type: "number" } },
    magnitude: { type: "number" },
  },
  required: ["normal", "magnitude"],
} as const;
/** Compute implicit levelset gradient normalizer from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { gradient } = input;
  const compute = (): Output => {
    const magnitude = Math.hypot(...gradient);
    positive(magnitude);
    return { normal: gradient.map((x) => x / magnitude), magnitude };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { gradient: [3, 4] },
  output: { normal: [0.6, 0.8], magnitude: 5 },
} satisfies ToolExample<Input, Output>;
export const implicitLevelsetGradientNormalizerTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "calculus/implicit-levelset-gradient-normalizer",
  title: "Implicit Levelset Gradient Normalizer Tool",
  description:
    "Compute implicit levelset gradient normalizer from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "gradient",
        label: "Gradient",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
    ],
    outputs: [
      {
        id: "normal",
        label: "Normal",
        valueType: { type: "list", items: { type: "number" } },
      },
      { id: "magnitude", label: "Magnitude", valueType: { type: "number" } },
    ],
  },
});
export const run = implicitLevelsetGradientNormalizerTool.execute;
export default implicitLevelsetGradientNormalizerTool;
