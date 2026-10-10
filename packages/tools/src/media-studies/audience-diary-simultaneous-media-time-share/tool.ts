import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstMediumMinutes: number;
  readonly secondMediumMinutes: number;
  readonly simultaneousMinutes: number;
  readonly observationMinutes: number;
};
export type Output = {
  readonly unionMinutes: number;
  readonly unionShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstMediumMinutes: { type: "number", minimum: 0 },
    secondMediumMinutes: { type: "number", minimum: 0 },
    simultaneousMinutes: { type: "number", minimum: 0 },
    observationMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "firstMediumMinutes",
    "secondMediumMinutes",
    "simultaneousMinutes",
    "observationMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unionMinutes: { type: "number" },
    unionShare: { type: "number" },
  },
  required: ["unionMinutes", "unionShare"],
} as const;
/** Combine explicitly overlapping audience diary durations without double counting simultaneous media time. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstMediumMinutes,
    secondMediumMinutes,
    simultaneousMinutes,
    observationMinutes,
  } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(observationMinutes) && observationMinutes > 0,
      "observationMinutes",
    ),
      observationMinutes);
    H.domain(
      firstMediumMinutes >= 0 &&
        secondMediumMinutes >= 0 &&
        simultaneousMinutes >= 0 &&
        simultaneousMinutes <=
          Math.min(firstMediumMinutes, secondMediumMinutes),
      "firstMediumMinutes",
    );
    H.domain(
      firstMediumMinutes + secondMediumMinutes - simultaneousMinutes <=
        observationMinutes,
      "firstMediumMinutes",
    );
    return {
      unionMinutes:
        firstMediumMinutes + secondMediumMinutes - simultaneousMinutes,
      unionShare:
        (firstMediumMinutes + secondMediumMinutes - simultaneousMinutes) /
        observationMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstMediumMinutes: 60,
    secondMediumMinutes: 30,
    simultaneousMinutes: 20,
    observationMinutes: 120,
  },
  output: { unionMinutes: 70, unionShare: 0.5833333333333334 },
} satisfies ToolExample<Input, Output>;
export const audienceDiarySimultaneousMediaTimeShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["media-studies", "media studies", "social sciences"],
        keywords: ["media studies", "social sciences"],
      },
      id: "media-studies/audience-diary-simultaneous-media-time-share",
      title: "Audience Diary Simultaneous Media Time Share",
      description:
        "Combine explicitly overlapping audience diary durations without double counting simultaneous media time.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstMediumMinutes: { type: "number", minimum: 0 },
          secondMediumMinutes: { type: "number", minimum: 0 },
          simultaneousMinutes: { type: "number", minimum: 0 },
          observationMinutes: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "firstMediumMinutes",
          "secondMediumMinutes",
          "simultaneousMinutes",
          "observationMinutes",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unionMinutes: { type: "number" },
          unionShare: { type: "number" },
        },
        required: ["unionMinutes", "unionShare"],
      },
      ports: {
        inputs: [
          {
            id: "firstMediumMinutes",
            label: "First Medium Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondMediumMinutes",
            label: "Second Medium Minutes",
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
            id: "observationMinutes",
            label: "Observation Minutes",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "unionMinutes",
            label: "Union Minutes",
            valueType: { type: "number" },
          },
          {
            id: "unionShare",
            label: "Union Share",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = audienceDiarySimultaneousMediaTimeShareTool.execute;
export default audienceDiarySimultaneousMediaTimeShareTool;
