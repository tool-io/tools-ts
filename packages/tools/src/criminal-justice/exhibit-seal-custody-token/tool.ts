import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedSeal: string;
  readonly expectedSeal: string;
  readonly sender: string;
  readonly receiver: string;
  readonly handedOver: boolean;
};
export type Output = {
  readonly sealMatches: boolean;
  readonly attributedTransfer: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedSeal: { type: "string", maxLength: 8192 },
    expectedSeal: { type: "string", maxLength: 8192 },
    sender: { type: "string", maxLength: 8192 },
    receiver: { type: "string", maxLength: 8192 },
    handedOver: { type: "boolean" },
  },
  required: [
    "recordedSeal",
    "expectedSeal",
    "sender",
    "receiver",
    "handedOver",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sealMatches: { type: "boolean" },
    attributedTransfer: { type: "boolean" },
  },
  required: ["sealMatches", "attributedTransfer"],
} as const;
/** Compare explicit seal and handover metadata without asserting authenticity or chain-of-custody validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedSeal, expectedSeal, sender, receiver, handedOver } = request;
  const compute = (): Output => {
    return {
      sealMatches: recordedSeal === expectedSeal,
      attributedTransfer:
        handedOver && sender.length > 0 && receiver.length > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordedSeal: "S1",
    expectedSeal: "S1",
    sender: "A",
    receiver: "B",
    handedOver: true,
  },
  output: { sealMatches: true, attributedTransfer: true },
} satisfies ToolExample<Input, Output>;
export const exhibitSealCustodyTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "criminal-justice/exhibit-seal-custody-token",
    title: "Exhibit Seal Custody Token Tool",
    description:
      "Compare explicit seal and handover metadata without asserting authenticity or chain-of-custody validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedSeal: { type: "string", maxLength: 8192 },
        expectedSeal: { type: "string", maxLength: 8192 },
        sender: { type: "string", maxLength: 8192 },
        receiver: { type: "string", maxLength: 8192 },
        handedOver: { type: "boolean" },
      },
      required: [
        "recordedSeal",
        "expectedSeal",
        "sender",
        "receiver",
        "handedOver",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sealMatches: { type: "boolean" },
        attributedTransfer: { type: "boolean" },
      },
      required: ["sealMatches", "attributedTransfer"],
    },
    ports: {
      inputs: [
        {
          id: "recordedSeal",
          label: "Recorded Seal",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedSeal",
          label: "Expected Seal",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sender",
          label: "Sender",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "receiver",
          label: "Receiver",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "handedOver",
          label: "Handed Over",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "sealMatches",
          label: "Seal Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "attributedTransfer",
          label: "Attributed Transfer",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = exhibitSealCustodyTokenTool.execute;
export default exhibitSealCustodyTokenTool;
