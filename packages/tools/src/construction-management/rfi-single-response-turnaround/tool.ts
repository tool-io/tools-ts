import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly submittedTimestampSeconds: number;
  readonly responseTimestampSeconds: number;
  readonly excludedPauseSeconds: number;
};
export type Output = {
  readonly grossSeconds: number;
  readonly activeSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    submittedTimestampSeconds: { type: "number" },
    responseTimestampSeconds: { type: "number" },
    excludedPauseSeconds: { type: "number", minimum: 0 },
  },
  required: [
    "submittedTimestampSeconds",
    "responseTimestampSeconds",
    "excludedPauseSeconds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossSeconds: { type: "number" },
    activeSeconds: { type: "number" },
  },
  required: ["grossSeconds", "activeSeconds"],
} as const;
/** Measure one recorded request-for-information response interval after an explicit nonoverlapping excluded pause. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    submittedTimestampSeconds,
    responseTimestampSeconds,
    excludedPauseSeconds,
  } = request;
  const compute = (): Output => {
    H.domain(
      responseTimestampSeconds >= submittedTimestampSeconds &&
        excludedPauseSeconds >= 0 &&
        excludedPauseSeconds <=
          responseTimestampSeconds - submittedTimestampSeconds,
      "responseTimestampSeconds",
    );
    return {
      grossSeconds: responseTimestampSeconds - submittedTimestampSeconds,
      activeSeconds:
        responseTimestampSeconds -
        submittedTimestampSeconds -
        excludedPauseSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    submittedTimestampSeconds: 1000,
    responseTimestampSeconds: 4600,
    excludedPauseSeconds: 600,
  },
  output: { grossSeconds: 3600, activeSeconds: 3000 },
} satisfies ToolExample<Input, Output>;
export const rfiSingleResponseTurnaroundTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "construction-management",
        "construction management",
        "engineering",
      ],
      keywords: ["construction management", "engineering"],
    },
    id: "construction-management/rfi-single-response-turnaround",
    title: "Rfi Single Response Turnaround",
    description:
      "Measure one recorded request-for-information response interval after an explicit nonoverlapping excluded pause.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        submittedTimestampSeconds: { type: "number" },
        responseTimestampSeconds: { type: "number" },
        excludedPauseSeconds: { type: "number", minimum: 0 },
      },
      required: [
        "submittedTimestampSeconds",
        "responseTimestampSeconds",
        "excludedPauseSeconds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossSeconds: { type: "number" },
        activeSeconds: { type: "number" },
      },
      required: ["grossSeconds", "activeSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "submittedTimestampSeconds",
          label: "Submitted Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "responseTimestampSeconds",
          label: "Response Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedPauseSeconds",
          label: "Excluded Pause Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossSeconds",
          label: "Gross Seconds",
          valueType: { type: "number" },
        },
        {
          id: "activeSeconds",
          label: "Active Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rfiSingleResponseTurnaroundTool.execute;
export default rfiSingleResponseTurnaroundTool;
