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
import { budget as fixtureBudget } from "../m500b-web-json-json.js";
import {
  object,
  array,
  text,
  bounded,
  boolean,
} from "../m500b-web-json-schema.js";
import { pick } from "../m500b-web-json-json.js";
import { calculateFormUrlencodedEncoder } from "../../web/form-urlencoded-encoder/tool.js";
import { calculateFormUrlencodedDecoder } from "../../web/form-urlencoded-decoder/tool.js";
export type FormUrlencodedRoundTripCorpusInput = {
  readonly names: readonly string[];
  readonly values: readonly string[];
  readonly pairCount: number;
  readonly count: number;
  readonly seed?: number;
};
export type FormUrlencodedRoundTripCorpusOutput = {
  readonly cases: readonly {
    readonly names: readonly string[];
    readonly values: readonly string[];
    readonly encoded: string;
    readonly decodedNames: readonly string[];
    readonly decodedValues: readonly string[];
    readonly roundTrip: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    names: array(text, 16, 1),
    values: array(text, 16, 1),
    pairCount: bounded(1, 16),
    count: bounded(1, 32),
    seed: generatorSeedSchema,
  },
  ["names", "values", "pairCount", "count"],
);
export const outputSchema = object({
  cases: array(
    object({
      names: array(text, 16),
      values: array(text, 16),
      encoded: text,
      decodedNames: array(text, 16),
      decodedValues: array(text, 16),
      roundTrip: boolean,
    }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is FormUrlencodedRoundTripCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateFormUrlencodedRoundTripCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<FormUrlencodedRoundTripCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    const maximumName = Math.max(...input.names.map((s) => s.length)),
      maximumValue = Math.max(...input.values.map((s) => s.length)),
      encodedBound = input.pairCount * (12 * (maximumName + maximumValue) + 4);
    if (
      encodedBound > 65536 ||
      input.count *
        (encodedBound +
          6 * input.pairCount * (maximumName + maximumValue) +
          512) >
        900000
    )
      simpleError(
        "pairCount",
        "Form expansion exceeds the bounded output budget.",
        "resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context);
    const cases = Array.from({ length: input.count }, () => {
      const names: string[] = [],
        values: string[] = [];
      for (let i = 0; i < input.pairCount; i++) {
        names.push(pick(input.names, random));
        values.push(pick(input.values, random));
      }
      const { encoded } = calculateFormUrlencodedEncoder({ names, values }),
        decoded = calculateFormUrlencodedDecoder({ encoded });
      return {
        names,
        values,
        encoded,
        decodedNames: decoded.names,
        decodedValues: decoded.values,
        roundTrip:
          JSON.stringify([names, values]) ===
          JSON.stringify([decoded.names, decoded.values]),
      };
    });
    return toolSuccess({
      cases,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const formUrlencodedRoundTripCorpusExample = {
  input: {
    names: ["q"],
    values: ["red apples", "café"],
    pairCount: 2,
    count: 1,
    seed: 42,
  },
  output: {
    cases: [
      {
        names: ["q", "q"],
        values: ["red apples", "café"],
        encoded: "q=red+apples&q=caf%C3%A9",
        decodedNames: ["q", "q"],
        decodedValues: ["red apples", "café"],
        roundTrip: true,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  FormUrlencodedRoundTripCorpusInput,
  FormUrlencodedRoundTripCorpusOutput
>;
export const formUrlencodedRoundTripCorpusTool = createModelDefinition<
  FormUrlencodedRoundTripCorpusInput,
  FormUrlencodedRoundTripCorpusOutput
>({
  id: "random/form-urlencoded-round-trip-corpus",
  title: "Random Form URLencoded Round-Trip Corpus Generator",
  description:
    "Construct ordered form fields from supplied strings and retain exact UTF-8 form encoder and decoder round-trip expectations.",
  inputSchema,
  outputSchema,
  execute: calculateFormUrlencodedRoundTripCorpus,
});
export const runFormUrlencodedRoundTripCorpus =
  formUrlencodedRoundTripCorpusTool.execute;
export default formUrlencodedRoundTripCorpusTool;
