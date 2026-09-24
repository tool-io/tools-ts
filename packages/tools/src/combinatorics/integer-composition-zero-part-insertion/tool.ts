import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly parts: readonly number[];
  readonly position: number;
};
export type Output = { readonly parts: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parts: { type: "array", maxItems: 256, items: { type: "integer" } },
    position: { type: "integer", minimum: 0 },
  },
  required: ["parts", "position"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parts: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["parts"],
} as const;
/** Compute integer composition zero part insertion from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { parts, position } = input;
  const compute = (): Output => {
    domain(parts.every((x) => x >= 0) && parts.length < 256);
    integer(position, 0, parts.length);
    return {
      parts: [...parts.slice(0, position), 0, ...parts.slice(position)],
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { parts: [2, 3], position: 1 },
  output: { parts: [2, 0, 3] },
} satisfies ToolExample<Input, Output>;
export const integerCompositionZeroPartInsertionTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "combinatorics/integer-composition-zero-part-insertion",
  title: "Integer Composition Zero Part Insertion Tool",
  description:
    "Compute integer composition zero part insertion from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "parts",
        label: "Parts",
        required: true,
        valueType: { type: "list", items: { type: "integer" } },
      },
      {
        id: "position",
        label: "Position",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "parts",
        label: "Parts",
        valueType: { type: "list", items: { type: "integer" } },
      },
    ],
  },
});
export const run = integerCompositionZeroPartInsertionTool.execute;
export default integerCompositionZeroPartInsertionTool;
