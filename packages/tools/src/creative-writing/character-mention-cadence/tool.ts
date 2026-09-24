import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly mentionPositions: readonly number[] };
export type Output = {
  readonly gaps: readonly number[];
  readonly meanGap: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mentionPositions: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["mentionPositions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gaps: { type: "array", maxItems: 256, items: { type: "integer" } },
    meanGap: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["gaps", "meanGap", "defined"],
} as const;
/** Calculate character mention cadence from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mentionPositions } = request;
  const compute = (): Output => {
    H.domain(
      mentionPositions.every(
        (x, i) => x >= 0 && (i === 0 || x >= mentionPositions[i - 1]),
      ),
    );
    return {
      gaps: mentionPositions.slice(1).map((x, i) => x - mentionPositions[i]),
      meanGap:
        mentionPositions.length > 1
          ? (mentionPositions[mentionPositions.length - 1] -
              mentionPositions[0]) /
            (mentionPositions.length - 1)
          : 0,
      defined: mentionPositions.length > 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mentionPositions: [2, 7, 14] },
  output: { gaps: [5, 7], meanGap: 6, defined: true },
} satisfies ToolExample<Input, Output>;
export const characterMentionCadenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "creative-writing/character-mention-cadence",
    title: "Character Mention Cadence Tool",
    description:
      "Calculate character mention cadence from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mentionPositions: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["mentionPositions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gaps: { type: "array", maxItems: 256, items: { type: "integer" } },
        meanGap: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["gaps", "meanGap", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "mentionPositions",
          label: "Mention Positions",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "gaps",
          label: "Gaps",
          valueType: { type: "list", items: { type: "integer" } },
        },
        { id: "meanGap", label: "Mean Gap", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = characterMentionCadenceTool.execute;
export default characterMentionCadenceTool;
