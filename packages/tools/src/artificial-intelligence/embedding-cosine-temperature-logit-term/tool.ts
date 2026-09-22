import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: readonly number[];
  readonly second: readonly number[];
  readonly temperature: number;
};
export type Output = { readonly cosine: number; readonly logit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "array", maxItems: 256, items: { type: "number" } },
    second: { type: "array", maxItems: 256, items: { type: "number" } },
    temperature: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["first", "second", "temperature"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cosine: { type: "number" }, logit: { type: "number" } },
  required: ["cosine", "logit"],
} as const;
/** Calculate embedding cosine temperature logit term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, temperature } = request;
  const compute = (): Output => {
    H.sameLength(first, second);
    H.positive(Math.hypot(...first));
    H.positive(Math.hypot(...second));
    H.positive(temperature);
    return {
      cosine:
        H.dot(first, second) / (Math.hypot(...first) * Math.hypot(...second)),
      logit:
        H.dot(first, second) /
        (Math.hypot(...first) * Math.hypot(...second) * temperature),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: [1, 0], second: [1, 1], temperature: 0.5 },
  output: { cosine: 0.7071067811865475, logit: 1.414213562373095 },
} satisfies ToolExample<Input, Output>;
export const embeddingCosineTemperatureLogitTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "artificial-intelligence/embedding-cosine-temperature-logit-term",
      title: "Embedding Cosine Temperature Logit Term Tool",
      description:
        "Calculate embedding cosine temperature logit term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          first: { type: "array", maxItems: 256, items: { type: "number" } },
          second: { type: "array", maxItems: 256, items: { type: "number" } },
          temperature: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["first", "second", "temperature"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { cosine: { type: "number" }, logit: { type: "number" } },
        required: ["cosine", "logit"],
      },
      ports: {
        inputs: [
          {
            id: "first",
            label: "First",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "second",
            label: "Second",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "temperature",
            label: "Temperature",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "cosine", label: "Cosine", valueType: { type: "number" } },
          { id: "logit", label: "Logit", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = embeddingCosineTemperatureLogitTermTool.execute;
export default embeddingCosineTemperatureLogitTermTool;
