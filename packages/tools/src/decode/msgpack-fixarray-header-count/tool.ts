import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly octet: number };
export type Output = { readonly count: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { octet: { type: "integer", minimum: 144, maximum: 159 } },
  required: ["octet"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { count: { type: "integer" } },
  required: ["count"],
} as const;
/** Calculate msgpack fixarray header count from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { octet } = input;
  const compute = (): Output => {
    H.integer(octet, 144, 159);
    return { count: octet - 144 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { octet: 149 },
  output: { count: 5 },
} satisfies ToolExample<Input, Output>;
export const msgpackFixarrayHeaderCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "decode/msgpack-fixarray-header-count",
    title: "Msgpack Fixarray Header Count Tool",
    description:
      "Calculate msgpack fixarray header count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { octet: { type: "integer", minimum: 144, maximum: 159 } },
      required: ["octet"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { count: { type: "integer" } },
      required: ["count"],
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
        { id: "count", label: "Count", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = msgpackFixarrayHeaderCountTool.execute;
export default msgpackFixarrayHeaderCountTool;
