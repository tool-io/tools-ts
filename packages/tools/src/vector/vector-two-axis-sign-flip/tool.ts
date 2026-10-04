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
  readonly vector: readonly number[];
  readonly first: number;
  readonly second: number;
};
export type Output = { readonly vector: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vector: { type: "array", maxItems: 256, items: { type: "number" } },
    first: { type: "integer", minimum: 0 },
    second: { type: "integer", minimum: 0 },
  },
  required: ["vector", "first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vector: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["vector"],
} as const;
/** Compute vector two axis sign flip from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { vector, first, second } = input;
  const compute = (): Output => {
    integer(first, 0, vector.length - 1);
    integer(second, 0, vector.length - 1);
    domain(first !== second);
    return {
      vector: vector.map((x, i) => (i === first || i === second ? -x : x)),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { vector: [1, 2, 3], first: 0, second: 2 },
  output: { vector: [-1, 2, -3] },
} satisfies ToolExample<Input, Output>;
export const vectorTwoAxisSignFlipTool = defineSchemaCalculation<Input, Output>(
  {
    id: "vector/vector-two-axis-sign-flip",
    title: "Vector Two Axis Sign Flip Tool",
    description:
      "Compute vector two axis sign flip from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "vector",
          label: "Vector",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "vector",
          label: "Vector",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
);
export const run = vectorTwoAxisSignFlipTool.execute;
export default vectorTwoAxisSignFlipTool;
