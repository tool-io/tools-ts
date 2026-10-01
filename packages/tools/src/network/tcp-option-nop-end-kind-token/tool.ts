import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly kind: number };
export type Output = { readonly name: string; readonly singleOctet: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { kind: { type: "integer", minimum: 0, maximum: 255 } },
  required: ["kind"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string", maxLength: 8192 },
    singleOctet: { type: "boolean" },
  },
  required: ["name", "singleOctet"],
} as const;
/** Compute tcp option nop end kind token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { kind } = input;
  const compute = (): Output => {
    integer(kind, 0, 255);
    return {
      name:
        kind === 0
          ? "end-of-option-list"
          : kind === 1
            ? "no-operation"
            : "length-bearing-option",
      singleOctet: kind === 0 || kind === 1,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { kind: 0 },
  output: { name: "end-of-option-list", singleOctet: true },
} satisfies ToolExample<Input, Output>;
export const tcpOptionNopEndKindTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "network/tcp-option-nop-end-kind-token",
  title: "TCP Option Nop End Kind Token Tool",
  description:
    "Compute tcp option nop end kind token from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "kind",
        label: "Kind",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "name", label: "Name", valueType: { type: "string" } },
      {
        id: "singleOctet",
        label: "Single Octet",
        valueType: { type: "boolean" },
      },
    ],
  },
});
export const run = tcpOptionNopEndKindTokenTool.execute;
export default tcpOptionNopEndKindTokenTool;
