import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly logbookId: string;
  readonly suppliedWatchText: string;
  readonly timeConvention: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logbookId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedWatchText: { type: "string", maxLength: 8192, minLength: 1 },
    timeConvention: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["logbookId", "suppliedWatchText", "timeConvention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit historical watch-time transcription and convention without converting uncertain time systems. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { logbookId, suppliedWatchText, timeConvention } = request;
  const compute = (): Output => {
    H.domain(logbookId.length > 0, "logbookId");
    H.domain(suppliedWatchText.length > 0, "suppliedWatchText");
    H.domain(timeConvention.length > 0, "timeConvention");
    return {
      token: JSON.stringify([logbookId, suppliedWatchText, timeConvention]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    logbookId: "LOG17",
    suppliedWatchText: "First watch",
    timeConvention: "Source A",
  },
  output: { token: '["LOG17","First watch","Source A"]' },
} satisfies ToolExample<Input, Output>;
export const historicalLogbookWatchTimeTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["military-science", "military science", "social sciences"],
      keywords: ["military science", "social sciences"],
    },
    id: "military-science/historical-logbook-watch-time-token",
    title: "Historical Logbook Watch Time Token",
    description:
      "Preserve an explicit historical watch-time transcription and convention without converting uncertain time systems.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        logbookId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedWatchText: { type: "string", maxLength: 8192, minLength: 1 },
        timeConvention: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["logbookId", "suppliedWatchText", "timeConvention"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "logbookId",
          label: "Logbook Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedWatchText",
          label: "Supplied Watch Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "timeConvention",
          label: "Time Convention",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = historicalLogbookWatchTimeTokenTool.execute;
export default historicalLogbookWatchTimeTokenTool;
