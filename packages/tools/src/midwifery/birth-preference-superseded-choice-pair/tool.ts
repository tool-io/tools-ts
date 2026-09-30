import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalId: string;
  readonly replacementParent: string;
  readonly originalChoice: string;
  readonly replacementChoice: string;
  readonly originalRev: number;
  readonly replacementRev: number;
};
export type Output = {
  readonly linked: boolean;
  readonly changed: boolean;
  readonly later: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalId: { type: "string", maxLength: 8192 },
    replacementParent: { type: "string", maxLength: 8192 },
    originalChoice: { type: "string", maxLength: 8192 },
    replacementChoice: { type: "string", maxLength: 8192 },
    originalRev: { type: "integer", minimum: 0 },
    replacementRev: { type: "integer", minimum: 0 },
  },
  required: [
    "originalId",
    "replacementParent",
    "originalChoice",
    "replacementChoice",
    "originalRev",
    "replacementRev",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    linked: { type: "boolean" },
    changed: { type: "boolean" },
    later: { type: "boolean" },
  },
  required: ["linked", "changed", "later"],
} as const;
/** Compare supplied preference revisions without deciding which preference is valid. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    originalId,
    replacementParent,
    originalChoice,
    replacementChoice,
    originalRev,
    replacementRev,
  } = request;
  const compute = (): Output => {
    H.integer(originalRev, 0);
    H.integer(replacementRev, 0);
    return {
      linked: originalId === replacementParent,
      changed: originalChoice !== replacementChoice,
      later: replacementRev > originalRev,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    originalId: "P1",
    replacementParent: "P1",
    originalChoice: "A",
    replacementChoice: "B",
    originalRev: 1,
    replacementRev: 2,
  },
  output: { linked: true, changed: true, later: true },
} satisfies ToolExample<Input, Output>;
export const birthPreferenceSupersededChoicePairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "midwifery/birth-preference-superseded-choice-pair",
      title: "Birth Preference Superseded Choice Pair Tool",
      description:
        "Compare supplied preference revisions without deciding which preference is valid.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          originalId: { type: "string", maxLength: 8192 },
          replacementParent: { type: "string", maxLength: 8192 },
          originalChoice: { type: "string", maxLength: 8192 },
          replacementChoice: { type: "string", maxLength: 8192 },
          originalRev: { type: "integer", minimum: 0 },
          replacementRev: { type: "integer", minimum: 0 },
        },
        required: [
          "originalId",
          "replacementParent",
          "originalChoice",
          "replacementChoice",
          "originalRev",
          "replacementRev",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          linked: { type: "boolean" },
          changed: { type: "boolean" },
          later: { type: "boolean" },
        },
        required: ["linked", "changed", "later"],
      },
      ports: {
        inputs: [
          {
            id: "originalId",
            label: "Original Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "replacementParent",
            label: "Replacement Parent",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "originalChoice",
            label: "Original Choice",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "replacementChoice",
            label: "Replacement Choice",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "originalRev",
            label: "Original Rev",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "replacementRev",
            label: "Replacement Rev",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "linked", label: "Linked", valueType: { type: "boolean" } },
          { id: "changed", label: "Changed", valueType: { type: "boolean" } },
          { id: "later", label: "Later", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = birthPreferenceSupersededChoicePairTool.execute;
export default birthPreferenceSupersededChoicePairTool;
