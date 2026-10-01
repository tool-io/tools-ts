import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstEntryMinutes: number;
  readonly secondEntryMinutes: number;
  readonly duplicatedMinutes: number;
  readonly creditDuplicate: boolean;
};
export type Output = {
  readonly countedMinutes: number;
  readonly duplicateCredit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstEntryMinutes: { type: "number", minimum: 0 },
    secondEntryMinutes: { type: "number", minimum: 0 },
    duplicatedMinutes: { type: "number", minimum: 0 },
    creditDuplicate: { type: "boolean" },
  },
  required: [
    "firstEntryMinutes",
    "secondEntryMinutes",
    "duplicatedMinutes",
    "creditDuplicate",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countedMinutes: { type: "number" },
    duplicateCredit: { type: "number" },
  },
  required: ["countedMinutes", "duplicateCredit"],
} as const;
/** Audit administrative handoff entry durations under an explicit duplicate-credit policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstEntryMinutes,
    secondEntryMinutes,
    duplicatedMinutes,
    creditDuplicate,
  } = request;
  const compute = (): Output => {
    H.domain(
      firstEntryMinutes >= 0 &&
        secondEntryMinutes >= 0 &&
        duplicatedMinutes >= 0 &&
        duplicatedMinutes <= Math.min(firstEntryMinutes, secondEntryMinutes),
    );
    return {
      countedMinutes:
        firstEntryMinutes +
        secondEntryMinutes -
        (creditDuplicate ? duplicatedMinutes : 0),
      duplicateCredit: creditDuplicate ? duplicatedMinutes : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstEntryMinutes: 20,
    secondEntryMinutes: 15,
    duplicatedMinutes: 5,
    creditDuplicate: true,
  },
  output: { countedMinutes: 30, duplicateCredit: 5 },
} satisfies ToolExample<Input, Output>;
export const nursingHandoffDoubleEntryMinuteFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "nursing/nursing-handoff-double-entry-minute-flag",
      title: "Nursing Handoff Double Entry Minute Flag Tool",
      description:
        "Audit administrative handoff entry durations under an explicit duplicate-credit policy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstEntryMinutes: { type: "number", minimum: 0 },
          secondEntryMinutes: { type: "number", minimum: 0 },
          duplicatedMinutes: { type: "number", minimum: 0 },
          creditDuplicate: { type: "boolean" },
        },
        required: [
          "firstEntryMinutes",
          "secondEntryMinutes",
          "duplicatedMinutes",
          "creditDuplicate",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          countedMinutes: { type: "number" },
          duplicateCredit: { type: "number" },
        },
        required: ["countedMinutes", "duplicateCredit"],
      },
      ports: {
        inputs: [
          {
            id: "firstEntryMinutes",
            label: "First Entry Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondEntryMinutes",
            label: "Second Entry Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "duplicatedMinutes",
            label: "Duplicated Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "creditDuplicate",
            label: "Credit Duplicate",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "countedMinutes",
            label: "Counted Minutes",
            valueType: { type: "number" },
          },
          {
            id: "duplicateCredit",
            label: "Duplicate Credit",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = nursingHandoffDoubleEntryMinuteFlagTool.execute;
export default nursingHandoffDoubleEntryMinuteFlagTool;
