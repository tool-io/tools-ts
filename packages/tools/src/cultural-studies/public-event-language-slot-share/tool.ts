import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly languageSlots: readonly number[];
  readonly simultaneousDuplicate: number;
  readonly allSlots: number;
};
export type Output = {
  readonly uniqueLanguageSlots: number;
  readonly share: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    languageSlots: { type: "array", maxItems: 256, items: { type: "number" } },
    simultaneousDuplicate: { type: "number", minimum: 0 },
    allSlots: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["languageSlots", "simultaneousDuplicate", "allSlots"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueLanguageSlots: { type: "number" },
    share: { type: "number" },
  },
  required: ["uniqueLanguageSlots", "share"],
} as const;
/** Use an independently supplied duplicate-slot deduction rather than assuming language slots never overlap. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { languageSlots, simultaneousDuplicate, allSlots } = request;
  const compute = (): Output => {
    H.positive(allSlots);
    H.domain(
      languageSlots.every((x) => x >= 0) &&
        simultaneousDuplicate >= 0 &&
        simultaneousDuplicate <= languageSlots.reduce((a, b) => a + b, 0),
    );
    return {
      uniqueLanguageSlots:
        languageSlots.reduce((a, b) => a + b, 0) - simultaneousDuplicate,
      share:
        (languageSlots.reduce((a, b) => a + b, 0) - simultaneousDuplicate) /
        allSlots,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { languageSlots: [20, 30], simultaneousDuplicate: 5, allSlots: 100 },
  output: { uniqueLanguageSlots: 45, share: 0.45 },
} satisfies ToolExample<Input, Output>;
export const publicEventLanguageSlotShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-studies/public-event-language-slot-share",
    title: "Public Event Language Slot Share Tool",
    description:
      "Use an independently supplied duplicate-slot deduction rather than assuming language slots never overlap.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        languageSlots: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        simultaneousDuplicate: { type: "number", minimum: 0 },
        allSlots: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["languageSlots", "simultaneousDuplicate", "allSlots"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uniqueLanguageSlots: { type: "number" },
        share: { type: "number" },
      },
      required: ["uniqueLanguageSlots", "share"],
    },
    ports: {
      inputs: [
        {
          id: "languageSlots",
          label: "Language Slots",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "simultaneousDuplicate",
          label: "Simultaneous Duplicate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allSlots",
          label: "All Slots",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "uniqueLanguageSlots",
          label: "Unique Language Slots",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = publicEventLanguageSlotShareTool.execute;
export default publicEventLanguageSlotShareTool;
