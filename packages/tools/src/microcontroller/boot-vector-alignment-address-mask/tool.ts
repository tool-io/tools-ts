import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly address: number; readonly alignment: number };
export type Output = { readonly aligned: number; readonly offset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    address: { type: "integer", minimum: 0, maximum: 4294967295 },
    alignment: { type: "integer", minimum: 1, maximum: 2147483648 },
  },
  required: ["address", "alignment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { aligned: { type: "integer" }, offset: { type: "integer" } },
  required: ["aligned", "offset"],
} as const;
/** Calculate boot vector alignment address mask from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { address, alignment } = input;
  const compute = (): Output => {
    H.integer(address, 0, 4294967295);
    H.integer(alignment, 1, 2147483648);
    H.domain(Number.isInteger(Math.log2(alignment)));
    const offset = address % alignment;
    return { aligned: address - offset, offset };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { address: 4660, alignment: 256 },
  output: { aligned: 4608, offset: 52 },
} satisfies ToolExample<Input, Output>;
export const bootVectorAlignmentAddressMaskTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/boot-vector-alignment-address-mask",
    title: "Boot Vector Alignment Address Mask Tool",
    description:
      "Calculate boot vector alignment address mask from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        address: { type: "integer", minimum: 0, maximum: 4294967295 },
        alignment: { type: "integer", minimum: 1, maximum: 2147483648 },
      },
      required: ["address", "alignment"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { aligned: { type: "integer" }, offset: { type: "integer" } },
      required: ["aligned", "offset"],
    },
    ports: {
      inputs: [
        {
          id: "address",
          label: "Address",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "alignment",
          label: "Alignment",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "aligned", label: "Aligned", valueType: { type: "integer" } },
        { id: "offset", label: "Offset", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = bootVectorAlignmentAddressMaskTool.execute;
export default bootVectorAlignmentAddressMaskTool;
