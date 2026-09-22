import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly choices: readonly boolean[];
  readonly required: readonly boolean[];
};
export type Output = {
  readonly selectedIndexes: readonly number[];
  readonly missingRequired: readonly number[];
  readonly complete: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    choices: { type: "array", maxItems: 256, items: { type: "boolean" } },
    required: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["choices", "required"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selectedIndexes: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    missingRequired: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    complete: { type: "boolean" },
  },
  required: ["selectedIndexes", "missingRequired", "complete"],
} as const;
/** Apply explicit item selections and required-item flags; this is not a consent validity determination. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { choices, required } = request;
  const compute = (): Output => {
    H.sameLength(choices, required);
    const selectedIndexes = choices.flatMap((x, i) => (x ? [i] : [])),
      missingRequired = required.flatMap((x, i) =>
        x && !choices[i] ? [i] : [],
      );
    return {
      selectedIndexes,
      missingRequired,
      complete: missingRequired.length === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { choices: [true, false, true], required: [true, false, false] },
  output: { selectedIndexes: [0, 2], missingRequired: [], complete: true },
} satisfies ToolExample<Input, Output>;
export const optionalBiobankConsentChoiceMaskTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioethics/optional-biobank-consent-choice-mask",
    title: "Optional Biobank Consent Choice Mask Tool",
    description:
      "Apply explicit item selections and required-item flags; this is not a consent validity determination.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        choices: { type: "array", maxItems: 256, items: { type: "boolean" } },
        required: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["choices", "required"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        selectedIndexes: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        missingRequired: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        complete: { type: "boolean" },
      },
      required: ["selectedIndexes", "missingRequired", "complete"],
    },
    ports: {
      inputs: [
        {
          id: "choices",
          label: "Choices",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "required",
          label: "Required",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "selectedIndexes",
          label: "Selected Indexes",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "missingRequired",
          label: "Missing Required",
          valueType: { type: "list", items: { type: "integer" } },
        },
        { id: "complete", label: "Complete", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = optionalBiobankConsentChoiceMaskTool.execute;
export default optionalBiobankConsentChoiceMaskTool;
