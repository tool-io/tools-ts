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
  readonly lengths: readonly number[];
  readonly position: number;
};
export type Output = { readonly run: number; readonly offset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lengths: { type: "array", maxItems: 256, items: { type: "integer" } },
    position: { type: "integer", minimum: 0 },
  },
  required: ["lengths", "position"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { run: { type: "integer" }, offset: { type: "integer" } },
  required: ["run", "offset"],
} as const;
/** Compute sequence run length decoded position from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { lengths, position } = input;
  const compute = (): Output => {
    domain(lengths.every((x) => x >= 1));
    integer(position, 0, lengths.reduce((a, b) => a + b, 0) - 1);
    let s = 0;
    for (let i = 0; i < lengths.length; i++) {
      if (position < s + lengths[i]) return { run: i, offset: position - s };
      s += lengths[i];
    }
    throw new Error("Unreachable position");
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { lengths: [2, 3, 1], position: 4 },
  output: { run: 1, offset: 2 },
} satisfies ToolExample<Input, Output>;
export const sequenceRunLengthDecodedPositionTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "sequence/sequence-run-length-decoded-position",
  title: "Sequence Run Length Decoded Position Tool",
  description:
    "Compute sequence run length decoded position from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "lengths",
        label: "Lengths",
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
      { id: "run", label: "Run", valueType: { type: "integer" } },
      { id: "offset", label: "Offset", valueType: { type: "integer" } },
    ],
  },
});
export const run = sequenceRunLengthDecodedPositionTool.execute;
export default sequenceRunLengthDecodedPositionTool;
