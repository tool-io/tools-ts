import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordDay: number;
  readonly effectiveDay: number;
  readonly inclusive: boolean;
  readonly replacementPresent: boolean;
};
export type Output = {
  readonly deprecated: boolean;
  readonly replacementApplicable: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordDay: { type: "integer" },
    effectiveDay: { type: "integer" },
    inclusive: { type: "boolean" },
    replacementPresent: { type: "boolean" },
  },
  required: ["recordDay", "effectiveDay", "inclusive", "replacementPresent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deprecated: { type: "boolean" },
    replacementApplicable: { type: "boolean" },
  },
  required: ["deprecated", "replacementApplicable"],
} as const;
/** Caller-defined deprecation-date boundary for a supplied vocabulary record, without an external vocabulary lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordDay, effectiveDay, inclusive, replacementPresent } = request;
  const compute = (): Output => {
    return {
      deprecated: inclusive
        ? recordDay >= effectiveDay
        : recordDay > effectiveDay,
      replacementApplicable:
        replacementPresent &&
        (inclusive ? recordDay >= effectiveDay : recordDay > effectiveDay),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordDay: 20,
    effectiveDay: 20,
    inclusive: true,
    replacementPresent: true,
  },
  output: { deprecated: true, replacementApplicable: true },
} satisfies ToolExample<Input, Output>;
export const controlledVocabularyOneDeprecationDateTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "information-science/controlled-vocabulary-one-deprecation-date",
      title: "Controlled Vocabulary One Deprecation Date Tool",
      description:
        "Caller-defined deprecation-date boundary for a supplied vocabulary record, without an external vocabulary lookup.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordDay: { type: "integer" },
          effectiveDay: { type: "integer" },
          inclusive: { type: "boolean" },
          replacementPresent: { type: "boolean" },
        },
        required: [
          "recordDay",
          "effectiveDay",
          "inclusive",
          "replacementPresent",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          deprecated: { type: "boolean" },
          replacementApplicable: { type: "boolean" },
        },
        required: ["deprecated", "replacementApplicable"],
      },
      ports: {
        inputs: [
          {
            id: "recordDay",
            label: "Record Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "effectiveDay",
            label: "Effective Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "inclusive",
            label: "Inclusive",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "replacementPresent",
            label: "Replacement Present",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "deprecated",
            label: "Deprecated",
            valueType: { type: "boolean" },
          },
          {
            id: "replacementApplicable",
            label: "Replacement Applicable",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = controlledVocabularyOneDeprecationDateTool.execute;
export default controlledVocabularyOneDeprecationDateTool;
