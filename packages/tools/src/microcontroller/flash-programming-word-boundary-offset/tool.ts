import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
  decimal,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly address: string; readonly wordBytes: number };
export type Output = { readonly wordStart: string; readonly offset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    address: { type: "string", maxLength: 8192 },
    wordBytes: { type: "integer", minimum: 1, maximum: 256 },
  },
  required: ["address", "wordBytes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wordStart: { type: "string", maxLength: 8192 },
    offset: { type: "integer" },
  },
  required: ["wordStart", "offset"],
} as const;
/** Compute flash programming word boundary offset from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { address, wordBytes } = input;
  const compute = (): Output => {
    integer(wordBytes, 1, 256);
    const a = decimal(address);
    domain(a >= 0n);
    const offset = Number(a % BigInt(wordBytes));
    return { wordStart: (a - BigInt(offset)).toString(), offset };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { address: "4099", wordBytes: 4 },
  output: { wordStart: "4096", offset: 3 },
} satisfies ToolExample<Input, Output>;
export const flashProgrammingWordBoundaryOffsetTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "microcontroller/flash-programming-word-boundary-offset",
  title: "Flash Programming Word Boundary Offset Tool",
  description:
    "Compute flash programming word boundary offset from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "address",
        label: "Address",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "wordBytes",
        label: "Word Bytes",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "wordStart", label: "Word Start", valueType: { type: "string" } },
      { id: "offset", label: "Offset", valueType: { type: "integer" } },
    ],
  },
});
export const run = flashProgrammingWordBoundaryOffsetTool.execute;
export default flashProgrammingWordBoundaryOffsetTool;
