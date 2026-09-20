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
import {
  object,
  array,
  integer,
  number,
  label,
  bool,
  core,
  finite,
  safe,
  distinct,
  sum,
  finish,
} from "../m500b-charts-math-graphs-support.js";
import { calculateModularInverse } from "../../math/modular-inverse/tool.js";

export type ModularInversePracticeSetInput = {
  readonly count: number;
  readonly maximumValue: number;
  readonly maximumModulus: number;
  readonly seed?: number;
};
export type ModularInversePracticeSetOutput = {
  readonly cards: readonly {
    readonly value: number;
    readonly modulus: number;
    readonly inverse: string | null;
    readonly invertible: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    count: { type: "integer", minimum: 1, maximum: 32 },
    maximumValue: { type: "integer", minimum: 0, maximum: 1000000 },
    maximumModulus: { type: "integer", minimum: 2, maximum: 1000000 },
    seed: generatorSeedSchema,
  },
  ["count", "maximumValue", "maximumModulus"],
);
export const outputSchema = object({
  cards: array(
    object({
      value: integer,
      modulus: integer,
      inverse: { anyOf: [{ type: "string" }, { type: "null" }] },
      invertible: bool,
    }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is ModularInversePracticeSetInput =>
  matchesModelInput(value, inputSchema);
export const calculateModularInversePracticeSet = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ModularInversePracticeSetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    const cards = Array.from({ length: input.count }, () => {
      const value = random.integer(0, input.maximumValue),
        modulus = random.integer(2, input.maximumModulus),
        answer = calculateModularInverse({
          value: String(value),
          modulus: String(modulus),
        });
      if (answer.ok)
        return {
          value,
          modulus,
          inverse: answer.output.inverse,
          invertible: true,
        };
      if (answer.error.issues.some((i) => i.code === "not_invertible"))
        return { value, modulus, inverse: null, invertible: false };
      throw new Error("Bounded modular pair was unexpectedly rejected");
    });
    const result = { cards };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const modularInversePracticeSetExample = {
  input: { count: 2, maximumValue: 12, maximumModulus: 10, seed: 42 },
  output: {
    cards: [
      { value: 7, modulus: 6, inverse: "1", invertible: true },
      { value: 11, modulus: 8, inverse: "3", invertible: true },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  ModularInversePracticeSetInput,
  ModularInversePracticeSetOutput
>;
export const modularInversePracticeSetTool = createModelDefinition<
  ModularInversePracticeSetInput,
  ModularInversePracticeSetOutput
>({
  id: "random/modular-inverse-practice-set",
  title: "Random Modular Inverse Practice Set Generator",
  description:
    "Generate bounded integer/modulus practice pairs and delegate exact modular inverses or retain documented noninvertibility answers.",
  inputSchema,
  outputSchema,
  execute: calculateModularInversePracticeSet,
});
export const runModularInversePracticeSet =
  modularInversePracticeSetTool.execute;
export default modularInversePracticeSetTool;
