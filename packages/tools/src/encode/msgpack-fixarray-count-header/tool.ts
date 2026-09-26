import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly count: number };
export type Output = { readonly octet: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { count: { type: "integer", minimum: 0, maximum: 15 } },
  required: ["count"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { octet: { type: "integer" } },
  required: ["octet"],
} as const;
/** Calculate msgpack fixarray count header from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { count } = input;
  const compute = (): Output => {
    H.integer(count, 0, 15);
    return { octet: 144 + count };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { count: 5 },
  output: { octet: 149 },
} satisfies ToolExample<Input, Output>;
export const msgpackFixarrayCountHeaderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "encode/msgpack-fixarray-count-header",
    title: "Msgpack Fixarray Count Header Tool",
    description:
      "Calculate msgpack fixarray count header from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { count: { type: "integer", minimum: 0, maximum: 15 } },
      required: ["count"],
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
          id: "count",
          label: "Count",
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
export const run = msgpackFixarrayCountHeaderTool.execute;
export default msgpackFixarrayCountHeaderTool;
