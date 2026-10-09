import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstInterviewId: string;
  readonly secondInterviewId: string;
  readonly firstParticipantId: string;
  readonly secondParticipantId: string;
};
export type Output = {
  readonly duplicateParticipant: boolean;
  readonly sameInterview: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstInterviewId: { type: "string", maxLength: 8192, minLength: 1 },
    secondInterviewId: { type: "string", maxLength: 8192, minLength: 1 },
    firstParticipantId: { type: "string", maxLength: 8192, minLength: 1 },
    secondParticipantId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: [
    "firstInterviewId",
    "secondInterviewId",
    "firstParticipantId",
    "secondParticipantId",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    duplicateParticipant: { type: "boolean" },
    sameInterview: { type: "boolean" },
  },
  required: ["duplicateParticipant", "sameInterview"],
} as const;
/** Flag distinct supplied interviews sharing an exact participant identifier without deducing personal identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstInterviewId,
    secondInterviewId,
    firstParticipantId,
    secondParticipantId,
  } = request;
  const compute = (): Output => {
    H.domain(firstInterviewId.length > 0, "firstInterviewId");
    H.domain(secondInterviewId.length > 0, "secondInterviewId");
    H.domain(firstParticipantId.length > 0, "firstParticipantId");
    H.domain(secondParticipantId.length > 0, "secondParticipantId");
    return {
      duplicateParticipant:
        firstInterviewId !== secondInterviewId &&
        firstParticipantId === secondParticipantId,
      sameInterview: firstInterviewId === secondInterviewId,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstInterviewId: "I17",
    secondInterviewId: "I18",
    firstParticipantId: "P4",
    secondParticipantId: "P4",
  },
  output: { duplicateParticipant: true, sameInterview: false },
} satisfies ToolExample<Input, Output>;
export const entrepreneurshipInterviewDuplicateParticipantFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "entrepreneurship-studies/entrepreneurship-interview-duplicate-participant-flag",
      title: "Entrepreneurship Interview Duplicate Participant Flag Tool",
      description:
        "Flag distinct supplied interviews sharing an exact participant identifier without deducing personal identity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstInterviewId: { type: "string", maxLength: 8192, minLength: 1 },
          secondInterviewId: { type: "string", maxLength: 8192, minLength: 1 },
          firstParticipantId: { type: "string", maxLength: 8192, minLength: 1 },
          secondParticipantId: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: [
          "firstInterviewId",
          "secondInterviewId",
          "firstParticipantId",
          "secondParticipantId",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          duplicateParticipant: { type: "boolean" },
          sameInterview: { type: "boolean" },
        },
        required: ["duplicateParticipant", "sameInterview"],
      },
      ports: {
        inputs: [
          {
            id: "firstInterviewId",
            label: "First Interview Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "secondInterviewId",
            label: "Second Interview Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "firstParticipantId",
            label: "First Participant Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "secondParticipantId",
            label: "Second Participant Id",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "duplicateParticipant",
            label: "Duplicate Participant",
            valueType: { type: "boolean" },
          },
          {
            id: "sameInterview",
            label: "Same Interview",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run =
  entrepreneurshipInterviewDuplicateParticipantFlagTool.execute;
export default entrepreneurshipInterviewDuplicateParticipantFlagTool;
