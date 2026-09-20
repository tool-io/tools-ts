import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import { invalidInput, type ToolResult } from "../../core/result.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorRandom,
  type GeneratorReplay,
} from "../generator-random.js";
import { runTextToBytes } from "../../convert/text-to-bytes/tool.js";
import { runBytesToText } from "../../convert/bytes-to-text/tool.js";
import { runTextScript } from "../../convert/text-to-unicode-code-points/tool.js";
import { base64ToBytes } from "../../core/encoding.js";
import {
  mocksArray,
  mocksObject,
  mocksText,
  mocksInteger,
  mocksCount,
  mocksBoolean,
  mocksPick,
  mocksCore,
  mocksFinish,
} from "../m250-parser-mocks-support.js";
export type UnicodeByteRoundTripCorpusInput = {
  readonly texts: readonly string[];
  readonly byteControls: readonly string[];
  readonly count: number;
  readonly seed?: number;
};
export type UnicodeByteRoundTripCorpusOutput = {
  readonly cases: readonly {
    readonly text: string;
    readonly bytes: string;
    readonly codePoints: string;
    readonly codePointCount: number;
    readonly codeUnitCount: number;
    readonly byteCount: number;
    readonly decoded: string;
    readonly identical: boolean;
  }[];
  readonly controls: readonly {
    readonly bytes: string;
    readonly result: ToolResult<{ readonly text: string }>;
  }[];
  readonly randomness: GeneratorReplay;
};
const issueSchema = mocksObject({
  code: mocksText,
  field: mocksText,
  message: mocksText,
});
const decodeResultSchema = {
  anyOf: [
    mocksObject({
      ok: { type: "boolean", const: true },
      output: mocksObject({ text: mocksText }),
    }),
    mocksObject({
      ok: { type: "boolean", const: false },
      error: mocksObject({
        code: { type: "string", const: "invalid_input" },
        issues: mocksArray(issueSchema),
      }),
    }),
  ],
} as const;
export const inputSchema = mocksObject(
  {
    texts: mocksArray(mocksText, 128, 1),
    byteControls: mocksArray(mocksText, 32),
    count: mocksCount,
    seed: generatorSeedSchema,
  },
  ["texts", "byteControls", "count"],
);
export const outputSchema = mocksObject({
  cases: mocksArray(
    mocksObject({
      text: mocksText,
      bytes: { type: "string" },
      codePoints: { type: "string" },
      codePointCount: mocksInteger,
      codeUnitCount: mocksInteger,
      byteCount: mocksInteger,
      decoded: mocksText,
      identical: mocksBoolean,
    }),
    128,
    1,
  ),
  controls: mocksArray(
    mocksObject({ bytes: mocksText, result: decodeResultSchema }),
    32,
  ),
  randomness: generatorReplaySchema,
});
const generate = (
  input: UnicodeByteRoundTripCorpusInput,
  random: GeneratorRandom,
): Omit<UnicodeByteRoundTripCorpusOutput, "randomness"> => {
  const cases = Array.from({ length: input.count }, () => {
    const text = mocksPick(input.texts, random),
      bytes = mocksCore(runTextToBytes({ text }), "texts").bytes;
    const decoded = mocksCore(runBytesToText({ bytes }), "texts").text;
    const codePoints = mocksCore(
      runTextScript({ text }),
      "texts",
    ).convertedText;
    return {
      text,
      bytes,
      codePoints,
      codePointCount: Array.from(text).length,
      codeUnitCount: text.length,
      byteCount: base64ToBytes(bytes).length,
      decoded,
      identical: decoded === text,
    };
  });
  const controls = input.byteControls.map((bytes) => {
    const result = runBytesToText({ bytes });
    if (
      !result.ok &&
      result.error.issues.some((issue) => issue.code === "calculation_failed")
    )
      throw new Error("Unexpected byte decoder failure.");
    return { bytes, result };
  });
  return { cases, controls };
};
export const unicodeByteRoundTripCorpusExample = {
  input: { texts: ["Aé", "🌙"], byteControls: ["QQ=="], count: 2, seed: 42 },
  output: {
    cases: [
      {
        text: "🌙",
        bytes: "8J+MmQ==",
        codePoints: "U+1F319",
        codePointCount: 1,
        codeUnitCount: 2,
        byteCount: 4,
        decoded: "🌙",
        identical: true,
      },
      {
        text: "Aé",
        bytes: "QcOp",
        codePoints: "U+0041 U+00E9",
        codePointCount: 2,
        codeUnitCount: 2,
        byteCount: 3,
        decoded: "Aé",
        identical: true,
      },
    ],
    controls: [{ bytes: "QQ==", result: { ok: true, output: { text: "A" } } }],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  UnicodeByteRoundTripCorpusInput,
  UnicodeByteRoundTripCorpusOutput
>;

const isInput = (input: unknown): input is UnicodeByteRoundTripCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateUnicodeByteRoundTripCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<UnicodeByteRoundTripCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    return mocksFinish(
      {
        ...generate(input, random),
        randomness: generatorReplay(input.seed, context),
      },
      outputSchema,
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const unicodeByteRoundTripCorpusTool = createModelDefinition<
  UnicodeByteRoundTripCorpusInput,
  UnicodeByteRoundTripCorpusOutput
>({
  id: "random/unicode-byte-round-trip-corpus",
  title: "Random Unicode Byte Round-Trip Corpus Generator",
  description:
    "Sample supplied Unicode strings into UTF-8 round trips and supplied byte controls while distinguishing bytes, UTF-16 units, and code points.",
  inputSchema,
  outputSchema,
  execute: calculateUnicodeByteRoundTripCorpus,
});
export const runUnicodeByteRoundTripCorpus =
  unicodeByteRoundTripCorpusTool.execute;
export default unicodeByteRoundTripCorpusTool;
