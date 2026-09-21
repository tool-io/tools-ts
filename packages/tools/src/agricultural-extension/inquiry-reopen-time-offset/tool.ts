import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstOpened: number;
  readonly closed: number;
  readonly reopened: number;
  readonly answered: number;
  readonly includeClosedGap: boolean;
};
export type Output = {
  readonly activeDuration: number;
  readonly closedGap: number;
  readonly countedDuration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstOpened: { type: "number" },
    closed: { type: "number" },
    reopened: { type: "number" },
    answered: { type: "number" },
    includeClosedGap: { type: "boolean" },
  },
  required: [
    "firstOpened",
    "closed",
    "reopened",
    "answered",
    "includeClosedGap",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeDuration: { type: "number" },
    closedGap: { type: "number" },
    countedDuration: { type: "number" },
  },
  required: ["activeDuration", "closedGap", "countedDuration"],
} as const;
/** Calculate inquiry reopen time offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstOpened, closed, reopened, answered, includeClosedGap } = request;
  const compute = (): Output => {
    H.domain(
      firstOpened <= closed && closed <= reopened && reopened <= answered,
    );
    return {
      activeDuration: closed - firstOpened + answered - reopened,
      closedGap: reopened - closed,
      countedDuration:
        closed -
        firstOpened +
        answered -
        reopened +
        (includeClosedGap ? reopened - closed : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstOpened: 0,
    closed: 10,
    reopened: 20,
    answered: 30,
    includeClosedGap: false,
  },
  output: { activeDuration: 20, closedGap: 10, countedDuration: 20 },
} satisfies ToolExample<Input, Output>;
export const inquiryReopenTimeOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-extension/inquiry-reopen-time-offset",
    title: "Inquiry Reopen Time Offset Tool",
    description:
      "Calculate inquiry reopen time offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstOpened: { type: "number" },
        closed: { type: "number" },
        reopened: { type: "number" },
        answered: { type: "number" },
        includeClosedGap: { type: "boolean" },
      },
      required: [
        "firstOpened",
        "closed",
        "reopened",
        "answered",
        "includeClosedGap",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activeDuration: { type: "number" },
        closedGap: { type: "number" },
        countedDuration: { type: "number" },
      },
      required: ["activeDuration", "closedGap", "countedDuration"],
    },
    ports: {
      inputs: [
        {
          id: "firstOpened",
          label: "First Opened",
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
          id: "reopened",
          label: "Reopened",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "answered",
          label: "Answered",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeClosedGap",
          label: "Include Closed Gap",
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
        { id: "closedGap", label: "Closed Gap", valueType: { type: "number" } },
        {
          id: "countedDuration",
          label: "Counted Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = inquiryReopenTimeOffsetTool.execute;
export default inquiryReopenTimeOffsetTool;
