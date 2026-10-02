import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly durations: readonly number[];
  readonly interviewerPresent: readonly boolean[];
  readonly participantPresent: readonly boolean[];
  readonly consentActive: readonly boolean[];
};
export type Output = {
  readonly jointDuration: number;
  readonly consentedJointDuration: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    durations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    interviewerPresent: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    participantPresent: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    consentActive: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: [
    "durations",
    "interviewerPresent",
    "participantPresent",
    "consentActive",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    jointDuration: { type: "number" },
    consentedJointDuration: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["jointDuration", "consentedJointDuration", "share", "defined"],
} as const;
/** Calculate interview overlap support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { durations, interviewerPresent, participantPresent, consentActive } =
    request;
  const compute = (): Output => {
    H.sameLength(durations, interviewerPresent);
    H.sameLength(durations, participantPresent);
    H.sameLength(durations, consentActive);
    H.domain(durations.every((x) => x >= 0));
    return (() => {
      const jointDuration = durations.reduce(
          (s, x, i) =>
            s + (interviewerPresent[i] && participantPresent[i] ? x : 0),
          0,
        ),
        consentedJointDuration = durations.reduce(
          (s, x, i) =>
            s +
            (interviewerPresent[i] && participantPresent[i] && consentActive[i]
              ? x
              : 0),
          0,
        );
      return {
        jointDuration,
        consentedJointDuration,
        share: jointDuration > 0 ? consentedJointDuration / jointDuration : 0,
        defined: jointDuration > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    durations: [2, 3, 5],
    interviewerPresent: [true, true, false],
    participantPresent: [true, true, true],
    consentActive: [true, false, true],
  },
  output: {
    jointDuration: 5,
    consentedJointDuration: 2,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const interviewOverlapSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "psychiatry/interview-overlap-support-share",
    title: "Interview Overlap Support Share Tool",
    description:
      "Calculate interview overlap support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        interviewerPresent: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        participantPresent: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        consentActive: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "durations",
        "interviewerPresent",
        "participantPresent",
        "consentActive",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        jointDuration: { type: "number" },
        consentedJointDuration: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["jointDuration", "consentedJointDuration", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "durations",
          label: "Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "interviewerPresent",
          label: "Interviewer Present",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "participantPresent",
          label: "Participant Present",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "consentActive",
          label: "Consent Active",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "jointDuration",
          label: "Joint Duration",
          valueType: { type: "number" },
        },
        {
          id: "consentedJointDuration",
          label: "Consented Joint Duration",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = interviewOverlapSupportShareTool.execute;
export default interviewOverlapSupportShareTool;
