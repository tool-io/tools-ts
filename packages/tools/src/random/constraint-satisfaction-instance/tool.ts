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
import { possibleSimpleEdges } from "../graph-instance-construction.js";

export type ConstraintSatisfactionInstanceInput = {
  readonly variableCount: number;
  readonly domainSize: number;
  readonly constraintCount: number;
  readonly allowedTupleProbability: number;
  readonly seed?: number;
};
export type ConstraintSatisfactionInstanceOutput = {
  readonly variables: readonly number[];
  readonly domain: readonly number[];
  readonly constraints: readonly {
    readonly variables: readonly [number, number];
    readonly allowedTuples: readonly (readonly [number, number])[];
  }[];
  readonly satisfyingAssignment: readonly number[];
  readonly randomness: GeneratorReplay;
};
const pair = {
  type: "array",
  minItems: 2,
  maxItems: 2,
  items: { type: "integer", minimum: 0, maximum: 31 },
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    variableCount: { type: "integer", minimum: 2, maximum: 32 },
    domainSize: { type: "integer", minimum: 1, maximum: 16 },
    constraintCount: { type: "integer", minimum: 0, maximum: 128 },
    allowedTupleProbability: { type: "number", minimum: 0, maximum: 1 },
    seed: generatorSeedSchema,
  },
  required: [
    "variableCount",
    "domainSize",
    "constraintCount",
    "allowedTupleProbability",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    variables: {
      type: "array",
      minItems: 2,
      maxItems: 32,
      items: { type: "integer", minimum: 0, maximum: 31 },
    },
    domain: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: { type: "integer", minimum: 0, maximum: 15 },
    },
    constraints: {
      type: "array",
      maxItems: 128,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          variables: pair,
          allowedTuples: {
            type: "array",
            minItems: 1,
            maxItems: 256,
            items: pair,
          },
        },
        required: ["variables", "allowedTuples"],
      },
    },
    satisfyingAssignment: {
      type: "array",
      minItems: 2,
      maxItems: 32,
      items: { type: "integer", minimum: 0, maximum: 15 },
    },
    randomness: generatorReplaySchema,
  },
  required: [
    "variables",
    "domain",
    "constraints",
    "satisfyingAssignment",
    "randomness",
  ],
} as const;

const isInput = (
  input: unknown,
): input is ConstraintSatisfactionInstanceInput =>
  matchesModelInput(input, inputSchema);
export const calculateConstraintSatisfactionInstance = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ConstraintSatisfactionInstanceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const pairs = possibleSimpleEdges(input.variableCount);
    if (input.constraintCount > pairs.length)
      simpleError(
        "constraintCount",
        "Each constraint needs a distinct variable pair.",
        "infeasible_constraint_count",
      );
    if (input.constraintCount * input.domainSize ** 2 > 8192)
      simpleError(
        "constraintCount",
        "At most 8,192 candidate tuples are supported.",
        "resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context);
    const variables = Array.from({ length: input.variableCount }, (_, i) => i),
      domain = Array.from({ length: input.domainSize }, (_, i) => i);
    const satisfyingAssignment = variables.map(() =>
      random.integer(0, input.domainSize - 1),
    );
    const constraints = random
      .shuffle(pairs)
      .slice(0, input.constraintCount)
      .map(([a, b]) => {
        const allowedTuples: [number, number][] = [];
        for (const x of domain)
          for (const y of domain)
            if (
              (x === satisfyingAssignment[a] &&
                y === satisfyingAssignment[b]) ||
              random.unit() < input.allowedTupleProbability
            )
              allowedTuples.push([x, y]);
        return { variables: [a, b] as const, allowedTuples };
      });
    return toolSuccess({
      variables,
      domain,
      constraints,
      satisfyingAssignment,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const constraintSatisfactionInstanceExample = {
  input: {
    variableCount: 4,
    domainSize: 3,
    constraintCount: 3,
    allowedTupleProbability: 0.2,
    seed: 42,
  },
  output: {
    variables: [0, 1, 2, 3],
    domain: [0, 1, 2],
    constraints: [
      {
        variables: [0, 1],
        allowedTuples: [
          [1, 1],
          [2, 0],
        ],
      },
      {
        variables: [1, 3],
        allowedTuples: [
          [0, 1],
          [1, 1],
          [1, 2],
          [2, 1],
        ],
      },
      {
        variables: [1, 2],
        allowedTuples: [
          [0, 0],
          [0, 1],
          [1, 1],
          [1, 2],
          [2, 0],
        ],
      },
    ],
    satisfyingAssignment: [1, 1, 2, 2],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  ConstraintSatisfactionInstanceInput,
  ConstraintSatisfactionInstanceOutput
>;
export const constraintSatisfactionInstanceTool = createModelDefinition<
  ConstraintSatisfactionInstanceInput,
  ConstraintSatisfactionInstanceOutput
>({
  id: "random/constraint-satisfaction-instance",
  title: "Random Binary Constraint Satisfaction Instance Generator",
  description:
    "Generate a finite-domain binary extensional CSP with distinct variable pairs and a planted satisfying assignment; other tuples are independently included, without uniqueness or hardness claims.",
  inputSchema,
  outputSchema,
  execute: calculateConstraintSatisfactionInstance,
});
export const runConstraintSatisfactionInstance =
  constraintSatisfactionInstanceTool.execute;
export default constraintSatisfactionInstanceTool;
