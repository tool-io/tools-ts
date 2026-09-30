import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduled: number;
  readonly heldSeconds: number;
  readonly actual: number;
};
export type Output = { readonly revisedCue: number; readonly lateness: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduled: { type: "number" },
    heldSeconds: { type: "number", minimum: 0 },
    actual: { type: "number" },
  },
  required: ["scheduled", "heldSeconds", "actual"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { revisedCue: { type: "number" }, lateness: { type: "number" } },
  required: ["revisedCue", "lateness"],
} as const;
/** Calculate broadcast cuehold clock gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scheduled, heldSeconds, actual } = request;
  const compute = (): Output => {
    H.domain(heldSeconds >= 0);
    return {
      revisedCue: scheduled + heldSeconds,
      lateness: actual - scheduled - heldSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scheduled: 100, heldSeconds: 5, actual: 108 },
  output: { revisedCue: 105, lateness: 3 },
} satisfies ToolExample<Input, Output>;
export const broadcastCueholdClockGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "media-studies/broadcast-cuehold-clock-gap",
    title: "Broadcast Cuehold Clock Gap Tool",
    description:
      "Calculate broadcast cuehold clock gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scheduled: { type: "number" },
        heldSeconds: { type: "number", minimum: 0 },
        actual: { type: "number" },
      },
      required: ["scheduled", "heldSeconds", "actual"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        revisedCue: { type: "number" },
        lateness: { type: "number" },
      },
      required: ["revisedCue", "lateness"],
    },
    ports: {
      inputs: [
        {
          id: "scheduled",
          label: "Scheduled",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "heldSeconds",
          label: "Held Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "actual",
          label: "Actual",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "revisedCue",
          label: "Revised Cue",
          valueType: { type: "number" },
        },
        { id: "lateness", label: "Lateness", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = broadcastCueholdClockGapTool.execute;
export default broadcastCueholdClockGapTool;
