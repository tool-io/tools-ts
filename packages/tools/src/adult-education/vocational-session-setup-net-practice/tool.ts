import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sessionMinutes: number;
  readonly setupMinutes: number;
  readonly demonstrationMinutes: number;
  readonly cleanupMinutes: number;
  readonly learners: number;
};
export type Output = {
  readonly practiceMinutes: number;
  readonly practicePerLearner: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sessionMinutes: { type: "number" },
    setupMinutes: { type: "number", minimum: 0 },
    demonstrationMinutes: { type: "number", minimum: 0 },
    cleanupMinutes: { type: "number", minimum: 0 },
    learners: { type: "integer", minimum: 1 },
  },
  required: [
    "sessionMinutes",
    "setupMinutes",
    "demonstrationMinutes",
    "cleanupMinutes",
    "learners",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    practiceMinutes: { type: "number" },
    practicePerLearner: { type: "number" },
  },
  required: ["practiceMinutes", "practicePerLearner"],
} as const;
/** Equal serial hands-on allocation of the remaining practice time; simultaneous practice requires a different capacity model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    sessionMinutes,
    setupMinutes,
    demonstrationMinutes,
    cleanupMinutes,
    learners,
  } = request;
  const compute = (): Output => {
    H.domain(
      setupMinutes >= 0 &&
        demonstrationMinutes >= 0 &&
        cleanupMinutes >= 0 &&
        sessionMinutes >= setupMinutes + demonstrationMinutes + cleanupMinutes,
    );
    H.integer(learners, 1);
    return {
      practiceMinutes:
        sessionMinutes - setupMinutes - demonstrationMinutes - cleanupMinutes,
      practicePerLearner:
        (sessionMinutes -
          setupMinutes -
          demonstrationMinutes -
          cleanupMinutes) /
        learners,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sessionMinutes: 180,
    setupMinutes: 20,
    demonstrationMinutes: 30,
    cleanupMinutes: 10,
    learners: 6,
  },
  output: { practiceMinutes: 120, practicePerLearner: 20 },
} satisfies ToolExample<Input, Output>;
export const vocationalSessionSetupNetPracticeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "adult-education/vocational-session-setup-net-practice",
    title: "Vocational Session Setup Net Practice Tool",
    description:
      "Equal serial hands-on allocation of the remaining practice time; simultaneous practice requires a different capacity model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sessionMinutes: { type: "number" },
        setupMinutes: { type: "number", minimum: 0 },
        demonstrationMinutes: { type: "number", minimum: 0 },
        cleanupMinutes: { type: "number", minimum: 0 },
        learners: { type: "integer", minimum: 1 },
      },
      required: [
        "sessionMinutes",
        "setupMinutes",
        "demonstrationMinutes",
        "cleanupMinutes",
        "learners",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        practiceMinutes: { type: "number" },
        practicePerLearner: { type: "number" },
      },
      required: ["practiceMinutes", "practicePerLearner"],
    },
    ports: {
      inputs: [
        {
          id: "sessionMinutes",
          label: "Session Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "setupMinutes",
          label: "Setup Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "demonstrationMinutes",
          label: "Demonstration Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "cleanupMinutes",
          label: "Cleanup Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "learners",
          label: "Learners",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "practiceMinutes",
          label: "Practice Minutes",
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "practicePerLearner",
          label: "Practice Per Learner",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = vocationalSessionSetupNetPracticeTool.execute;
export default vocationalSessionSetupNetPracticeTool;
