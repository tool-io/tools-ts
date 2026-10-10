import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly occurrenceCount: number;
  readonly repeatable: boolean;
  readonly required: boolean;
};
export type Output = {
  readonly missingRequired: boolean;
  readonly repeatsDisallowed: boolean;
  readonly conformsUnderFlags: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occurrenceCount: { type: "integer", minimum: 0 },
    repeatable: { type: "boolean" },
    required: { type: "boolean" },
  },
  required: ["occurrenceCount", "repeatable", "required"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingRequired: { type: "boolean" },
    repeatsDisallowed: { type: "boolean" },
    conformsUnderFlags: { type: "boolean" },
  },
  required: ["missingRequired", "repeatsDisallowed", "conformsUnderFlags"],
} as const;
/** Check an explicit metadata occurrence count against supplied required and repeatable flags. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { occurrenceCount, repeatable, required } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(occurrenceCount) &&
        occurrenceCount >= 0 &&
        occurrenceCount <= Number.MAX_SAFE_INTEGER,
      "occurrenceCount",
    ),
      occurrenceCount);
    return {
      missingRequired: required && occurrenceCount === 0,
      repeatsDisallowed: !repeatable && occurrenceCount > 1,
      conformsUnderFlags:
        (!required || occurrenceCount > 0) &&
        (repeatable || occurrenceCount <= 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { occurrenceCount: 2, repeatable: false, required: true },
  output: {
    missingRequired: false,
    repeatsDisallowed: true,
    conformsUnderFlags: false,
  },
} satisfies ToolExample<Input, Output>;
export const metadataRepeatabilityFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "information-science",
        "information science",
        "information and language sciences",
      ],
      keywords: ["information science", "information and language sciences"],
    },
    id: "information-science/metadata-repeatability-flag",
    title: "Metadata Repeatability Flag",
    description:
      "Check an explicit metadata occurrence count against supplied required and repeatable flags.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        occurrenceCount: { type: "integer", minimum: 0 },
        repeatable: { type: "boolean" },
        required: { type: "boolean" },
      },
      required: ["occurrenceCount", "repeatable", "required"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missingRequired: { type: "boolean" },
        repeatsDisallowed: { type: "boolean" },
        conformsUnderFlags: { type: "boolean" },
      },
      required: ["missingRequired", "repeatsDisallowed", "conformsUnderFlags"],
    },
    ports: {
      inputs: [
        {
          id: "occurrenceCount",
          label: "Occurrence Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "repeatable",
          label: "Repeatable",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "required",
          label: "Required",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "missingRequired",
          label: "Missing Required",
          valueType: { type: "boolean" },
        },
        {
          id: "repeatsDisallowed",
          label: "Repeats Disallowed",
          valueType: { type: "boolean" },
        },
        {
          id: "conformsUnderFlags",
          label: "Conforms Under Flags",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = metadataRepeatabilityFlagTool.execute;
export default metadataRepeatabilityFlagTool;
