import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
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
import { calculateLevenshtein } from "../../distance/levenshtein/tool.js";
import {
  arraySchema,
  objectSchema,
  countSchema,
  booleanSchema,
  enumSchema,
  distinct,
} from "../m500b-csv-algorithms-schemas.js";

type EditKind = "insert" | "delete" | "substitute";
export type EditScriptReconstructionChallengeInput = {
  readonly source: string;
  readonly alphabet: readonly string[];
  readonly operations: readonly EditKind[];
  readonly editCount: number;
  readonly seed?: number;
};
type EditStep = {
  readonly kind: EditKind;
  readonly index: number;
  readonly before: string;
  readonly after: string;
  readonly applied: boolean;
};
export type EditScriptReconstructionChallengeOutput = {
  readonly source: string;
  readonly target: string;
  readonly edits: readonly EditStep[];
  readonly minimumDistance: number;
  readonly randomness: GeneratorReplay;
};
const operationSchema = enumSchema(["insert", "delete", "substitute"]),
  characterSchema = { type: "string", maxLength: 2 } as const;
export const inputSchema = objectSchema(
  {
    source: { type: "string", maxLength: 64 },
    alphabet: arraySchema({ ...characterSchema, minLength: 1 }, 8, 1),
    operations: arraySchema(operationSchema, 3, 1),
    editCount: countSchema(8, 1),
    seed: generatorSeedSchema,
  },
  ["source", "alphabet", "operations", "editCount"],
);
export const outputSchema = objectSchema({
  source: { type: "string", maxLength: 64 },
  target: { type: "string", maxLength: 80 },
  edits: arraySchema(
    objectSchema({
      kind: operationSchema,
      index: countSchema(40),
      before: characterSchema,
      after: characterSchema,
      applied: booleanSchema,
    }),
    8,
  ),
  minimumDistance: countSchema(40),
  randomness: generatorReplaySchema,
});
const isInput = (
  input: unknown,
): input is EditScriptReconstructionChallengeInput =>
  matchesModelInput(input, inputSchema);
export const calculateEditScriptReconstructionChallenge = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<EditScriptReconstructionChallengeOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.alphabet, "alphabet");
    distinct(input.operations, "operations");
    if (Array.from(input.source).length > 32)
      return simpleError(
        "source",
        "Source text is limited to 32 Unicode code points.",
        "resource_limit",
      );
    if (input.alphabet.some((character) => Array.from(character).length !== 1))
      return simpleError(
        "alphabet",
        "Each alphabet entry must be one Unicode code point.",
        "invalid_character",
      );
    const random = createGeneratorRandom(input.seed, context),
      text = Array.from(input.source);
    const edits = Array.from({ length: input.editCount }, (): EditStep => {
      const kind = random.pick(input.operations);
      if (kind !== "insert" && text.length === 0)
        return { kind, index: 0, before: "", after: "", applied: false };
      const index = random.integer(
          0,
          kind === "insert" ? text.length : text.length - 1,
        ),
        before = kind === "insert" ? "" : text[index];
      if (before === undefined)
        throw new Error("Selected edit code point missing.");
      const after = kind === "delete" ? "" : random.pick(input.alphabet);
      text.splice(
        index,
        kind === "insert" ? 0 : 1,
        ...(kind === "delete" ? [] : [after]),
      );
      return { kind, index, before, after, applied: true };
    });
    const target = text.join("");
    return toolSuccess({
      source: input.source,
      target,
      edits,
      minimumDistance: calculateLevenshtein({ a: input.source, b: target })
        .distance,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const editScriptReconstructionChallengeExample = {
  input: {
    source: "cat",
    alphabet: ["o", "s"],
    operations: ["insert", "delete", "substitute"],
    editCount: 2,
    seed: 42,
  },
  output: {
    source: "cat",
    target: "co",
    edits: [
      { kind: "delete", index: 1, before: "a", after: "", applied: true },
      { kind: "substitute", index: 1, before: "t", after: "o", applied: true },
    ],
    minimumDistance: 2,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  EditScriptReconstructionChallengeInput,
  EditScriptReconstructionChallengeOutput
>;
export const editScriptReconstructionChallengeTool = createModelDefinition<
  EditScriptReconstructionChallengeInput,
  EditScriptReconstructionChallengeOutput
>({
  id: "random/edit-script-reconstruction-challenge",
  title: "Random Edit Script Reconstruction Challenge Generator",
  description:
    "Generate and replay bounded Unicode code-point edit attempts with explicit empty-text no-op controls, retaining the target and a separately delegated minimum edit distance; the planted script need not be minimum.",
  inputSchema,
  outputSchema,
  execute: calculateEditScriptReconstructionChallenge,
});
export const runEditScriptReconstructionChallenge =
  editScriptReconstructionChallengeTool.execute;
export default editScriptReconstructionChallengeTool;
