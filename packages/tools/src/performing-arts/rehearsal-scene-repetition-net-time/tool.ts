import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sceneMinutes: number;
  readonly repetitions: number;
  readonly notesMinutes: number;
  readonly breakMinutes: number;
};
export type Output = {
  readonly playingMinutes: number;
  readonly totalMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sceneMinutes: { type: "number", minimum: 0 },
    repetitions: { type: "integer", minimum: 1 },
    notesMinutes: { type: "number", minimum: 0 },
    breakMinutes: { type: "number", minimum: 0 },
  },
  required: ["sceneMinutes", "repetitions", "notesMinutes", "breakMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    playingMinutes: { type: "number" },
    totalMinutes: { type: "number" },
  },
  required: ["playingMinutes", "totalMinutes"],
} as const;
/** Notes occur between repetitions; a separate total break allowance is added once. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sceneMinutes, repetitions, notesMinutes, breakMinutes } = request;
  const compute = (): Output => {
    H.domain(sceneMinutes >= 0 && notesMinutes >= 0 && breakMinutes >= 0);
    H.integer(repetitions, 1);
    return {
      playingMinutes: sceneMinutes * repetitions,
      totalMinutes:
        sceneMinutes * repetitions +
        Math.max(0, repetitions - 1) * notesMinutes +
        breakMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sceneMinutes: 5, repetitions: 3, notesMinutes: 2, breakMinutes: 10 },
  output: { playingMinutes: 15, totalMinutes: 29 },
} satisfies ToolExample<Input, Output>;
export const rehearsalSceneRepetitionNetTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/rehearsal-scene-repetition-net-time",
    title: "Rehearsal Scene Repetition Net Time Tool",
    description:
      "Notes occur between repetitions; a separate total break allowance is added once.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sceneMinutes: { type: "number", minimum: 0 },
        repetitions: { type: "integer", minimum: 1 },
        notesMinutes: { type: "number", minimum: 0 },
        breakMinutes: { type: "number", minimum: 0 },
      },
      required: ["sceneMinutes", "repetitions", "notesMinutes", "breakMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        playingMinutes: { type: "number" },
        totalMinutes: { type: "number" },
      },
      required: ["playingMinutes", "totalMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "sceneMinutes",
          label: "Scene Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "repetitions",
          label: "Repetitions",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "notesMinutes",
          label: "Notes Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "breakMinutes",
          label: "Break Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "playingMinutes",
          label: "Playing Minutes",
          valueType: { type: "number" },
        },
        {
          id: "totalMinutes",
          label: "Total Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rehearsalSceneRepetitionNetTimeTool.execute;
export default rehearsalSceneRepetitionNetTimeTool;
