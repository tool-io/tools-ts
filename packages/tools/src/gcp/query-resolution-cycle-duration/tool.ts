import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly opened: number;
  readonly firstClosed: number;
  readonly reopened: number;
  readonly finalClosed: number;
  readonly countClosedGap: boolean;
};
export type Output = {
  readonly activeDuration: number;
  readonly countedDuration: number;
  readonly closedGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opened: { type: "number" },
    firstClosed: { type: "number" },
    reopened: { type: "number" },
    finalClosed: { type: "number" },
    countClosedGap: { type: "boolean" },
  },
  required: [
    "opened",
    "firstClosed",
    "reopened",
    "finalClosed",
    "countClosedGap",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeDuration: { type: "number" },
    countedDuration: { type: "number" },
    closedGap: { type: "number" },
  },
  required: ["activeDuration", "countedDuration", "closedGap"],
} as const;
/** Reconcile one supplied reopened administrative query cycle without protocol-compliance inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { opened, firstClosed, reopened, finalClosed, countClosedGap } =
    request;
  const compute = (): Output => {
    H.domain(
      opened <= firstClosed &&
        firstClosed <= reopened &&
        reopened <= finalClosed,
    );
    return {
      activeDuration: firstClosed - opened + finalClosed - reopened,
      countedDuration:
        firstClosed -
        opened +
        finalClosed -
        reopened +
        (countClosedGap ? reopened - firstClosed : 0),
      closedGap: reopened - firstClosed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    opened: 0,
    firstClosed: 10,
    reopened: 20,
    finalClosed: 30,
    countClosedGap: false,
  },
  output: { activeDuration: 20, countedDuration: 20, closedGap: 10 },
} satisfies ToolExample<Input, Output>;
export const queryResolutionCycleDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gcp/query-resolution-cycle-duration",
    title: "Query Resolution Cycle Duration Tool",
    description:
      "Reconcile one supplied reopened administrative query cycle without protocol-compliance inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        opened: { type: "number" },
        firstClosed: { type: "number" },
        reopened: { type: "number" },
        finalClosed: { type: "number" },
        countClosedGap: { type: "boolean" },
      },
      required: [
        "opened",
        "firstClosed",
        "reopened",
        "finalClosed",
        "countClosedGap",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activeDuration: { type: "number" },
        countedDuration: { type: "number" },
        closedGap: { type: "number" },
      },
      required: ["activeDuration", "countedDuration", "closedGap"],
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
          id: "firstClosed",
          label: "First Closed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reopened",
          label: "Reopened",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "finalClosed",
          label: "Final Closed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "countClosedGap",
          label: "Count Closed Gap",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "activeDuration",
          label: "Active Duration",
          valueType: { type: "number" },
        },
        {
          id: "countedDuration",
          label: "Counted Duration",
          valueType: { type: "number" },
        },
        { id: "closedGap", label: "Closed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = queryResolutionCycleDurationTool.execute;
export default queryResolutionCycleDurationTool;
