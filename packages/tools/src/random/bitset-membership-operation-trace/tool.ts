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
import { runUnique } from "../../list/unique/tool.js";
import {
  arraySchema,
  objectSchema,
  countSchema,
  enumSchema,
  booleanSchema,
  distinct,
  coreOutput,
} from "../m500b-csv-algorithms-schemas.js";

type BitOperation = "set" | "clear" | "test";
export type BitsetMembershipOperationTraceInput = {
  readonly universeSize: number;
  readonly wordWidth: 8 | 16 | 32;
  readonly initialMembers: readonly number[];
  readonly operations: readonly BitOperation[];
  readonly eventCount: number;
  readonly seed?: number;
};
type BitEvent = {
  readonly kind: BitOperation;
  readonly index: number;
  readonly wasMember: boolean;
  readonly isMember: boolean;
  readonly words: readonly number[];
};
export type BitsetMembershipOperationTraceOutput = {
  readonly events: readonly BitEvent[];
  readonly finalWords: readonly number[];
  readonly finalMembers: readonly number[];
  readonly randomness: GeneratorReplay;
};
const operationSchema = enumSchema(["set", "clear", "test"]),
  wordsSchema = arraySchema(countSchema(4294967295), 8);
export const inputSchema = objectSchema(
  {
    universeSize: countSchema(64, 1),
    wordWidth: { type: "integer", enum: [8, 16, 32] },
    initialMembers: arraySchema(countSchema(63), 64),
    operations: arraySchema(operationSchema, 3, 1),
    eventCount: countSchema(64, 1),
    seed: generatorSeedSchema,
  },
  ["universeSize", "wordWidth", "initialMembers", "operations", "eventCount"],
);
export const outputSchema = objectSchema({
  events: arraySchema(
    objectSchema({
      kind: operationSchema,
      index: countSchema(63),
      wasMember: booleanSchema,
      isMember: booleanSchema,
      words: wordsSchema,
    }),
    64,
  ),
  finalWords: wordsSchema,
  finalMembers: arraySchema(countSchema(63), 64),
  randomness: generatorReplaySchema,
});
const isInput = (
  input: unknown,
): input is BitsetMembershipOperationTraceInput =>
  matchesModelInput(input, inputSchema);
export const calculateBitsetMembershipOperationTrace = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<BitsetMembershipOperationTraceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.initialMembers, "initialMembers");
    distinct(input.operations, "operations");
    if (input.initialMembers.some((index) => index >= input.universeSize))
      return simpleError(
        "initialMembers",
        "Every initial member must lie in the declared universe.",
        "member_range",
      );
    let bits = input.initialMembers.reduce(
      (mask, index) => mask | (1n << BigInt(index)),
      0n,
    );
    const random = createGeneratorRandom(input.seed, context),
      wordMask = (1n << BigInt(input.wordWidth)) - 1n;
    const words = (): number[] =>
      Array.from(
        { length: Math.ceil(input.universeSize / input.wordWidth) },
        (_, word) =>
          Number((bits >> BigInt(word * input.wordWidth)) & wordMask),
      );
    const events = Array.from({ length: input.eventCount }, (): BitEvent => {
      const kind = random.pick(input.operations),
        index = random.integer(0, input.universeSize - 1),
        bit = 1n << BigInt(index),
        wasMember = (bits & bit) !== 0n;
      if (kind === "set") bits |= bit;
      else if (kind === "clear") bits &= ~bit;
      return {
        kind,
        index,
        wasMember,
        isMember: (bits & bit) !== 0n,
        words: words(),
      };
    });
    const members = Array.from(
      { length: input.universeSize },
      (_, index) => index,
    ).filter((index) => (bits & (1n << BigInt(index))) !== 0n);
    const finalMembers = coreOutput(
      runUnique({ values: members.map(String) }),
    ).values.map(Number);
    return toolSuccess({
      events,
      finalWords: words(),
      finalMembers,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const bitsetMembershipOperationTraceExample = {
  input: {
    universeSize: 10,
    wordWidth: 8,
    initialMembers: [0, 8],
    operations: ["set", "clear", "test"],
    eventCount: 3,
    seed: 42,
  },
  output: {
    events: [
      {
        kind: "clear",
        index: 4,
        wasMember: false,
        isMember: false,
        words: [1, 1],
      },
      {
        kind: "test",
        index: 6,
        wasMember: false,
        isMember: false,
        words: [1, 1],
      },
      {
        kind: "set",
        index: 5,
        wasMember: false,
        isMember: true,
        words: [33, 1],
      },
    ],
    finalWords: [33, 1],
    finalMembers: [0, 5, 8],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  BitsetMembershipOperationTraceInput,
  BitsetMembershipOperationTraceOutput
>;
export const bitsetMembershipOperationTraceTool = createModelDefinition<
  BitsetMembershipOperationTraceInput,
  BitsetMembershipOperationTraceOutput
>({
  id: "random/bitset-membership-operation-trace",
  title: "Random Bitset Membership Operation Trace Generator",
  description:
    "Generate bounded set, clear and test operations with exact unsigned words stored in increasing word order and least-significant-bit member positions, using BigInt to avoid signed 32-bit truncation.",
  inputSchema,
  outputSchema,
  execute: calculateBitsetMembershipOperationTrace,
});
export const runBitsetMembershipOperationTrace =
  bitsetMembershipOperationTraceTool.execute;
export default bitsetMembershipOperationTraceTool;
