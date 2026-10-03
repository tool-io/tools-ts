import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly definite: readonly string[];
  readonly possible: readonly string[];
};
export type Output = { readonly minimum: number; readonly maximum: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    definite: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    possible: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["definite", "possible"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { minimum: { type: "integer" }, maximum: { type: "integer" } },
  required: ["minimum", "maximum"],
} as const;
/** Compute bounded set cardinality uncertainty pair from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { definite, possible } = input;
  const compute = (): Output => {
    const known = new Set(definite),
      all = new Set(possible);
    domain([...known].every((x) => all.has(x)));
    return { minimum: known.size, maximum: all.size };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { definite: ["a"], possible: ["a", "b", "b"] },
  output: { minimum: 1, maximum: 2 },
} satisfies ToolExample<Input, Output>;
export const boundedSetCardinalityUncertaintyPairTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "set/bounded-set-cardinality-uncertainty-pair",
  title: "Bounded Set Cardinality Uncertainty Pair Tool",
  description:
    "Compute bounded set cardinality uncertainty pair from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "definite",
        label: "Definite",
        required: true,
        valueType: { type: "list", items: { type: "string" } },
      },
      {
        id: "possible",
        label: "Possible",
        required: true,
        valueType: { type: "list", items: { type: "string" } },
      },
    ],
    outputs: [
      { id: "minimum", label: "Minimum", valueType: { type: "integer" } },
      { id: "maximum", label: "Maximum", valueType: { type: "integer" } },
    ],
  },
});
export const run = boundedSetCardinalityUncertaintyPairTool.execute;
export default boundedSetCardinalityUncertaintyPairTool;
