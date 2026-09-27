import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly opened: number;
  readonly closed: number;
  readonly paused: number;
  readonly now: number;
  readonly isClosed: boolean;
};
export type Output = {
  readonly elapsed: number;
  readonly activeDuration: number;
  readonly closed: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opened: { type: "number" },
    closed: { type: "number" },
    paused: { type: "number", minimum: 0 },
    now: { type: "number" },
    isClosed: { type: "boolean" },
  },
  required: ["opened", "closed", "paused", "now", "isClosed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number" },
    activeDuration: { type: "number" },
    closed: { type: "boolean" },
  },
  required: ["elapsed", "activeDuration", "closed"],
} as const;
/** Calculate gcp query open close clock pause from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { opened, closed, paused, now, isClosed } = request;
  const compute = (): Output => {
    H.domain(
      (isClosed ? closed : now) >= opened &&
        paused >= 0 &&
        paused <= (isClosed ? closed : now) - opened,
    );
    return {
      elapsed: (isClosed ? closed : now) - opened,
      activeDuration: (isClosed ? closed : now) - opened - paused,
      closed: isClosed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { opened: 100, closed: 120, paused: 5, now: 130, isClosed: true },
  output: { elapsed: 20, activeDuration: 15, closed: true },
} satisfies ToolExample<Input, Output>;
export const gcpQueryOpenCloseClockPauseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gcp/gcp-query-open-close-clock-pause",
    title: "GCP Query Open Close Clock Pause Tool",
    description:
      "Calculate gcp query open close clock pause from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        opened: { type: "number" },
        closed: { type: "number" },
        paused: { type: "number", minimum: 0 },
        now: { type: "number" },
        isClosed: { type: "boolean" },
      },
      required: ["opened", "closed", "paused", "now", "isClosed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number" },
        activeDuration: { type: "number" },
        closed: { type: "boolean" },
      },
      required: ["elapsed", "activeDuration", "closed"],
    },
    ports: {
      inputs: [
        {
          id: "opened",
          label: "Opened",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "closed",
          label: "Closed",
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
          id: "now",
          label: "Now",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "isClosed",
          label: "Is Closed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        {
          id: "activeDuration",
          label: "Active Duration",
          valueType: { type: "number" },
        },
        { id: "closed", label: "Closed", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = gcpQueryOpenCloseClockPauseTool.execute;
export default gcpQueryOpenCloseClockPauseTool;
