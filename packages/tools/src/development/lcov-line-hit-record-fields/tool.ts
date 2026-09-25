import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly record: string };
export type Output = {
  readonly line: number;
  readonly hits: number;
  readonly checksum: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { record: { type: "string", maxLength: 8192 } },
  required: ["record"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    line: { type: "integer" },
    hits: { type: "integer" },
    checksum: { type: "string", maxLength: 8192 },
  },
  required: ["line", "hits", "checksum"],
} as const;
/** Compute lcov line hit record fields from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { record } = input;
  const compute = (): Output => {
    const m = /^DA:([1-9]\d{0,8}),(\d{1,12})(?:,([^,\r\n]+))?(?![\s\S])/.exec(
      record,
    );
    domain(m);
    return { line: Number(m[1]), hits: Number(m[2]), checksum: m[3] ?? "" };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { record: "DA:42,3,abc" },
  output: { line: 42, hits: 3, checksum: "abc" },
} satisfies ToolExample<Input, Output>;
export const lcovLineHitRecordFieldsTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "development/lcov-line-hit-record-fields",
  title: "LCOV Line Hit Record Fields Tool",
  description:
    "Compute lcov line hit record fields from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "record",
        label: "Record",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "line", label: "Line", valueType: { type: "integer" } },
      { id: "hits", label: "Hits", valueType: { type: "integer" } },
      { id: "checksum", label: "Checksum", valueType: { type: "string" } },
    ],
  },
});
export const run = lcovLineHitRecordFieldsTool.execute;
export default lcovLineHitRecordFieldsTool;
