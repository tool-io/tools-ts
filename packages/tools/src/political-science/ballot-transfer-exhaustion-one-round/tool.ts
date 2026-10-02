import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly transferable: number;
  readonly exhausted: number;
  readonly receivedByCandidates: readonly number[];
};
export type Output = {
  readonly continuing: number;
  readonly accounted: number;
  readonly balanced: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transferable: { type: "integer", minimum: 0 },
    exhausted: { type: "integer", minimum: 0 },
    receivedByCandidates: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["transferable", "exhausted", "receivedByCandidates"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    continuing: { type: "integer" },
    accounted: { type: "integer" },
    balanced: { type: "boolean" },
  },
  required: ["continuing", "accounted", "balanced"],
} as const;
/** Calculate ballot transfer exhaustion one round from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { transferable, exhausted, receivedByCandidates } = request;
  const compute = (): Output => {
    H.integer(transferable, 0);
    H.integer(exhausted, 0, transferable);
    H.domain(receivedByCandidates.every((x) => x >= 0));
    return {
      continuing: receivedByCandidates.reduce((a, b) => a + b, 0),
      accounted: exhausted + receivedByCandidates.reduce((a, b) => a + b, 0),
      balanced:
        transferable ===
        exhausted + receivedByCandidates.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { transferable: 100, exhausted: 10, receivedByCandidates: [40, 50] },
  output: { continuing: 90, accounted: 100, balanced: true },
} satisfies ToolExample<Input, Output>;
export const ballotTransferExhaustionOneRoundTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/ballot-transfer-exhaustion-one-round",
    title: "Ballot Transfer Exhaustion One Round Tool",
    description:
      "Calculate ballot transfer exhaustion one round from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        transferable: { type: "integer", minimum: 0 },
        exhausted: { type: "integer", minimum: 0 },
        receivedByCandidates: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["transferable", "exhausted", "receivedByCandidates"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        continuing: { type: "integer" },
        accounted: { type: "integer" },
        balanced: { type: "boolean" },
      },
      required: ["continuing", "accounted", "balanced"],
    },
    ports: {
      inputs: [
        {
          id: "transferable",
          label: "Transferable",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "exhausted",
          label: "Exhausted",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "receivedByCandidates",
          label: "Received By Candidates",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "continuing",
          label: "Continuing",
          valueType: { type: "integer" },
        },
        { id: "accounted", label: "Accounted", valueType: { type: "integer" } },
        { id: "balanced", label: "Balanced", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = ballotTransferExhaustionOneRoundTool.execute;
export default ballotTransferExhaustionOneRoundTool;
