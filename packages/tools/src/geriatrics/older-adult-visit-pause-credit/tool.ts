import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsed: number;
  readonly paused: number;
  readonly overlapCredit: number;
  readonly countPause: boolean;
};
export type Output = { readonly contactTime: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number", minimum: 0 },
    paused: { type: "number", minimum: 0 },
    overlapCredit: { type: "number", minimum: 0 },
    countPause: { type: "boolean" },
  },
  required: ["elapsed", "paused", "overlapCredit", "countPause"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contactTime: { type: "number" } },
  required: ["contactTime"],
} as const;
/** Time accounting for an existing visit record under explicit pause-credit assumptions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsed, paused, overlapCredit, countPause } = request;
  const compute = (): Output => {
    H.domain(
      elapsed >= 0 &&
        paused >= 0 &&
        paused <= elapsed &&
        overlapCredit >= 0 &&
        overlapCredit <= paused,
    );
    return { contactTime: elapsed - (countPause ? 0 : paused - overlapCredit) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { elapsed: 60, paused: 15, overlapCredit: 5, countPause: false },
  output: { contactTime: 50 },
} satisfies ToolExample<Input, Output>;
export const olderAdultVisitPauseCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geriatrics/older-adult-visit-pause-credit",
    title: "Older Adult Visit Pause Credit Tool",
    description:
      "Time accounting for an existing visit record under explicit pause-credit assumptions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number", minimum: 0 },
        paused: { type: "number", minimum: 0 },
        overlapCredit: { type: "number", minimum: 0 },
        countPause: { type: "boolean" },
      },
      required: ["elapsed", "paused", "overlapCredit", "countPause"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contactTime: { type: "number" } },
      required: ["contactTime"],
    },
    ports: {
      inputs: [
        {
          id: "elapsed",
          label: "Elapsed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "paused",
          label: "Paused",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlapCredit",
          label: "Overlap Credit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "countPause",
          label: "Count Pause",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "contactTime",
          label: "Contact Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = olderAdultVisitPauseCreditTool.execute;
export default olderAdultVisitPauseCreditTool;
