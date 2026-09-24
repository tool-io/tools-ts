import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sceneStart: number;
  readonly sceneEnd: number;
  readonly narratedDuration: number;
};
export type Output = {
  readonly timelineDuration: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sceneStart: { type: "number" },
    sceneEnd: { type: "number" },
    narratedDuration: { type: "number", minimum: 0 },
  },
  required: ["sceneStart", "sceneEnd", "narratedDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { timelineDuration: { type: "number" }, gap: { type: "number" } },
  required: ["timelineDuration", "gap"],
} as const;
/** Calculate scene timeline duration gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sceneStart, sceneEnd, narratedDuration } = request;
  const compute = (): Output => {
    H.domain(sceneEnd >= sceneStart && narratedDuration >= 0);
    return {
      timelineDuration: sceneEnd - sceneStart,
      gap: narratedDuration - (sceneEnd - sceneStart),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sceneStart: 10, sceneEnd: 20, narratedDuration: 4 },
  output: { timelineDuration: 10, gap: -6 },
} satisfies ToolExample<Input, Output>;
export const sceneTimelineDurationGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "creative-writing/scene-timeline-duration-gap",
    title: "Scene Timeline Duration Gap Tool",
    description:
      "Calculate scene timeline duration gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sceneStart: { type: "number" },
        sceneEnd: { type: "number" },
        narratedDuration: { type: "number", minimum: 0 },
      },
      required: ["sceneStart", "sceneEnd", "narratedDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        timelineDuration: { type: "number" },
        gap: { type: "number" },
      },
      required: ["timelineDuration", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "sceneStart",
          label: "Scene Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sceneEnd",
          label: "Scene End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "narratedDuration",
          label: "Narrated Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "timelineDuration",
          label: "Timeline Duration",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sceneTimelineDurationGapTool.execute;
export default sceneTimelineDurationGapTool;
