import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly start: number;
  readonly length: number;
  readonly messageLength: number;
};
export type Output = { readonly endExclusive: number; readonly fits: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "integer", minimum: 0 },
    length: { type: "integer", minimum: 0, maximum: 65535 },
    messageLength: { type: "integer", minimum: 0 },
  },
  required: ["start", "length", "messageLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { endExclusive: { type: "integer" }, fits: { type: "boolean" } },
  required: ["endExclusive", "fits"],
} as const;
/** Calculate dns resource record rdata span from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { start, length, messageLength } = request;
  const compute = (): Output => {
    H.integer(start, 0);
    H.integer(length, 0, 65535);
    H.integer(messageLength, 0);
    const endExclusive = start + length;
    return { endExclusive, fits: endExclusive <= messageLength };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { start: 40, length: 4, messageLength: 100 },
  output: { endExclusive: 44, fits: true },
} satisfies ToolExample<Input, Output>;
export const dnsResourceRecordRdataSpanTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "network/dns-resource-record-rdata-span",
    title: "DNS Resource Record Rdata Span Tool",
    description:
      "Calculate dns resource record rdata span from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        start: { type: "integer", minimum: 0 },
        length: { type: "integer", minimum: 0, maximum: 65535 },
        messageLength: { type: "integer", minimum: 0 },
      },
      required: ["start", "length", "messageLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        endExclusive: { type: "integer" },
        fits: { type: "boolean" },
      },
      required: ["endExclusive", "fits"],
    },
    ports: {
      inputs: [
        {
          id: "start",
          label: "Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "messageLength",
          label: "Message Length",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "endExclusive",
          label: "End Exclusive",
          valueType: { type: "integer" },
        },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = dnsResourceRecordRdataSpanTool.execute;
export default dnsResourceRecordRdataSpanTool;
