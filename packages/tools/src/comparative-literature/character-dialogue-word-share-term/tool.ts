import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly characterWords: number;
  readonly allDialogueWords: number;
  readonly narrativeWords: number;
};
export type Output = {
  readonly dialogueShare: number;
  readonly wholeTextShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    characterWords: { type: "integer", minimum: 0 },
    allDialogueWords: { type: "integer", minimum: 1 },
    narrativeWords: { type: "integer", minimum: 0 },
  },
  required: ["characterWords", "allDialogueWords", "narrativeWords"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dialogueShare: { type: "number" },
    wholeTextShare: { type: "number" },
  },
  required: ["dialogueShare", "wholeTextShare"],
} as const;
/** Calculate character dialogue word share term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { characterWords, allDialogueWords, narrativeWords } = request;
  const compute = (): Output => {
    H.integer(allDialogueWords, 1);
    H.integer(characterWords, 0, allDialogueWords);
    H.integer(narrativeWords, 0);
    return {
      dialogueShare: characterWords / allDialogueWords,
      wholeTextShare: characterWords / (allDialogueWords + narrativeWords),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { characterWords: 100, allDialogueWords: 400, narrativeWords: 600 },
  output: { dialogueShare: 0.25, wholeTextShare: 0.1 },
} satisfies ToolExample<Input, Output>;
export const characterDialogueWordShareTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "comparative-literature/character-dialogue-word-share-term",
    title: "Character Dialogue Word Share Term Tool",
    description:
      "Calculate character dialogue word share term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        characterWords: { type: "integer", minimum: 0 },
        allDialogueWords: { type: "integer", minimum: 1 },
        narrativeWords: { type: "integer", minimum: 0 },
      },
      required: ["characterWords", "allDialogueWords", "narrativeWords"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dialogueShare: { type: "number" },
        wholeTextShare: { type: "number" },
      },
      required: ["dialogueShare", "wholeTextShare"],
    },
    ports: {
      inputs: [
        {
          id: "characterWords",
          label: "Character Words",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "allDialogueWords",
          label: "All Dialogue Words",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "narrativeWords",
          label: "Narrative Words",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "dialogueShare",
          label: "Dialogue Share",
          valueType: { type: "number" },
        },
        {
          id: "wholeTextShare",
          label: "Whole Text Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = characterDialogueWordShareTermTool.execute;
export default characterDialogueWordShareTermTool;
