import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly characterIds: readonly string[];
  readonly sourceIds: readonly string[];
  readonly states: readonly string[];
  readonly missingState: string;
};
export type Output = {
  readonly characters: number;
  readonly ambiguousCharacters: number;
  readonly unsupportedCharacters: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    characterIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sourceIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    states: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    missingState: { type: "string", maxLength: 8192 },
  },
  required: ["characterIds", "sourceIds", "states", "missingState"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    characters: { type: "integer" },
    ambiguousCharacters: { type: "integer" },
    unsupportedCharacters: { type: "integer" },
  },
  required: ["characters", "ambiguousCharacters", "unsupportedCharacters"],
} as const;
/** Calculate character source ambiguity gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { characterIds, sourceIds, states, missingState } = request;
  const compute = (): Output => {
    H.sameLength(characterIds, sourceIds);
    H.sameLength(characterIds, states);
    return (() => {
      const all = new Set(characterIds);
      let ambiguousCharacters = 0,
        unsupportedCharacters = 0;
      for (const c of all) {
        const indices = characterIds.flatMap((x, i) => (x === c ? [i] : [])),
          known = new Set(
            indices
              .filter(
                (i) => sourceIds[i].length > 0 && states[i] !== missingState,
              )
              .map((i) => states[i]),
          );
        if (known.size === 0) unsupportedCharacters++;
        if (known.size > 1) ambiguousCharacters++;
      }
      return {
        characters: all.size,
        ambiguousCharacters,
        unsupportedCharacters,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    characterIds: ["a", "a", "b"],
    sourceIds: ["s1", "s2", ""],
    states: ["0", "1", "?"],
    missingState: "?",
  },
  output: { characters: 2, ambiguousCharacters: 1, unsupportedCharacters: 1 },
} satisfies ToolExample<Input, Output>;
export const characterSourceAmbiguityGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosystematics/character-source-ambiguity-gap",
    title: "Character Source Ambiguity Gap Tool",
    description:
      "Calculate character source ambiguity gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        characterIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sourceIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        states: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        missingState: { type: "string", maxLength: 8192 },
      },
      required: ["characterIds", "sourceIds", "states", "missingState"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        characters: { type: "integer" },
        ambiguousCharacters: { type: "integer" },
        unsupportedCharacters: { type: "integer" },
      },
      required: ["characters", "ambiguousCharacters", "unsupportedCharacters"],
    },
    ports: {
      inputs: [
        {
          id: "characterIds",
          label: "Character Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sourceIds",
          label: "Source Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "states",
          label: "States",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "missingState",
          label: "Missing State",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "characters",
          label: "Characters",
          valueType: { type: "integer" },
        },
        {
          id: "ambiguousCharacters",
          label: "Ambiguous Characters",
          valueType: { type: "integer" },
        },
        {
          id: "unsupportedCharacters",
          label: "Unsupported Characters",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = characterSourceAmbiguityGapTool.execute;
export default characterSourceAmbiguityGapTool;
