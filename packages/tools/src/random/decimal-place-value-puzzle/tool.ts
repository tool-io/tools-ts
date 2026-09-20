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
import { runDivmod } from "../../arithmetic/divmod/tool.js";

export type DecimalPlaceValuePuzzleInput = {
  readonly integerDigits: number;
  readonly fractionalDigits: number;
  readonly seed?: number;
};
export type DecimalPlaceValuePuzzleOutput = {
  readonly decimal: string;
  readonly digitIndex: number;
  readonly digit: number;
  readonly power: number;
  readonly placeValue: string;
  readonly digits: readonly number[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    integerDigits: { type: "integer", minimum: 1, maximum: 12 },
    fractionalDigits: { type: "integer", minimum: 0, maximum: 11 },
    seed: generatorSeedSchema,
  },
  ["integerDigits", "fractionalDigits"],
);
export const outputSchema = object({
  decimal: { type: "string", minLength: 1, maxLength: 13 },
  digitIndex: integer,
  digit: integer,
  power: integer,
  placeValue: { type: "string" },
  digits: array(integer, 12, 1),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is DecimalPlaceValuePuzzleInput =>
  matchesModelInput(value, inputSchema);
export const calculateDecimalPlaceValuePuzzle = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<DecimalPlaceValuePuzzleOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    if (input.integerDigits + input.fractionalDigits > 12)
      simpleError(
        "fractionalDigits",
        "At most twelve total digits may be materialized.",
        "resource_limit_exceeded",
      );
    const digits = Array.from(
        { length: input.integerDigits + input.fractionalDigits },
        (_, i) => random.integer(i === 0 ? 1 : 0, 9),
      ),
      digitIndex = random.integer(0, digits.length - 1),
      digit = digits[digitIndex],
      power = input.integerDigits - digitIndex - 1;
    const parts = core(runDivmod({ dividend: digit, divisor: 10 }));
    if (parts.remainder !== digit) throw new Error("Digit divmod mismatch");
    const decimal =
        digits.slice(0, input.integerDigits).join("") +
        (input.fractionalDigits
          ? "." + digits.slice(input.integerDigits).join("")
          : ""),
      placeValue =
        power >= 0
          ? String(digit) + "0".repeat(power)
          : "0." + "0".repeat(-power - 1) + digit;
    const result = { decimal, digitIndex, digit, power, placeValue, digits };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const decimalPlaceValuePuzzleExample = {
  input: { integerDigits: 2, fractionalDigits: 2, seed: 42 },
  output: {
    decimal: "64.86",
    digitIndex: 0,
    digit: 6,
    power: 1,
    placeValue: "60",
    digits: [6, 4, 8, 6],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  DecimalPlaceValuePuzzleInput,
  DecimalPlaceValuePuzzleOutput
>;
export const decimalPlaceValuePuzzleTool = createModelDefinition<
  DecimalPlaceValuePuzzleInput,
  DecimalPlaceValuePuzzleOutput
>({
  id: "random/decimal-place-value-puzzle",
  title: "Random Decimal Place Value Puzzle Generator",
  description:
    "Generate decimal digit-position prompts with exact base-ten string answers, including trailing fractional zeros.",
  inputSchema,
  outputSchema,
  execute: calculateDecimalPlaceValuePuzzle,
});
export const runDecimalPlaceValuePuzzle = decimalPlaceValuePuzzleTool.execute;
export default decimalPlaceValuePuzzleTool;
