import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentWeight: number;
  readonly transferFraction: number;
};
export type Output = {
  readonly transferredWeight: number;
  readonly retainedWeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentWeight: { type: "number", minimum: 0 },
    transferFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["currentWeight", "transferFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transferredWeight: { type: "number" },
    retainedWeight: { type: "number" },
  },
  required: ["transferredWeight", "retainedWeight"],
} as const;
/** Split one ballot's current weight using an explicitly supplied transfer fraction; no surplus-transfer election method is chosen. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentWeight, transferFraction } = request;
  const compute = (): Output => {
    H.domain(currentWeight >= 0, "currentWeight");
    (H.domain(
      transferFraction >= 0 && transferFraction <= 1,
      "transferFraction",
    ),
      transferFraction);
    return {
      transferredWeight: currentWeight * transferFraction,
      retainedWeight: currentWeight * (1 - transferFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { currentWeight: 0.8, transferFraction: 0.25 },
  output: { transferredWeight: 0.2, retainedWeight: 0.6000000000000001 },
} satisfies ToolExample<Input, Output>;
export const voteTransferBallotWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/vote-transfer-ballot-weight",
    title: "Vote Transfer Ballot Weight Tool",
    description:
      "Split one ballot's current weight using an explicitly supplied transfer fraction; no surplus-transfer election method is chosen.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentWeight: { type: "number", minimum: 0 },
        transferFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["currentWeight", "transferFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        transferredWeight: { type: "number" },
        retainedWeight: { type: "number" },
      },
      required: ["transferredWeight", "retainedWeight"],
    },
    ports: {
      inputs: [
        {
          id: "currentWeight",
          label: "Current Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "transferFraction",
          label: "Transfer Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "transferredWeight",
          label: "Transferred Weight",
          valueType: { type: "number" },
        },
        {
          id: "retainedWeight",
          label: "Retained Weight",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = voteTransferBallotWeightTool.execute;
export default voteTransferBallotWeightTool;
