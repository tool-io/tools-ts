import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  positive,
  probability,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly mass: number; readonly order: number };
export type Output = { readonly term: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mass: { type: "number", minimum: 0, maximum: 1 },
    order: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["mass", "order"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { term: { type: "number" } },
  required: ["term"],
} as const;
/** Compute tsallis entropy one symbol term from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { mass, order } = input;
  const compute = (): Output => {
    probability(mass);
    positive(order);
    domain(order !== 1);
    return { term: (mass - mass ** order) / (order - 1) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { mass: 0.5, order: 2 },
  output: { term: 0.25 },
} satisfies ToolExample<Input, Output>;
export const tsallisEntropyOneSymbolTermTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "information/tsallis-entropy-one-symbol-term",
  title: "Tsallis Entropy One Symbol Term Tool",
  description:
    "Compute tsallis entropy one symbol term from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "mass",
        label: "Mass",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "order",
        label: "Order",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [{ id: "term", label: "Term", valueType: { type: "number" } }],
  },
});
export const run = tsallisEntropyOneSymbolTermTool.execute;
export default tsallisEntropyOneSymbolTermTool;
