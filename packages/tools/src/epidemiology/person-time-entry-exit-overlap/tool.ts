import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entryTime: number;
  readonly exitTime: number;
  readonly windowStart: number;
  readonly windowEnd: number;
};
export type Output = { readonly includedPersonTime: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryTime: { type: "number" },
    exitTime: { type: "number" },
    windowStart: { type: "number" },
    windowEnd: { type: "number" },
  },
  required: ["entryTime", "exitTime", "windowStart", "windowEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { includedPersonTime: { type: "number" } },
  required: ["includedPersonTime"],
} as const;
/** Calculate supplied person-risk interval overlap with a half-open observation window without determining disease-free eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entryTime, exitTime, windowStart, windowEnd } = request;
  const compute = (): Output => {
    H.domain(exitTime >= entryTime, "exitTime");
    H.domain(windowEnd >= windowStart, "windowEnd");
    return {
      includedPersonTime: Math.max(
        0,
        Math.min(exitTime, windowEnd) - Math.max(entryTime, windowStart),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { entryTime: 2, exitTime: 8, windowStart: 4, windowEnd: 10 },
  output: { includedPersonTime: 4 },
} satisfies ToolExample<Input, Output>;
export const personTimeEntryExitOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/person-time-entry-exit-overlap",
    title: "Person Time Entry Exit Overlap Tool",
    description:
      "Calculate supplied person-risk interval overlap with a half-open observation window without determining disease-free eligibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entryTime: { type: "number" },
        exitTime: { type: "number" },
        windowStart: { type: "number" },
        windowEnd: { type: "number" },
      },
      required: ["entryTime", "exitTime", "windowStart", "windowEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { includedPersonTime: { type: "number" } },
      required: ["includedPersonTime"],
    },
    ports: {
      inputs: [
        {
          id: "entryTime",
          label: "Entry Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exitTime",
          label: "Exit Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowStart",
          label: "Window Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowEnd",
          label: "Window End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "includedPersonTime",
          label: "Included Person Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = personTimeEntryExitOverlapTool.execute;
export default personTimeEntryExitOverlapTool;
