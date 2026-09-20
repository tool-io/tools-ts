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
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";

export type MaxSatInstanceInput = {
  readonly variableCount: number;
  readonly clauseCount: number;
  readonly literalsPerClause: number;
  readonly seed?: number;
};
export type MaxSatInstanceOutput = {
  readonly variableCount: number;
  readonly clauses: readonly (readonly number[])[];
  readonly assignment: readonly boolean[];
  readonly satisfiedClauses: readonly number[];
  readonly score: number;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    variableCount: { type: "integer", minimum: 1, maximum: 64 },
    clauseCount: { type: "integer", minimum: 1, maximum: 256 },
    literalsPerClause: { type: "integer", minimum: 1, maximum: 64 },
    seed: generatorSeedSchema,
  },
  required: ["variableCount", "clauseCount", "literalsPerClause"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    variableCount: { type: "integer", minimum: 1, maximum: 64 },
    clauses: {
      type: "array",
      minItems: 1,
      maxItems: 256,
      items: {
        type: "array",
        minItems: 1,
        maxItems: 64,
        items: { type: "integer", minimum: -64, maximum: 64 },
      },
    },
    assignment: {
      type: "array",
      minItems: 1,
      maxItems: 64,
      items: { type: "boolean" },
    },
    satisfiedClauses: {
      type: "array",
      maxItems: 256,
      items: { type: "integer", minimum: 0, maximum: 255 },
    },
    score: { type: "integer", minimum: 0, maximum: 256 },
    randomness: generatorReplaySchema,
  },
  required: [
    "variableCount",
    "clauses",
    "assignment",
    "satisfiedClauses",
    "score",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is MaxSatInstanceInput =>
  matchesModelInput(input, inputSchema);
export const calculateMaxSatInstance = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<MaxSatInstanceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.literalsPerClause > input.variableCount)
      simpleError(
        "literalsPerClause",
        "A clause cannot repeat a variable.",
        "infeasible_clause_width",
      );
    if (input.clauseCount * input.literalsPerClause > 8192)
      simpleError(
        "clauseCount",
        "At most 8,192 literals may be retained.",
        "resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context),
      variables = Array.from({ length: input.variableCount }, (_, i) => i + 1);
    const clauses = Array.from({ length: input.clauseCount }, () =>
      random
        .shuffle(variables)
        .slice(0, input.literalsPerClause)
        .map((v) => (random.unit() < 0.5 ? -v : v)),
    );
    const assignment = variables.map(() => random.unit() < 0.5);
    const satisfiedClauses = clauses.flatMap((clause, index) =>
      clause.some(
        (literal) => assignment[Math.abs(literal) - 1] === literal > 0,
      )
        ? [index]
        : [],
    );
    return toolSuccess({
      variableCount: input.variableCount,
      clauses,
      assignment,
      satisfiedClauses,
      score: satisfiedClauses.length,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const maxSatInstanceExample = {
  input: {
    variableCount: 3,
    clauseCount: 4,
    literalsPerClause: 2,
    seed: 42,
  },
  output: {
    variableCount: 3,
    clauses: [
      [3, 1],
      [-3, 2],
      [-2, 1],
      [-2, 1],
    ],
    assignment: [false, false, true],
    satisfiedClauses: [0, 2, 3],
    score: 3,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<MaxSatInstanceInput, MaxSatInstanceOutput>;
export const maxSatInstanceTool = createModelDefinition<
  MaxSatInstanceInput,
  MaxSatInstanceOutput
>({
  id: "random/max-sat-instance",
  title: "Random Unweighted Max-SAT Instance Generator",
  description:
    "Generate fixed-width signed CNF clauses with distinct variables per clause, plus a sampled Boolean assignment and its satisfied-clause score; clauses may repeat and satisfiability or optimality is not promised.",
  inputSchema,
  outputSchema,
  execute: calculateMaxSatInstance,
});
export const runMaxSatInstance = maxSatInstanceTool.execute;
export default maxSatInstanceTool;
