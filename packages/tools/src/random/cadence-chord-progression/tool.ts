import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { calculate as classifyCadence } from "../../music/cadence-type-classifier/tool.js";
import { calculate as transpose } from "../../music/transpose-chord-progression/tool.js";
import { key, roman } from "../../music/shared.js";
import {
  objectSchema,
  arraySchema,
  countSchema,
  requireDistinct,
  ensureOutput,
} from "../m250-css-music-space-support.js";
export type CadenceTemplate = {
  readonly id: string;
  readonly sourceKey: string;
  readonly chordSymbols: readonly string[];
  readonly romanChords: readonly string[];
  readonly penultimateRootInBass: boolean;
  readonly finalTonicRootInBass: boolean;
  readonly finalSopranoOnTonic: boolean;
};
export type CadenceChordProgressionInput = {
  readonly templates: readonly CadenceTemplate[];
  readonly targetKeys: readonly string[];
  readonly count: number;
  readonly seed?: number;
};
export type CadenceChordProgressionOutput = {
  readonly exercises: readonly {
    readonly templateId: string;
    readonly sourceKey: string;
    readonly targetKey: string;
    readonly originalChordSymbols: readonly string[];
    readonly transposedChordSymbols: readonly string[];
    readonly romanChords: readonly string[];
    readonly signedDiatonicSteps: number;
    readonly signedChromaticSemitones: number;
    readonly cadenceLabel: string;
    readonly recognizedFunctionalCadence: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
const str = { type: "string", minLength: 1, maxLength: 32 } as const,
  strings = arraySchema(str, 16, 2),
  bool = { type: "boolean" } as const;
const keyName = {
  type: "string",
  minLength: 1,
  maxLength: 8,
  pattern: "^[A-G](?:#{1,2}|b{1,2}|x)?(?![\\s\\S])",
} as const;
const chordName = {
  type: "string",
  minLength: 1,
  maxLength: 32,
  pattern:
    "^[A-G](?:#{1,2}|b{1,2}|x)?(?:maj7|m7|dim7|m7b5|sus2|sus4|dim|aug|m|7)?(?:/[A-G](?:#{1,2}|b{1,2}|x)?)?(?![\\s\\S])",
} as const;
const romanName = {
  type: "string",
  minLength: 1,
  maxLength: 16,
  pattern:
    "^(?:bb|b|##|#)?(?:VII|VI|IV|V|III|II|I|vii|vi|iv|v|iii|ii|i)(?:o|ø|\\+)?7?(?![\\s\\S])",
} as const;
const template = objectSchema({
  id: str,
  sourceKey: keyName,
  chordSymbols: arraySchema(chordName, 16, 2),
  romanChords: arraySchema(romanName, 16, 2),
  penultimateRootInBass: bool,
  finalTonicRootInBass: bool,
  finalSopranoOnTonic: bool,
});
export const inputSchema = objectSchema(
  {
    templates: arraySchema(template, 16, 1),
    targetKeys: arraySchema(keyName, 16, 1),
    count: countSchema(32),
    seed: generatorSeedSchema,
  },
  ["templates", "targetKeys", "count"],
);
export const outputSchema = objectSchema({
  exercises: arraySchema(
    objectSchema({
      templateId: str,
      sourceKey: str,
      targetKey: str,
      originalChordSymbols: strings,
      transposedChordSymbols: strings,
      romanChords: strings,
      signedDiatonicSteps: { type: "integer" },
      signedChromaticSemitones: { type: "integer" },
      cadenceLabel: { type: "string" },
      recognizedFunctionalCadence: bool,
    }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const evaluate = (template: CadenceTemplate, targetKey: string) => {
  const from = key(template.sourceKey),
    to = key(targetKey),
    signedDiatonicSteps = to.letter - from.letter,
    signedChromaticSemitones = to.absolute - from.absolute;
  const cadence = classifyCadence({
    penultimateRomanChord:
      template.romanChords[template.romanChords.length - 2],
    finalRomanChord: template.romanChords[template.romanChords.length - 1],
    penultimateRootInBass: template.penultimateRootInBass,
    finalTonicRootInBass: template.finalTonicRootInBass,
    finalSopranoOnTonic: template.finalSopranoOnTonic,
  });
  const transposed = transpose({
    chordSymbols: template.chordSymbols,
    signedDiatonicSteps,
    signedChromaticSemitones,
  });
  return {
    templateId: template.id,
    sourceKey: template.sourceKey,
    targetKey,
    originalChordSymbols: [...template.chordSymbols],
    romanChords: [...template.romanChords],
    signedDiatonicSteps,
    signedChromaticSemitones,
    ...transposed,
    ...cadence,
  };
};
const isInput = (value: unknown): value is CadenceChordProgressionInput =>
  matchesModelInput(value, inputSchema);
export const calculateCadenceChordProgression = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CadenceChordProgressionOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    requireDistinct(
      input.templates.map((t) => t.id),
      "templates",
    );
    requireDistinct(input.targetKeys, "targetKeys");
    for (const t of input.templates) {
      if (t.chordSymbols.length !== t.romanChords.length)
        simpleError(
          "templates",
          "Chord symbols and reviewed Roman functions must align.",
          "length_mismatch",
        );
      t.romanChords.forEach(roman);
      for (const target of input.targetKeys) evaluate(t, target);
    }
    const random = createGeneratorRandom(input.seed, context);
    const exercises = Array.from({ length: input.count }, () =>
      evaluate(random.pick(input.templates), random.pick(input.targetKeys)),
    );
    return toolSuccess(
      ensureOutput(
        { exercises, randomness: generatorReplay(input.seed, context) },
        outputSchema,
      ),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const cadenceChordProgressionExample = {
  input: {
    templates: [
      {
        id: "authentic",
        sourceKey: "C",
        chordSymbols: ["C", "F", "G7", "C"],
        romanChords: ["I", "IV", "V7", "I"],
        penultimateRootInBass: true,
        finalTonicRootInBass: true,
        finalSopranoOnTonic: true,
      },
    ],
    targetKeys: ["D", "Bb"],
    count: 2,
    seed: 42,
  },
  output: {
    exercises: [
      {
        templateId: "authentic",
        sourceKey: "C",
        targetKey: "D",
        originalChordSymbols: ["C", "F", "G7", "C"],
        romanChords: ["I", "IV", "V7", "I"],
        signedDiatonicSteps: 1,
        signedChromaticSemitones: 2,
        transposedChordSymbols: ["D", "G", "A7", "D"],
        cadenceLabel: "perfect-authentic",
        recognizedFunctionalCadence: true,
      },
      {
        templateId: "authentic",
        sourceKey: "C",
        targetKey: "Bb",
        originalChordSymbols: ["C", "F", "G7", "C"],
        romanChords: ["I", "IV", "V7", "I"],
        signedDiatonicSteps: 6,
        signedChromaticSemitones: 10,
        transposedChordSymbols: ["Bb", "Eb", "F7", "Bb"],
        cadenceLabel: "perfect-authentic",
        recognizedFunctionalCadence: true,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  CadenceChordProgressionInput,
  CadenceChordProgressionOutput
>;
export const cadenceChordProgressionTool = createModelDefinition<
  CadenceChordProgressionInput,
  CadenceChordProgressionOutput
>({
  id: "random/cadence-chord-progression",
  title: "Random Cadence Chord Progression Generator",
  description:
    "Sample supplied reviewed progression templates into target keys with delegated spelling-aware transposition and elementary cadence labels.",
  inputSchema,
  outputSchema,
  execute: calculateCadenceChordProgression,
});
export const runCadenceChordProgression = cadenceChordProgressionTool.execute;
export default cadenceChordProgressionTool;
