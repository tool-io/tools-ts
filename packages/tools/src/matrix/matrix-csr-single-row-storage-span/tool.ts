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
  readonly rowPointers: readonly number[];
  readonly row: number;
};
export type Output = {
  readonly start: number;
  readonly endExclusive: number;
  readonly count: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowPointers: { type: "array", maxItems: 256, items: { type: "integer" } },
    row: { type: "integer", minimum: 0 },
  },
  required: ["rowPointers", "row"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "integer" },
    endExclusive: { type: "integer" },
    count: { type: "integer" },
  },
  required: ["start", "endExclusive", "count"],
} as const;
/** Compute matrix csr single row storage span from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { rowPointers, row } = input;
  const compute = (): Output => {
    domain(
      rowPointers.length >= 2 &&
        rowPointers[0] === 0 &&
        rowPointers.every(
          (x, i) => x >= 0 && (i === 0 || x >= rowPointers[i - 1]),
        ),
    );
    integer(row, 0, rowPointers.length - 2);
    return {
      start: rowPointers[row],
      endExclusive: rowPointers[row + 1],
      count: rowPointers[row + 1] - rowPointers[row],
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { rowPointers: [0, 2, 2, 5], row: 1 },
  output: { start: 2, endExclusive: 2, count: 0 },
} satisfies ToolExample<Input, Output>;
export const matrixCsrSingleRowStorageSpanTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "matrix/matrix-csr-single-row-storage-span",
  title: "Matrix CSR Single Row Storage Span Tool",
  description:
    "Compute matrix csr single row storage span from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "rowPointers",
        label: "Row Pointers",
        required: true,
        valueType: { type: "list", items: { type: "integer" } },
      },
      {
        id: "row",
        label: "Row",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "start", label: "Start", valueType: { type: "integer" } },
      {
        id: "endExclusive",
        label: "End Exclusive",
        valueType: { type: "integer" },
      },
      { id: "count", label: "Count", valueType: { type: "integer" } },
    ],
  },
});
export const run = matrixCsrSingleRowStorageSpanTool.execute;
export default matrixCsrSingleRowStorageSpanTool;
