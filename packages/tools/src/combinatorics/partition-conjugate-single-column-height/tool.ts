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
  readonly partition: readonly number[];
  readonly column: number;
};
export type Output = { readonly height: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    partition: { type: "array", maxItems: 256, items: { type: "integer" } },
    column: { type: "integer", minimum: 1 },
  },
  required: ["partition", "column"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { height: { type: "integer" } },
  required: ["height"],
} as const;
/** Compute partition conjugate single column height from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { partition, column } = input;
  const compute = (): Output => {
    domain(
      partition.every((x, i) => x >= 1 && (i === 0 || x <= partition[i - 1])),
    );
    integer(column, 1);
    return { height: partition.filter((x) => x >= column).length };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { partition: [4, 2, 1], column: 2 },
  output: { height: 2 },
} satisfies ToolExample<Input, Output>;
export const partitionConjugateSingleColumnHeightTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "combinatorics/partition-conjugate-single-column-height",
  title: "Partition Conjugate Single Column Height Tool",
  description:
    "Compute partition conjugate single column height from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "partition",
        label: "Partition",
        required: true,
        valueType: { type: "list", items: { type: "integer" } },
      },
      {
        id: "column",
        label: "Column",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "height", label: "Height", valueType: { type: "integer" } },
    ],
  },
});
export const run = partitionConjugateSingleColumnHeightTool.execute;
export default partitionConjugateSingleColumnHeightTool;
