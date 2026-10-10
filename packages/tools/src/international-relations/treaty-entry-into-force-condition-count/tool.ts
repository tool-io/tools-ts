import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredConditions: readonly boolean[];
  readonly recordedMet: readonly boolean[];
};
export type Output = {
  readonly requiredCount: number;
  readonly requiredMetCount: number;
  readonly allRequiredMet: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredConditions: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    recordedMet: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["requiredConditions", "recordedMet"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredCount: { type: "integer" },
    requiredMetCount: { type: "integer" },
    allRequiredMet: { type: "boolean" },
  },
  required: ["requiredCount", "requiredMetCount", "allRequiredMet"],
} as const;
/** Count explicitly required and recorded-met treaty conditions without declaring entry into force or evaluating legal requirements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredConditions, recordedMet } = request;
  const compute = (): Output => {
    return (() => {
      H.domain(requiredConditions.length === recordedMet.length, "recordedMet");
      const requiredCount = requiredConditions.filter(Boolean).length,
        requiredMetCount = requiredConditions.filter(
          (required, i) => required && recordedMet[i],
        ).length;
      return {
        requiredCount,
        requiredMetCount,
        allRequiredMet: requiredMetCount === requiredCount,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requiredConditions: [true, true, false],
    recordedMet: [true, false, true],
  },
  output: { requiredCount: 2, requiredMetCount: 1, allRequiredMet: false },
} satisfies ToolExample<Input, Output>;
export const treatyEntryIntoForceConditionCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "international-relations",
        "international relations",
        "social sciences",
      ],
      keywords: ["international relations", "social sciences"],
    },
    id: "international-relations/treaty-entry-into-force-condition-count",
    title: "Treaty Entry Into Force Condition Count",
    description:
      "Count explicitly required and recorded-met treaty conditions without declaring entry into force or evaluating legal requirements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredConditions: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        recordedMet: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["requiredConditions", "recordedMet"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredCount: { type: "integer" },
        requiredMetCount: { type: "integer" },
        allRequiredMet: { type: "boolean" },
      },
      required: ["requiredCount", "requiredMetCount", "allRequiredMet"],
    },
    ports: {
      inputs: [
        {
          id: "requiredConditions",
          label: "Required Conditions",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "recordedMet",
          label: "Recorded Met",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "requiredCount",
          label: "Required Count",
          valueType: { type: "integer" },
        },
        {
          id: "requiredMetCount",
          label: "Required Met Count",
          valueType: { type: "integer" },
        },
        {
          id: "allRequiredMet",
          label: "All Required Met",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = treatyEntryIntoForceConditionCountTool.execute;
export default treatyEntryIntoForceConditionCountTool;
