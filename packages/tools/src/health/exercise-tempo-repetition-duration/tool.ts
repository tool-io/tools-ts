import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eccentric: number;
  readonly bottomPause: number;
  readonly concentric: number;
  readonly topPause: number;
  readonly repetitions: number;
};
export type Output = {
  readonly secondsPerRepetition: number;
  readonly totalSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eccentric: { type: "number" },
    bottomPause: { type: "number" },
    concentric: { type: "number" },
    topPause: { type: "number" },
    repetitions: { type: "integer", minimum: 0 },
  },
  required: [
    "eccentric",
    "bottomPause",
    "concentric",
    "topPause",
    "repetitions",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    secondsPerRepetition: { type: "number" },
    totalSeconds: { type: "number" },
  },
  required: ["secondsPerRepetition", "totalSeconds"],
} as const;
/** Calculate exercise tempo repetition duration from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eccentric, bottomPause, concentric, topPause, repetitions } = request;
  const compute = (): Output => {
    H.domain(
      [eccentric, bottomPause, concentric, topPause].every((x) => x >= 0),
    );
    H.integer(repetitions, 0);
    const secondsPerRepetition =
      eccentric + bottomPause + concentric + topPause;
    return {
      secondsPerRepetition,
      totalSeconds: secondsPerRepetition * repetitions,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eccentric: 3,
    bottomPause: 1,
    concentric: 2,
    topPause: 0,
    repetitions: 10,
  },
  output: { secondsPerRepetition: 6, totalSeconds: 60 },
} satisfies ToolExample<Input, Output>;
export const exerciseTempoRepetitionDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health/exercise-tempo-repetition-duration",
    title: "Exercise Tempo Repetition Duration Tool",
    description:
      "Calculate exercise tempo repetition duration from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eccentric: { type: "number" },
        bottomPause: { type: "number" },
        concentric: { type: "number" },
        topPause: { type: "number" },
        repetitions: { type: "integer", minimum: 0 },
      },
      required: [
        "eccentric",
        "bottomPause",
        "concentric",
        "topPause",
        "repetitions",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        secondsPerRepetition: { type: "number" },
        totalSeconds: { type: "number" },
      },
      required: ["secondsPerRepetition", "totalSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "eccentric",
          label: "Eccentric",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bottomPause",
          label: "Bottom Pause",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "concentric",
          label: "Concentric",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "topPause",
          label: "Top Pause",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "repetitions",
          label: "Repetitions",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "secondsPerRepetition",
          label: "Seconds Per Repetition",
          valueType: { type: "number" },
        },
        {
          id: "totalSeconds",
          label: "Total Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = exerciseTempoRepetitionDurationTool.execute;
export default exerciseTempoRepetitionDurationTool;
