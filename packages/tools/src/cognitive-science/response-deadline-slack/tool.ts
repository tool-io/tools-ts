import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responseTime: number;
  readonly deadlineTime: number;
  readonly responseClock: string;
  readonly deadlineClock: string;
  readonly suppliedResponseOffset: number;
  readonly offsetKnown: boolean;
  readonly positiveMeansLate: boolean;
};
export type Output = {
  readonly defined: boolean;
  readonly signedOffset: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseTime: { type: "number" },
    deadlineTime: { type: "number" },
    responseClock: { type: "string", maxLength: 8192 },
    deadlineClock: { type: "string", maxLength: 8192 },
    suppliedResponseOffset: { type: "number" },
    offsetKnown: { type: "boolean" },
    positiveMeansLate: { type: "boolean" },
  },
  required: [
    "responseTime",
    "deadlineTime",
    "responseClock",
    "deadlineClock",
    "suppliedResponseOffset",
    "offsetKnown",
    "positiveMeansLate",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    defined: { type: "boolean" },
    signedOffset: { type: "number" },
  },
  required: ["defined", "signedOffset"],
} as const;
/** Compare one response timestamp and supplied deadline with explicit clock-source and sign conventions; no cognition inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    responseTime,
    deadlineTime,
    responseClock,
    deadlineClock,
    suppliedResponseOffset,
    offsetKnown,
    positiveMeansLate,
  } = request;
  const compute = (): Output => {
    const defined = responseClock === deadlineClock || offsetKnown;
    return {
      defined,
      signedOffset: defined
        ? (responseTime -
            (responseClock === deadlineClock ? 0 : suppliedResponseOffset) -
            deadlineTime) *
          (positiveMeansLate ? 1 : -1)
        : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    responseTime: 120,
    deadlineTime: 100,
    responseClock: "A",
    deadlineClock: "B",
    suppliedResponseOffset: 5,
    offsetKnown: true,
    positiveMeansLate: true,
  },
  output: { defined: true, signedOffset: 15 },
} satisfies ToolExample<Input, Output>;
export const responseDeadlineSlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cognitive-science/response-deadline-slack",
    title: "Response Deadline Slack Tool",
    description:
      "Compare one response timestamp and supplied deadline with explicit clock-source and sign conventions; no cognition inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responseTime: { type: "number" },
        deadlineTime: { type: "number" },
        responseClock: { type: "string", maxLength: 8192 },
        deadlineClock: { type: "string", maxLength: 8192 },
        suppliedResponseOffset: { type: "number" },
        offsetKnown: { type: "boolean" },
        positiveMeansLate: { type: "boolean" },
      },
      required: [
        "responseTime",
        "deadlineTime",
        "responseClock",
        "deadlineClock",
        "suppliedResponseOffset",
        "offsetKnown",
        "positiveMeansLate",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        defined: { type: "boolean" },
        signedOffset: { type: "number" },
      },
      required: ["defined", "signedOffset"],
    },
    ports: {
      inputs: [
        {
          id: "responseTime",
          label: "Response Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deadlineTime",
          label: "Deadline Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "responseClock",
          label: "Response Clock",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "deadlineClock",
          label: "Deadline Clock",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedResponseOffset",
          label: "Supplied Response Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offsetKnown",
          label: "Offset Known",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "positiveMeansLate",
          label: "Positive Means Late",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        {
          id: "signedOffset",
          label: "Signed Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = responseDeadlineSlackTool.execute;
export default responseDeadlineSlackTool;
