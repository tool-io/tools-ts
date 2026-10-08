import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly sceneId: string; readonly timeOfDay: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sceneId: { type: "string", maxLength: 8192, minLength: 1 },
    timeOfDay: {
      type: "string",
      maxLength: 8192,
      enum: ["DAY", "NIGHT", "DAWN", "DUSK"],
    },
  },
  required: ["sceneId", "timeOfDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Attach an explicit screenplay time-of-day token to a scene identifier without inferring local time. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sceneId, timeOfDay } = request;
  const compute = (): Output => {
    H.domain(sceneId.length > 0, "sceneId");
    H.domain(["DAY", "NIGHT", "DAWN", "DUSK"].includes(timeOfDay), "timeOfDay");
    return { label: sceneId + " [" + timeOfDay + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sceneId: "S17", timeOfDay: "NIGHT" },
  output: { label: "S17 [NIGHT]" },
} satisfies ToolExample<Input, Output>;
export const screenplaySceneHeaderDayNightTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["creative-writing", "creative writing", "humanities"],
      keywords: ["creative writing", "humanities"],
    },
    id: "creative-writing/screenplay-scene-header-day-night-token",
    title: "Screenplay Scene Header Day Night Token",
    description:
      "Attach an explicit screenplay time-of-day token to a scene identifier without inferring local time.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sceneId: { type: "string", maxLength: 8192, minLength: 1 },
        timeOfDay: {
          type: "string",
          maxLength: 8192,
          enum: ["DAY", "NIGHT", "DAWN", "DUSK"],
        },
      },
      required: ["sceneId", "timeOfDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "sceneId",
          label: "Scene Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "timeOfDay",
          label: "Time Of Day",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = screenplaySceneHeaderDayNightTokenTool.execute;
export default screenplaySceneHeaderDayNightTokenTool;
