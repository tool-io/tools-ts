import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly choices: readonly boolean[];
  readonly disclosed: readonly boolean[];
  readonly required: readonly boolean[];
};
export type Output = {
  readonly undisclosedSelections: readonly number[];
  readonly missingRequired: readonly number[];
  readonly complete: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    choices: { type: "array", maxItems: 256, items: { type: "boolean" } },
    disclosed: { type: "array", maxItems: 256, items: { type: "boolean" } },
    required: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["choices", "disclosed", "required"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    undisclosedSelections: {
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
  required: ["undisclosedSelections", "missingRequired", "complete"],
} as const;
/** Audit explicit choice/disclosure/required flags without deciding legal consent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { choices, disclosed, required } = request;
  const compute = (): Output => {
    H.sameLength(choices, disclosed);
    H.sameLength(choices, required);
    const undisclosedSelections = choices.flatMap((x, i) =>
        x && !disclosed[i] ? [i] : [],
      ),
      missingRequired = required.flatMap((x, i) =>
        x && !choices[i] ? [i] : [],
      );
    return {
      undisclosedSelections,
      missingRequired,
      complete:
        undisclosedSelections.length === 0 && missingRequired.length === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    choices: [true, false],
    disclosed: [false, true],
    required: [false, true],
  },
  output: { undisclosedSelections: [0], missingRequired: [1], complete: false },
} satisfies ToolExample<Input, Output>;
export const naturopathyConsentDisclosureChoiceMaskTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "naturopathy/naturopathy-consent-disclosure-choice-mask",
      title: "Naturopathy Consent Disclosure Choice Mask Tool",
      description:
        "Audit explicit choice/disclosure/required flags without deciding legal consent.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          choices: { type: "array", maxItems: 256, items: { type: "boolean" } },
          disclosed: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
          required: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
        },
        required: ["choices", "disclosed", "required"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          undisclosedSelections: {
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
        required: ["undisclosedSelections", "missingRequired", "complete"],
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
            id: "disclosed",
            label: "Disclosed",
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
            id: "undisclosedSelections",
            label: "Undisclosed Selections",
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
export const run = naturopathyConsentDisclosureChoiceMaskTool.execute;
export default naturopathyConsentDisclosureChoiceMaskTool;
