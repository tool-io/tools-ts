import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstInterviewId: string;
  readonly firstPseudonym: string;
  readonly secondInterviewId: string;
  readonly secondPseudonym: string;
};
export type Output = { readonly collision: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstInterviewId: { type: "string", maxLength: 8192, minLength: 1 },
    firstPseudonym: { type: "string", maxLength: 8192, minLength: 1 },
    secondInterviewId: { type: "string", maxLength: 8192, minLength: 1 },
    secondPseudonym: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: [
    "firstInterviewId",
    "firstPseudonym",
    "secondInterviewId",
    "secondPseudonym",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { collision: { type: "boolean" } },
  required: ["collision"],
} as const;
/** Flag two distinct supplied interview identifiers sharing the exact same nonempty pseudonym without identifying speakers. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstInterviewId,
    firstPseudonym,
    secondInterviewId,
    secondPseudonym,
  } = request;
  const compute = (): Output => {
    H.domain(firstInterviewId.length > 0, "firstInterviewId");
    H.domain(secondInterviewId.length > 0, "secondInterviewId");
    H.domain(firstPseudonym.length > 0, "firstPseudonym");
    H.domain(secondPseudonym.length > 0, "secondPseudonym");
    return {
      collision:
        firstInterviewId !== secondInterviewId &&
        firstPseudonym === secondPseudonym,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstInterviewId: "I17",
    firstPseudonym: "Speaker A",
    secondInterviewId: "I18",
    secondPseudonym: "Speaker A",
  },
  output: { collision: true },
} satisfies ToolExample<Input, Output>;
export const interviewPseudonymCollisionPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "cultural-anthropology",
        "cultural anthropology",
        "social sciences",
      ],
      keywords: ["cultural anthropology", "social sciences"],
    },
    id: "cultural-anthropology/interview-pseudonym-collision-pair",
    title: "Interview Pseudonym Collision Pair",
    description:
      "Flag two distinct supplied interview identifiers sharing the exact same nonempty pseudonym without identifying speakers.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstInterviewId: { type: "string", maxLength: 8192, minLength: 1 },
        firstPseudonym: { type: "string", maxLength: 8192, minLength: 1 },
        secondInterviewId: { type: "string", maxLength: 8192, minLength: 1 },
        secondPseudonym: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: [
        "firstInterviewId",
        "firstPseudonym",
        "secondInterviewId",
        "secondPseudonym",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { collision: { type: "boolean" } },
      required: ["collision"],
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
          id: "firstPseudonym",
          label: "First Pseudonym",
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
          id: "secondPseudonym",
          label: "Second Pseudonym",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "collision", label: "Collision", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = interviewPseudonymCollisionPairTool.execute;
export default interviewPseudonymCollisionPairTool;
