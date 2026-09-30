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
export type Input = {
  readonly source: string;
  readonly target: string;
  readonly transfers: number;
  readonly stride: number;
};
export type Output = {
  readonly source: string;
  readonly finalTarget: string;
  readonly bytesAdvanced: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    source: { type: "string", maxLength: 8192 },
    target: { type: "string", maxLength: 8192 },
    transfers: { type: "integer", minimum: 0, maximum: 1000000 },
    stride: { type: "integer", minimum: 1, maximum: 65536 },
  },
  required: ["source", "target", "transfers", "stride"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    source: { type: "string", maxLength: 8192 },
    finalTarget: { type: "string", maxLength: 8192 },
    bytesAdvanced: { type: "number" },
  },
  required: ["source", "finalTarget", "bytesAdvanced"],
} as const;
/** Compute dma fixed source increment target address from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { source, target, transfers, stride } = input;
  const compute = (): Output => {
    const a = decimal(source),
      b = decimal(target);
    domain(a >= 0n && b >= 0n);
    integer(transfers, 0, 1000000);
    integer(stride, 1, 65536);
    return {
      source: a.toString(),
      finalTarget: (b + BigInt(transfers) * BigInt(stride)).toString(),
      bytesAdvanced: transfers * stride,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { source: "100", target: "200", transfers: 4, stride: 2 },
  output: { source: "100", finalTarget: "208", bytesAdvanced: 8 },
} satisfies ToolExample<Input, Output>;
export const dmaFixedSourceIncrementTargetAddressTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "microcontroller/dma-fixed-source-increment-target-address",
  title: "DMA Fixed Source Increment Target Address Tool",
  description:
    "Compute dma fixed source increment target address from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "source",
        label: "Source",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "target",
        label: "Target",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "transfers",
        label: "Transfers",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "stride",
        label: "Stride",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "source", label: "Source", valueType: { type: "string" } },
      {
        id: "finalTarget",
        label: "Final Target",
        valueType: { type: "string" },
      },
      {
        id: "bytesAdvanced",
        label: "Bytes Advanced",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = dmaFixedSourceIncrementTargetAddressTool.execute;
export default dmaFixedSourceIncrementTargetAddressTool;
