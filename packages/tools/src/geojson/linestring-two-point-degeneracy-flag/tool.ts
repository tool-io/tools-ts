import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly first: readonly number[];
  readonly second: readonly number[];
};
export type Output = { readonly degenerate: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "array", maxItems: 256, items: { type: "number" } },
    second: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { degenerate: { type: "boolean" } },
  required: ["degenerate"],
} as const;
/** Compute linestring two point degeneracy flag from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { first, second } = input;
  const compute = (): Output => {
    domain(first.length >= 2 && second.length === first.length);
    return { degenerate: first.every((x, i) => x === second[i]) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { first: [1, 2], second: [1, 2] },
  output: { degenerate: true },
} satisfies ToolExample<Input, Output>;
export const linestringTwoPointDegeneracyFlagTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "geojson/linestring-two-point-degeneracy-flag",
  title: "Linestring Two Point Degeneracy Flag Tool",
  description:
    "Compute linestring two point degeneracy flag from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
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
    ],
    outputs: [
      { id: "degenerate", label: "Degenerate", valueType: { type: "boolean" } },
    ],
  },
});
export const run = linestringTwoPointDegeneracyFlagTool.execute;
export default linestringTwoPointDegeneracyFlagTool;
