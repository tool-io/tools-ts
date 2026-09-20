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
import { tseitinCnf } from "../../logic/sat-to-cnf/tool.js";

export type GeneratedBooleanOperator = "not" | "and" | "or" | "implies";
export type BooleanFormulaCnfExerciseInput = {
  readonly variableNames: readonly string[];
  readonly operators: readonly GeneratedBooleanOperator[];
  readonly operatorCount: number;
  readonly maximumDepth: number;
  readonly seed?: number;
};
export type BooleanFormulaCnfExerciseOutput = {
  readonly formulaJson: string;
  readonly clauses: readonly (readonly number[])[];
  readonly namedVariables: readonly {
    readonly name: string;
    readonly id: number;
  }[];
  readonly totalVariableCount: number;
  readonly randomness: GeneratorReplay;
};
type GeneratedFormula =
  | { op: "var"; name: string }
  | { op: "not"; arg: GeneratedFormula }
  | { op: "and" | "or"; args: [GeneratedFormula, GeneratedFormula] }
  | { op: "implies"; left: GeneratedFormula; right: GeneratedFormula };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    variableNames: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: {
        type: "string",
        minLength: 1,
        maxLength: 32,
        pattern: "^[A-Za-z_][A-Za-z0-9_]*(?![\\s\\S])",
      },
    },
    operators: {
      type: "array",
      minItems: 1,
      maxItems: 4,
      items: { type: "string", enum: ["not", "and", "or", "implies"] },
    },
    operatorCount: { type: "integer", minimum: 0, maximum: 24 },
    maximumDepth: { type: "integer", minimum: 1, maximum: 12 },
    seed: generatorSeedSchema,
  },
  required: ["variableNames", "operators", "operatorCount", "maximumDepth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    formulaJson: {
      type: "string",
      minLength: 1,
      maxLength: 8192,
      format: "application/json",
    },
    clauses: {
      type: "array",
      minItems: 1,
      maxItems: 145,
      items: {
        type: "array",
        minItems: 1,
        maxItems: 3,
        items: { type: "integer", minimum: -100, maximum: 100 },
      },
    },
    namedVariables: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string", minLength: 1, maxLength: 32 },
          id: { type: "integer", minimum: 1, maximum: 100 },
        },
        required: ["name", "id"],
      },
    },
    totalVariableCount: { type: "integer", minimum: 1, maximum: 100 },
    randomness: generatorReplaySchema,
  },
  required: [
    "formulaJson",
    "clauses",
    "namedVariables",
    "totalVariableCount",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is BooleanFormulaCnfExerciseInput =>
  matchesModelInput(input, inputSchema);
export const calculateBooleanFormulaCnfExercise = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<BooleanFormulaCnfExerciseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (new Set(input.variableNames).size !== input.variableNames.length)
      simpleError(
        "variableNames",
        "Entries must be distinct.",
        "duplicate_entries",
      );
    if (new Set(input.operators).size !== input.operators.length)
      simpleError(
        "operators",
        "Entries must be distinct.",
        "duplicate_entries",
      );
    const binary = input.operators.some((operator) => operator !== "not"),
      capacity = (depth: number): number =>
        Math.min(input.operatorCount, binary ? 2 ** depth - 1 : depth);
    if (input.operatorCount > capacity(input.maximumDepth))
      simpleError(
        "maximumDepth",
        "The chosen operators and depth cannot fit the requested operator count.",
        "infeasible_formula_size",
      );
    const random = createGeneratorRandom(input.seed, context);
    const build = (count: number, depth: number): GeneratedFormula => {
      if (count === 0)
        return { op: "var", name: random.pick(input.variableNames) };
      const childCapacity = capacity(depth - 1),
        available = input.operators.filter(
          (operator) =>
            count - 1 <=
            (operator === "not" ? childCapacity : 2 * childCapacity),
        ),
        op = random.pick(available);
      if (op === "not") return { op, arg: build(count - 1, depth - 1) };
      const leftCount = random.integer(
        Math.max(0, count - 1 - childCapacity),
        Math.min(count - 1, childCapacity),
      );
      const left = build(leftCount, depth - 1),
        right = build(count - 1 - leftCount, depth - 1);
      return op === "implies"
        ? { op, left, right }
        : { op, args: [left, right] };
    };
    const formulaJson = JSON.stringify(
        build(input.operatorCount, input.maximumDepth),
      ),
      cnf = tseitinCnf(formulaJson);
    const namedVariables = Object.entries(cnf.variables).map(([name, id]) => ({
      name,
      id,
    }));
    const totalVariableCount = Math.max(...cnf.clauses.flat().map(Math.abs));
    return toolSuccess({
      formulaJson,
      clauses: cnf.clauses,
      namedVariables,
      totalVariableCount,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const booleanFormulaCnfExerciseExample = {
  input: {
    variableNames: ["a", "b"],
    operators: ["and", "not"],
    operatorCount: 2,
    maximumDepth: 2,
    seed: 42,
  },
  output: {
    formulaJson:
      '{"op":"not","arg":{"op":"and","args":[{"op":"var","name":"b"},{"op":"var","name":"a"}]}}',
    clauses: [[-3, 1], [-3, 2], [3, -1, -2], [-4, -3], [4, 3], [4]],
    namedVariables: [
      {
        name: "b",
        id: 1,
      },
      {
        name: "a",
        id: 2,
      },
    ],
    totalVariableCount: 4,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  BooleanFormulaCnfExerciseInput,
  BooleanFormulaCnfExerciseOutput
>;
export const booleanFormulaCnfExerciseTool = createModelDefinition<
  BooleanFormulaCnfExerciseInput,
  BooleanFormulaCnfExerciseOutput
>({
  id: "random/boolean-formula-cnf-exercise",
  title: "Random Boolean Formula to CNF Exercise Generator",
  description:
    "Generate an exact-operator-count bounded Boolean syntax tree from supplied named variables/operators and delegate Tseitin CNF with named-variable mappings; random choices are conditional on remaining depth capacity, and auxiliary-variable CNF is equisatisfiable rather than the original-variable distributive expansion.",
  inputSchema,
  outputSchema,
  execute: calculateBooleanFormulaCnfExercise,
});
export const runBooleanFormulaCnfExercise =
  booleanFormulaCnfExerciseTool.execute;
export default booleanFormulaCnfExerciseTool;
