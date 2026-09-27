import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsed: number;
  readonly paused: number;
  readonly priorCredit: number;
  readonly sharedCredit: number;
  readonly excludePause: boolean;
};
export type Output = {
  readonly additionalCredit: number;
  readonly counted: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number", minimum: 0 },
    paused: { type: "number", minimum: 0 },
    priorCredit: { type: "number", minimum: 0 },
    sharedCredit: { type: "number", minimum: 0 },
    excludePause: { type: "boolean" },
  },
  required: [
    "elapsed",
    "paused",
    "priorCredit",
    "sharedCredit",
    "excludePause",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    additionalCredit: { type: "number" },
    counted: { type: "number" },
  },
  required: ["additionalCredit", "counted"],
} as const;
/** Administrative query-clock arithmetic with overlap-aware pause credit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsed, paused, priorCredit, sharedCredit, excludePause } = request;
  const compute = (): Output => {
    H.domain(
      elapsed >= 0 &&
        paused >= 0 &&
        priorCredit >= 0 &&
        sharedCredit >= 0 &&
        sharedCredit <= Math.min(paused, priorCredit) &&
        paused + priorCredit - sharedCredit <= elapsed,
    );
    return {
      additionalCredit: excludePause ? paused - sharedCredit : 0,
      counted:
        elapsed - priorCredit - (excludePause ? paused - sharedCredit : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    elapsed: 100,
    paused: 20,
    priorCredit: 10,
    sharedCredit: 5,
    excludePause: true,
  },
  output: { additionalCredit: 15, counted: 75 },
} satisfies ToolExample<Input, Output>;
export const gcpQueryClockPausedBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gcp/gcp-query-clock-paused-base",
    title: "GCP Query Clock Paused Base Tool",
    description:
      "Administrative query-clock arithmetic with overlap-aware pause credit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number", minimum: 0 },
        paused: { type: "number", minimum: 0 },
        priorCredit: { type: "number", minimum: 0 },
        sharedCredit: { type: "number", minimum: 0 },
        excludePause: { type: "boolean" },
      },
      required: [
        "elapsed",
        "paused",
        "priorCredit",
        "sharedCredit",
        "excludePause",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        additionalCredit: { type: "number" },
        counted: { type: "number" },
      },
      required: ["additionalCredit", "counted"],
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
          id: "priorCredit",
          label: "Prior Credit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedCredit",
          label: "Shared Credit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludePause",
          label: "Exclude Pause",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "additionalCredit",
          label: "Additional Credit",
          valueType: { type: "number" },
        },
        { id: "counted", label: "Counted", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = gcpQueryClockPausedBaseTool.execute;
export default gcpQueryClockPausedBaseTool;
