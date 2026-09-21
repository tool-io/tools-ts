import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mentorMinutes: number;
  readonly learnerMinutes: number;
  readonly simultaneousMinutes: number;
  readonly allocatedMentorShare: number;
};
export type Output = {
  readonly contactMinutes: number;
  readonly mentorCredit: number;
  readonly learnerCredit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mentorMinutes: { type: "number", minimum: 0 },
    learnerMinutes: { type: "number", minimum: 0 },
    simultaneousMinutes: { type: "number", minimum: 0 },
    allocatedMentorShare: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "mentorMinutes",
    "learnerMinutes",
    "simultaneousMinutes",
    "allocatedMentorShare",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactMinutes: { type: "number" },
    mentorCredit: { type: "number" },
    learnerCredit: { type: "number" },
  },
  required: ["contactMinutes", "mentorCredit", "learnerCredit"],
} as const;
/** Calculate mentoring turn credit balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    mentorMinutes,
    learnerMinutes,
    simultaneousMinutes,
    allocatedMentorShare,
  } = request;
  const compute = (): Output => {
    H.domain(
      mentorMinutes >= 0 &&
        learnerMinutes >= 0 &&
        simultaneousMinutes >= 0 &&
        simultaneousMinutes <= Math.min(mentorMinutes, learnerMinutes),
    );
    H.probability(allocatedMentorShare);
    return {
      contactMinutes: mentorMinutes + learnerMinutes - simultaneousMinutes,
      mentorCredit:
        mentorMinutes -
        simultaneousMinutes +
        simultaneousMinutes * allocatedMentorShare,
      learnerCredit:
        learnerMinutes - simultaneousMinutes * allocatedMentorShare,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    mentorMinutes: 30,
    learnerMinutes: 20,
    simultaneousMinutes: 10,
    allocatedMentorShare: 0.5,
  },
  output: { contactMinutes: 40, mentorCredit: 25, learnerCredit: 15 },
} satisfies ToolExample<Input, Output>;
export const mentoringTurnCreditBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "andragogy/mentoring-turn-credit-balance",
    title: "Mentoring Turn Credit Balance Tool",
    description:
      "Calculate mentoring turn credit balance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mentorMinutes: { type: "number", minimum: 0 },
        learnerMinutes: { type: "number", minimum: 0 },
        simultaneousMinutes: { type: "number", minimum: 0 },
        allocatedMentorShare: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "mentorMinutes",
        "learnerMinutes",
        "simultaneousMinutes",
        "allocatedMentorShare",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contactMinutes: { type: "number" },
        mentorCredit: { type: "number" },
        learnerCredit: { type: "number" },
      },
      required: ["contactMinutes", "mentorCredit", "learnerCredit"],
    },
    ports: {
      inputs: [
        {
          id: "mentorMinutes",
          label: "Mentor Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "learnerMinutes",
          label: "Learner Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "simultaneousMinutes",
          label: "Simultaneous Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allocatedMentorShare",
          label: "Allocated Mentor Share",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "contactMinutes",
          label: "Contact Minutes",
          valueType: { type: "number" },
        },
        {
          id: "mentorCredit",
          label: "Mentor Credit",
          valueType: { type: "number" },
        },
        {
          id: "learnerCredit",
          label: "Learner Credit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mentoringTurnCreditBalanceTool.execute;
export default mentoringTurnCreditBalanceTool;
