import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
} from "../../core/model-definition.js";
import { toolSuccess, type ToolResult } from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import { calculateHalfAdderSumCarryChecker } from "../../logic/half-adder-sum-carry-checker/tool.js";
import { calculateFullAdderMajorityCarryChecker } from "../../logic/full-adder-majority-carry-checker/tool.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  puzzleArray,
  puzzleBoolean,
  puzzleExecutor,
  puzzleFreeze,
  puzzleInteger,
  puzzleObject,
  puzzleUnwrap,
  puzzleValidate,
} from "../m250-puzzles-logic-support.js";
export type BooleanAdderCircuitTraceInput = {
  readonly mode: "half" | "full" | "ripple";
  readonly bitCount: number;
  readonly initialCarry: boolean;
  readonly seed?: number;
};
export type BooleanAdderStep = {
  readonly bitIndex: number;
  readonly a: boolean;
  readonly b: boolean;
  readonly carryIn: boolean;
  readonly sum: boolean;
  readonly carryOut: boolean;
};
export type BooleanAdderCircuitTraceOutput = {
  readonly bitOrder: "least-significant-first";
  readonly steps: readonly BooleanAdderStep[];
  readonly summary: {
    readonly leftValue: number;
    readonly rightValue: number;
    readonly sumValue: number;
    readonly finalCarry: boolean;
    readonly rippleTotal: number | null;
  };
  readonly randomness: GeneratorReplay;
};
export const inputSchema = puzzleObject(
  {
    mode: { type: "string", enum: ["half", "full", "ripple"] },
    bitCount: { type: "integer", minimum: 1, maximum: 32 },
    initialCarry: puzzleBoolean,
    seed: generatorSeedSchema,
  },
  ["mode", "bitCount", "initialCarry"],
);
export const outputSchema = puzzleObject({
  bitOrder: { type: "string", const: "least-significant-first" },
  steps: puzzleArray(
    puzzleObject({
      bitIndex: puzzleInteger,
      a: puzzleBoolean,
      b: puzzleBoolean,
      carryIn: puzzleBoolean,
      sum: puzzleBoolean,
      carryOut: puzzleBoolean,
    }),
    32,
    1,
  ),
  summary: puzzleObject({
    leftValue: puzzleInteger,
    rightValue: puzzleInteger,
    sumValue: puzzleInteger,
    finalCarry: puzzleBoolean,
    rippleTotal: { anyOf: [puzzleInteger, { type: "null" }] },
  }),
  randomness: generatorReplaySchema,
});
export const calculateBooleanAdderCircuitTrace = (
  input: BooleanAdderCircuitTraceInput,
  context?: ToolExecutionContext,
): ToolResult<BooleanAdderCircuitTraceOutput> => {
  try {
    puzzleValidate(input, inputSchema);
    if (input.mode !== "ripple" && input.initialCarry)
      simpleError(
        "initialCarry",
        "Initial carry applies only to ripple mode; use false for independent cells.",
        "unused_initial_carry",
      );
    const random = createGeneratorRandom(input.seed, context);
    let carry = input.initialCarry;
    const steps = Array.from(
      { length: input.bitCount },
      (_, bitIndex): BooleanAdderStep => {
        const a = random.integer(0, 1) === 1,
          b = random.integer(0, 1) === 1,
          carryIn =
            input.mode === "ripple"
              ? carry
              : input.mode === "full"
                ? random.integer(0, 1) === 1
                : false;
        if (input.mode === "half") {
          const core = puzzleUnwrap(
            calculateHalfAdderSumCarryChecker({ a, b }),
          );
          return {
            bitIndex,
            a,
            b,
            carryIn,
            sum: core.sum,
            carryOut: core.carry,
          };
        }
        const core = puzzleUnwrap(
          calculateFullAdderMajorityCarryChecker({ a, b, carryIn }),
        );
        carry = core.carryOut;
        return {
          bitIndex,
          a,
          b,
          carryIn,
          sum: core.sum,
          carryOut: core.carryOut,
        };
      },
    );
    const value = (field: "a" | "b" | "sum"): number =>
        steps.reduce(
          (total, step) => total + Number(step[field]) * 2 ** step.bitIndex,
          0,
        ),
      leftValue = value("a"),
      rightValue = value("b"),
      sumValue = value("sum"),
      finalCarry = steps[steps.length - 1].carryOut,
      rippleTotal =
        input.mode === "ripple"
          ? sumValue + Number(finalCarry) * 2 ** input.bitCount
          : null;
    if (
      rippleTotal !== null &&
      rippleTotal !== leftValue + rightValue + Number(input.initialCarry)
    )
      throw new Error("Ripple carry failed integer conservation.");
    return toolSuccess({
      bitOrder: "least-significant-first",
      steps,
      summary: { leftValue, rightValue, sumValue, finalCarry, rippleTotal },
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const booleanAdderCircuitTraceExample = puzzleFreeze({
  input: { mode: "ripple", bitCount: 4, initialCarry: true, seed: 42 },
  output: {
    bitOrder: "least-significant-first",
    steps: [
      {
        bitIndex: 0,
        a: true,
        b: false,
        carryIn: true,
        sum: false,
        carryOut: true,
      },
      {
        bitIndex: 1,
        a: true,
        b: true,
        carryIn: true,
        sum: true,
        carryOut: true,
      },
      {
        bitIndex: 2,
        a: false,
        b: true,
        carryIn: true,
        sum: false,
        carryOut: true,
      },
      {
        bitIndex: 3,
        a: false,
        b: true,
        carryIn: true,
        sum: false,
        carryOut: true,
      },
    ],
    summary: {
      leftValue: 3,
      rightValue: 14,
      sumValue: 2,
      finalCarry: true,
      rippleTotal: 18,
    },
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  BooleanAdderCircuitTraceInput,
  BooleanAdderCircuitTraceOutput
>);
const isInput = (input: unknown): input is BooleanAdderCircuitTraceInput =>
  matchesModelInput(input, inputSchema);
export const booleanAdderCircuitTraceTool = createModelDefinition<
  BooleanAdderCircuitTraceInput,
  BooleanAdderCircuitTraceOutput
>({
  id: "random/boolean-adder-circuit-trace",
  title: "Random Boolean Adder Circuit Trace Generator",
  description:
    "Generate independent half/full adder cells or an explicit least-significant-first ripple-carry trace with delegated bit answers.",
  inputSchema,
  outputSchema,
  execute: puzzleExecutor(
    isInput,
    inputSchema,
    calculateBooleanAdderCircuitTrace,
  ),
});
export const runBooleanAdderCircuitTrace = booleanAdderCircuitTraceTool.execute;
export default booleanAdderCircuitTraceTool;
