import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventTimes: readonly number[];
  readonly eventKinds: readonly string[];
  readonly cutoff: number;
  readonly includeCutoff: boolean;
};
export type Output = {
  readonly reopenCount: number;
  readonly includedEvents: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventTimes: { type: "array", maxItems: 256, items: { type: "number" } },
    eventKinds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    cutoff: { type: "number" },
    includeCutoff: { type: "boolean" },
  },
  required: ["eventTimes", "eventKinds", "cutoff", "includeCutoff"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reopenCount: { type: "integer" },
    includedEvents: { type: "integer" },
  },
  required: ["reopenCount", "includedEvents"],
} as const;
/** Count exact supplied reopen event tokens up to an explicit cutoff without reconstructing query state. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventTimes, eventKinds, cutoff, includeCutoff } = request;
  const compute = (): Output => {
    H.sameLength(eventTimes, eventKinds);
    const selected = eventTimes.flatMap((t, i) =>
      (includeCutoff ? t <= cutoff : t < cutoff) ? [i] : [],
    );
    return {
      reopenCount: selected.filter((i) => eventKinds[i] === "reopen").length,
      includedEvents: selected.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eventTimes: [1, 3, 5, 7],
    eventKinds: ["open", "reopen", "close", "reopen"],
    cutoff: 5,
    includeCutoff: true,
  },
  output: { reopenCount: 1, includedEvents: 3 },
} satisfies ToolExample<Input, Output>;
export const queryReopenCountAtCutoffTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-research/query-reopen-count-at-cutoff",
    title: "Query Reopen Count At Cutoff Tool",
    description:
      "Count exact supplied reopen event tokens up to an explicit cutoff without reconstructing query state.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventTimes: { type: "array", maxItems: 256, items: { type: "number" } },
        eventKinds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        cutoff: { type: "number" },
        includeCutoff: { type: "boolean" },
      },
      required: ["eventTimes", "eventKinds", "cutoff", "includeCutoff"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reopenCount: { type: "integer" },
        includedEvents: { type: "integer" },
      },
      required: ["reopenCount", "includedEvents"],
    },
    ports: {
      inputs: [
        {
          id: "eventTimes",
          label: "Event Times",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "eventKinds",
          label: "Event Kinds",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "cutoff",
          label: "Cutoff",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeCutoff",
          label: "Include Cutoff",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "reopenCount",
          label: "Reopen Count",
          valueType: { type: "integer" },
        },
        {
          id: "includedEvents",
          label: "Included Events",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = queryReopenCountAtCutoffTool.execute;
export default queryReopenCountAtCutoffTool;
