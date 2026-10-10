import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cueText: string;
  readonly maximumCodePoints: number;
};
export type Output = {
  readonly codePointCount: number;
  readonly remainingBudget: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cueText: { type: "string", maxLength: 8192 },
    maximumCodePoints: { type: "integer", minimum: 0 },
  },
  required: ["cueText", "maximumCodePoints"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    codePointCount: { type: "integer" },
    remainingBudget: { type: "integer" },
    fits: { type: "boolean" },
  },
  required: ["codePointCount", "remainingBudget", "fits"],
} as const;
/** Compare explicit stage-title cue text with a supplied Unicode code-point budget without treating code points as display columns. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cueText, maximumCodePoints } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(maximumCodePoints) &&
        maximumCodePoints >= 0 &&
        maximumCodePoints <= Number.MAX_SAFE_INTEGER,
      "maximumCodePoints",
    ),
      maximumCodePoints);
    return (() => {
      const codePointCount = Array.from(cueText).length;
      return {
        codePointCount,
        remainingBudget: maximumCodePoints - codePointCount,
        fits: codePointCount <= maximumCodePoints,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cueText: "Hello world", maximumCodePoints: 20 },
  output: { codePointCount: 11, remainingBudget: 9, fits: true },
} satisfies ToolExample<Input, Output>;
export const subtitleSuperTitleCueLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["performing-arts", "performing arts", "arts and design"],
      keywords: ["performing arts", "arts and design"],
    },
    id: "performing-arts/subtitle-super-title-cue-length",
    title: "Subtitle Super Title Cue Length",
    description:
      "Compare explicit stage-title cue text with a supplied Unicode code-point budget without treating code points as display columns.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cueText: { type: "string", maxLength: 8192 },
        maximumCodePoints: { type: "integer", minimum: 0 },
      },
      required: ["cueText", "maximumCodePoints"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        codePointCount: { type: "integer" },
        remainingBudget: { type: "integer" },
        fits: { type: "boolean" },
      },
      required: ["codePointCount", "remainingBudget", "fits"],
    },
    ports: {
      inputs: [
        {
          id: "cueText",
          label: "Cue Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "maximumCodePoints",
          label: "Maximum Code Points",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "codePointCount",
          label: "Code Point Count",
          valueType: { type: "integer" },
        },
        {
          id: "remainingBudget",
          label: "Remaining Budget",
          valueType: { type: "integer" },
        },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = subtitleSuperTitleCueLengthTool.execute;
export default subtitleSuperTitleCueLengthTool;
