import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly value: number };
export type Output = { readonly octet: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "integer", minimum: 0, maximum: 127 } },
  required: ["value"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { octet: { type: "integer" } },
  required: ["octet"],
} as const;
/** Calculate msgpack positive fixint octet from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { value } = input;
  const compute = (): Output => {
    H.integer(value, 0, 127);
    return { octet: value };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: 42 },
  output: { octet: 42 },
} satisfies ToolExample<Input, Output>;
export const msgpackPositiveFixintOctetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "encode/msgpack-positive-fixint-octet",
    title: "Msgpack Positive Fixint Octet Tool",
    description:
      "Calculate msgpack positive fixint octet from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { value: { type: "integer", minimum: 0, maximum: 127 } },
      required: ["value"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { octet: { type: "integer" } },
      required: ["octet"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "octet", label: "Octet", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = msgpackPositiveFixintOctetTool.execute;
export default msgpackPositiveFixintOctetTool;
