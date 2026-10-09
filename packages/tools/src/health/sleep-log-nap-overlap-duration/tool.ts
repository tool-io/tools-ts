import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sleepStartMinutes: number;
  readonly sleepEndMinutes: number;
  readonly napStartMinutes: number;
  readonly napEndMinutes: number;
};
export type Output = { readonly overlapMinutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sleepStartMinutes: { type: "number" },
    sleepEndMinutes: { type: "number" },
    napStartMinutes: { type: "number" },
    napEndMinutes: { type: "number" },
  },
  required: [
    "sleepStartMinutes",
    "sleepEndMinutes",
    "napStartMinutes",
    "napEndMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { overlapMinutes: { type: "number" } },
  required: ["overlapMinutes"],
} as const;
/** Intersect explicit half-open sleep and nap intervals on one continuous minute timeline without detecting sleep. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sleepStartMinutes, sleepEndMinutes, napStartMinutes, napEndMinutes } =
    request;
  const compute = (): Output => {
    H.domain(sleepEndMinutes >= sleepStartMinutes, "sleepEndMinutes");
    H.domain(napEndMinutes >= napStartMinutes, "napEndMinutes");
    return {
      overlapMinutes: Math.max(
        0,
        Math.min(sleepEndMinutes, napEndMinutes) -
          Math.max(sleepStartMinutes, napStartMinutes),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sleepStartMinutes: 100,
    sleepEndMinutes: 200,
    napStartMinutes: 180,
    napEndMinutes: 220,
  },
  output: { overlapMinutes: 20 },
} satisfies ToolExample<Input, Output>;
export const sleepLogNapOverlapDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["health", "health and medicine"],
      keywords: ["health", "health and medicine"],
    },
    id: "health/sleep-log-nap-overlap-duration",
    title: "Sleep Log Nap Overlap Duration",
    description:
      "Intersect explicit half-open sleep and nap intervals on one continuous minute timeline without detecting sleep.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sleepStartMinutes: { type: "number" },
        sleepEndMinutes: { type: "number" },
        napStartMinutes: { type: "number" },
        napEndMinutes: { type: "number" },
      },
      required: [
        "sleepStartMinutes",
        "sleepEndMinutes",
        "napStartMinutes",
        "napEndMinutes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { overlapMinutes: { type: "number" } },
      required: ["overlapMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "sleepStartMinutes",
          label: "Sleep Start Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sleepEndMinutes",
          label: "Sleep End Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "napStartMinutes",
          label: "Nap Start Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "napEndMinutes",
          label: "Nap End Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "overlapMinutes",
          label: "Overlap Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sleepLogNapOverlapDurationTool.execute;
export default sleepLogNapOverlapDurationTool;
