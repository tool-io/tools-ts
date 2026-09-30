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
export type Input = { readonly address: string; readonly alignment: number };
export type Output = {
  readonly aligned: boolean;
  readonly nextAddress: string;
  readonly padding: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    address: { type: "string", maxLength: 8192 },
    alignment: { type: "integer", minimum: 1, maximum: 65536 },
  },
  required: ["address", "alignment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    aligned: { type: "boolean" },
    nextAddress: { type: "string", maxLength: 8192 },
    padding: { type: "integer" },
  },
  required: ["aligned", "nextAddress", "padding"],
} as const;
/** Compute dma transfer alignment margin from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { address, alignment } = input;
  const compute = (): Output => {
    integer(alignment, 1, 65536);
    domain((alignment & (alignment - 1)) === 0);
    const a = decimal(address);
    domain(a >= 0n);
    const r = Number(a % BigInt(alignment)),
      padding = (alignment - r) % alignment;
    return {
      aligned: r === 0,
      nextAddress: (a + BigInt(padding)).toString(),
      padding,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { address: "4097", alignment: 4 },
  output: { aligned: false, nextAddress: "4100", padding: 3 },
} satisfies ToolExample<Input, Output>;
export const dmaTransferAlignmentMarginTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "microcontroller/dma-transfer-alignment-margin",
  title: "DMA Transfer Alignment Margin Tool",
  description:
    "Compute dma transfer alignment margin from explicit bounded inputs.",
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
        id: "alignment",
        label: "Alignment",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "aligned", label: "Aligned", valueType: { type: "boolean" } },
      {
        id: "nextAddress",
        label: "Next Address",
        valueType: { type: "string" },
      },
      { id: "padding", label: "Padding", valueType: { type: "integer" } },
    ],
  },
});
export const run = dmaTransferAlignmentMarginTool.execute;
export default dmaTransferAlignmentMarginTool;
