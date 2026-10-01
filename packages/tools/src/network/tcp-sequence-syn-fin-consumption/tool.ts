import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly payloadBytes: number;
  readonly syn: boolean;
  readonly fin: boolean;
};
export type Output = { readonly sequenceSpace: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    payloadBytes: { type: "integer", minimum: 0, maximum: 4294967293 },
    syn: { type: "boolean" },
    fin: { type: "boolean" },
  },
  required: ["payloadBytes", "syn", "fin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sequenceSpace: { type: "integer" } },
  required: ["sequenceSpace"],
} as const;
/** Calculate tcp sequence syn fin consumption from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { payloadBytes, syn, fin } = request;
  const compute = (): Output => {
    H.integer(payloadBytes, 0, 4294967293);
    return { sequenceSpace: payloadBytes + (syn ? 1 : 0) + (fin ? 1 : 0) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { payloadBytes: 100, syn: true, fin: false },
  output: { sequenceSpace: 101 },
} satisfies ToolExample<Input, Output>;
export const tcpSequenceSynFinConsumptionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "network/tcp-sequence-syn-fin-consumption",
    title: "TCP Sequence Syn Fin Consumption Tool",
    description:
      "Calculate tcp sequence syn fin consumption from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        payloadBytes: { type: "integer", minimum: 0, maximum: 4294967293 },
        syn: { type: "boolean" },
        fin: { type: "boolean" },
      },
      required: ["payloadBytes", "syn", "fin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sequenceSpace: { type: "integer" } },
      required: ["sequenceSpace"],
    },
    ports: {
      inputs: [
        {
          id: "payloadBytes",
          label: "Payload Bytes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "syn",
          label: "Syn",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "fin",
          label: "Fin",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "sequenceSpace",
          label: "Sequence Space",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = tcpSequenceSynFinConsumptionTool.execute;
export default tcpSequenceSynFinConsumptionTool;
