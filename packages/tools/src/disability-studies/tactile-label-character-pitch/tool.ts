import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly characterCount: number;
  readonly pitchMillimeters: number;
  readonly endMarginMillimeters: number;
};
export type Output = { readonly requiredWidthMillimeters: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    characterCount: { type: "integer", minimum: 1 },
    pitchMillimeters: { type: "number", exclusiveMinimum: 0 },
    endMarginMillimeters: { type: "number", minimum: 0 },
  },
  required: ["characterCount", "pitchMillimeters", "endMarginMillimeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { requiredWidthMillimeters: { type: "number" } },
  required: ["requiredWidthMillimeters"],
} as const;
/** Measure first-to-last character center span plus explicit end margins for a tactile label; character geometry and accessibility compliance are not inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { characterCount, pitchMillimeters, endMarginMillimeters } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(characterCount) &&
        characterCount >= 1 &&
        characterCount <= Number.MAX_SAFE_INTEGER,
      "characterCount",
    ),
      characterCount);
    (H.domain(pitchMillimeters > 0, "pitchMillimeters"), pitchMillimeters);
    H.domain(endMarginMillimeters >= 0, "endMarginMillimeters");
    return {
      requiredWidthMillimeters:
        Math.max(0, characterCount - 1) * pitchMillimeters +
        2 * endMarginMillimeters,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { characterCount: 8, pitchMillimeters: 6, endMarginMillimeters: 3 },
  output: { requiredWidthMillimeters: 48 },
} satisfies ToolExample<Input, Output>;
export const tactileLabelCharacterPitchTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "disability-studies/tactile-label-character-pitch",
    title: "Tactile Label Character Pitch Tool",
    description:
      "Measure first-to-last character center span plus explicit end margins for a tactile label; character geometry and accessibility compliance are not inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        characterCount: { type: "integer", minimum: 1 },
        pitchMillimeters: { type: "number", exclusiveMinimum: 0 },
        endMarginMillimeters: { type: "number", minimum: 0 },
      },
      required: ["characterCount", "pitchMillimeters", "endMarginMillimeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { requiredWidthMillimeters: { type: "number" } },
      required: ["requiredWidthMillimeters"],
    },
    ports: {
      inputs: [
        {
          id: "characterCount",
          label: "Character Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "pitchMillimeters",
          label: "Pitch Millimeters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endMarginMillimeters",
          label: "End Margin Millimeters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "requiredWidthMillimeters",
          label: "Required Width Millimeters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tactileLabelCharacterPitchTool.execute;
export default tactileLabelCharacterPitchTool;
