import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activityIds: readonly string[];
  readonly recordedContexts: readonly string[];
  readonly sourceContexts: readonly string[];
  readonly unknownContext: string;
};
export type Output = {
  readonly knownPairs: number;
  readonly contextDisagreements: number;
  readonly unknownPairs: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activityIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    recordedContexts: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sourceContexts: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    unknownContext: { type: "string", maxLength: 8192 },
  },
  required: [
    "activityIds",
    "recordedContexts",
    "sourceContexts",
    "unknownContext",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    knownPairs: { type: "integer" },
    contextDisagreements: { type: "integer" },
    unknownPairs: { type: "integer" },
  },
  required: ["knownPairs", "contextDisagreements", "unknownPairs"],
} as const;
/** Calculate activity context source gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activityIds, recordedContexts, sourceContexts, unknownContext } =
    request;
  const compute = (): Output => {
    H.sameLength(activityIds, recordedContexts);
    H.sameLength(activityIds, sourceContexts);
    return {
      knownPairs: activityIds.filter(
        (x, i) =>
          recordedContexts[i] !== unknownContext &&
          sourceContexts[i] !== unknownContext,
      ).length,
      contextDisagreements: activityIds.filter(
        (x, i) =>
          recordedContexts[i] !== unknownContext &&
          sourceContexts[i] !== unknownContext &&
          recordedContexts[i] !== sourceContexts[i],
      ).length,
      unknownPairs: activityIds.filter(
        (x, i) =>
          recordedContexts[i] === unknownContext ||
          sourceContexts[i] === unknownContext,
      ).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    activityIds: ["a", "b"],
    recordedContexts: ["home", "?"],
    sourceContexts: ["work", "home"],
    unknownContext: "?",
  },
  output: { knownPairs: 1, contextDisagreements: 1, unknownPairs: 1 },
} satisfies ToolExample<Input, Output>;
export const activityContextSourceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-therapy/activity-context-source-gap",
    title: "Activity Context Source Gap Tool",
    description:
      "Calculate activity context source gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activityIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        recordedContexts: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sourceContexts: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        unknownContext: { type: "string", maxLength: 8192 },
      },
      required: [
        "activityIds",
        "recordedContexts",
        "sourceContexts",
        "unknownContext",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        knownPairs: { type: "integer" },
        contextDisagreements: { type: "integer" },
        unknownPairs: { type: "integer" },
      },
      required: ["knownPairs", "contextDisagreements", "unknownPairs"],
    },
    ports: {
      inputs: [
        {
          id: "activityIds",
          label: "Activity Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "recordedContexts",
          label: "Recorded Contexts",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sourceContexts",
          label: "Source Contexts",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "unknownContext",
          label: "Unknown Context",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "knownPairs",
          label: "Known Pairs",
          valueType: { type: "integer" },
        },
        {
          id: "contextDisagreements",
          label: "Context Disagreements",
          valueType: { type: "integer" },
        },
        {
          id: "unknownPairs",
          label: "Unknown Pairs",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = activityContextSourceGapTool.execute;
export default activityContextSourceGapTool;
