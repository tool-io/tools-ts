import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly servings: number;
  readonly milligramsPerServing: number;
};
export type Output = { readonly milligrams: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    servings: { type: "number", minimum: 0 },
    milligramsPerServing: { type: "number", minimum: 0 },
  },
  required: ["servings", "milligramsPerServing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { milligrams: { type: "number" } },
  required: ["milligrams"],
} as const;
/** Sum caffeine from explicit serving data only; no safety threshold or recommendation is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { servings, milligramsPerServing } = request;
  const compute = (): Output => {
    H.domain(servings >= 0 && milligramsPerServing >= 0);
    return { milligrams: servings * milligramsPerServing };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { servings: 2.5, milligramsPerServing: 80 },
  output: { milligrams: 200 },
} satisfies ToolExample<Input, Output>;
export const selfTrackedCaffeineServingArithmeticTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health/self-tracked-caffeine-serving-arithmetic",
      title: "Self Tracked Caffeine Serving Arithmetic Tool",
      description:
        "Sum caffeine from explicit serving data only; no safety threshold or recommendation is inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          servings: { type: "number", minimum: 0 },
          milligramsPerServing: { type: "number", minimum: 0 },
        },
        required: ["servings", "milligramsPerServing"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { milligrams: { type: "number" } },
        required: ["milligrams"],
      },
      ports: {
        inputs: [
          {
            id: "servings",
            label: "Servings",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "milligramsPerServing",
            label: "Milligrams Per Serving",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "milligrams",
            label: "Milligrams",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = selfTrackedCaffeineServingArithmeticTool.execute;
export default selfTrackedCaffeineServingArithmeticTool;
