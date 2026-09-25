import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly octet: number };
export type Output = { readonly value: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { octet: { type: "integer", minimum: 0, maximum: 255 } },
  required: ["octet"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "integer" } },
  required: ["value"],
} as const;
/** Calculate msgpack fixint signed value from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { octet } = input;
  const compute = (): Output => {
    H.integer(octet, 0, 255);
    H.domain(octet <= 127 || octet >= 224);
    return { value: octet >= 224 ? octet - 256 : octet };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { octet: 255 },
  output: { value: -1 },
} satisfies ToolExample<Input, Output>;
export const msgpackFixintSignedValueTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "decode/msgpack-fixint-signed-value",
    title: "Msgpack Fixint Signed Value Tool",
    description:
      "Calculate msgpack fixint signed value from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { octet: { type: "integer", minimum: 0, maximum: 255 } },
      required: ["octet"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { value: { type: "integer" } },
      required: ["value"],
    },
    ports: {
      inputs: [
        {
          id: "octet",
          label: "Octet",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "value", label: "Value", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = msgpackFixintSignedValueTool.execute;
export default msgpackFixintSignedValueTool;
