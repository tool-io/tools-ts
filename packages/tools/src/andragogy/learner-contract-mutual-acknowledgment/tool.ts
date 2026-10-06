import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly learnerAcknowledged: boolean;
  readonly facilitatorAcknowledged: boolean;
};
export type Output = { readonly mutuallyAcknowledged: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    learnerAcknowledged: { type: "boolean" },
    facilitatorAcknowledged: { type: "boolean" },
  },
  required: ["learnerAcknowledged", "facilitatorAcknowledged"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { mutuallyAcknowledged: { type: "boolean" } },
  required: ["mutuallyAcknowledged"],
} as const;
/** Require both explicit learner and facilitator acknowledgment flags for mutual acknowledgment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { learnerAcknowledged, facilitatorAcknowledged } = request;
  const compute = (): Output => {
    return {
      mutuallyAcknowledged: learnerAcknowledged && facilitatorAcknowledged,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { learnerAcknowledged: true, facilitatorAcknowledged: true },
  output: { mutuallyAcknowledged: true },
} satisfies ToolExample<Input, Output>;
export const learnerContractMutualAcknowledgmentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["andragogy", "education"],
        keywords: ["andragogy", "education"],
      },
      id: "andragogy/learner-contract-mutual-acknowledgment",
      title: "Learner Contract Mutual Acknowledgment",
      description:
        "Require both explicit learner and facilitator acknowledgment flags for mutual acknowledgment.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          learnerAcknowledged: { type: "boolean" },
          facilitatorAcknowledged: { type: "boolean" },
        },
        required: ["learnerAcknowledged", "facilitatorAcknowledged"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { mutuallyAcknowledged: { type: "boolean" } },
        required: ["mutuallyAcknowledged"],
      },
      ports: {
        inputs: [
          {
            id: "learnerAcknowledged",
            label: "Learner Acknowledged",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "facilitatorAcknowledged",
            label: "Facilitator Acknowledged",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "mutuallyAcknowledged",
            label: "Mutually Acknowledged",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = learnerContractMutualAcknowledgmentTool.execute;
export default learnerContractMutualAcknowledgmentTool;
