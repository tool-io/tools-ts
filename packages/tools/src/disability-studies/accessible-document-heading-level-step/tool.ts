import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousLevel: number;
  readonly nextLevel: number;
};
export type Output = { readonly step: number; readonly skippedLevel: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousLevel: { type: "integer", minimum: 1, maximum: 6 },
    nextLevel: { type: "integer", minimum: 1, maximum: 6 },
  },
  required: ["previousLevel", "nextLevel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { step: { type: "integer" }, skippedLevel: { type: "boolean" } },
  required: ["step", "skippedLevel"],
} as const;
/** Flag a downward heading hierarchy jump of more than one level in a supplied adjacent pair; this is not a complete document accessibility audit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousLevel, nextLevel } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(previousLevel) &&
        previousLevel >= 1 &&
        previousLevel <= 6,
      "previousLevel",
    ),
      previousLevel);
    (H.domain(
      Number.isSafeInteger(nextLevel) && nextLevel >= 1 && nextLevel <= 6,
      "nextLevel",
    ),
      nextLevel);
    return {
      step: nextLevel - previousLevel,
      skippedLevel: nextLevel > previousLevel + 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousLevel: 2, nextLevel: 4 },
  output: { step: 2, skippedLevel: true },
} satisfies ToolExample<Input, Output>;
export const accessibleDocumentHeadingLevelStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "disability-studies/accessible-document-heading-level-step",
    title: "Accessible Document Heading Level Step Tool",
    description:
      "Flag a downward heading hierarchy jump of more than one level in a supplied adjacent pair; this is not a complete document accessibility audit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousLevel: { type: "integer", minimum: 1, maximum: 6 },
        nextLevel: { type: "integer", minimum: 1, maximum: 6 },
      },
      required: ["previousLevel", "nextLevel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        step: { type: "integer" },
        skippedLevel: { type: "boolean" },
      },
      required: ["step", "skippedLevel"],
    },
    ports: {
      inputs: [
        {
          id: "previousLevel",
          label: "Previous Level",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "nextLevel",
          label: "Next Level",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "step", label: "Step", valueType: { type: "integer" } },
        {
          id: "skippedLevel",
          label: "Skipped Level",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = accessibleDocumentHeadingLevelStepTool.execute;
export default accessibleDocumentHeadingLevelStepTool;
