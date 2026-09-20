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
  choice,
  boolean,
  integer,
  nullableText,
} from "../m500b-web-json-schema.js";
import { pick } from "../m500b-web-json-json.js";
import { coreOutput } from "../m500b-web-json-protocol.js";
import {
  calculateSseEventParser,
  type SseEventParserOutput,
} from "../../web/sse-event-parser/tool.js";
export type SseFrame = {
  readonly event: string;
  readonly id: string;
  readonly data: readonly string[];
  readonly retryMs: number;
};
export type SseEventSequenceFixtureInput = {
  readonly frames: readonly SseFrame[];
  readonly count: number;
  readonly newline: "lf" | "crlf";
  readonly terminateLast: boolean;
  readonly seed?: number;
};
export type SseEventSequenceFixtureOutput = {
  readonly frames: readonly SseFrame[];
  readonly stream: string;
  readonly parsed: SseEventParserOutput;
  readonly randomness: GeneratorReplay;
};
const frameSchema = object({
  event: text,
  id: text,
  data: array(text, 8, 1),
  retryMs: bounded(0, 2147483647),
});
export const inputSchema = object(
  {
    frames: array(frameSchema, 16, 1),
    count: bounded(1, 16),
    newline: choice(["lf", "crlf"]),
    terminateLast: boolean,
    seed: generatorSeedSchema,
  },
  ["frames", "count", "newline", "terminateLast"],
);
export const outputSchema = object({
  frames: array(frameSchema, 16, 1),
  stream: text,
  parsed: object({
    events: array(object({ event: text, data: text, id: text }), 16),
    lastEventId: text,
    retryMs: { anyOf: [integer, { type: "null" }] },
  }),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is SseEventSequenceFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateSseEventSequenceFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<SseEventSequenceFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    if (
      input.frames.some(
        (f) =>
          /[\r\n\0]/u.test(f.id) ||
          /[\r\n]/u.test(f.event) ||
          f.data.some((s) => /[\r\n]/u.test(s)),
      )
    )
      simpleError(
        "frames",
        "Use separate data lines and line-free event/ID values.",
        "invalid_frame",
      );
    const random = createGeneratorRandom(input.seed, context),
      frames = Array.from({ length: input.count }, () => {
        const f = pick(input.frames, random);
        return { ...f, data: [...f.data] };
      }),
      nl = input.newline === "lf" ? "\n" : "\r\n";
    const stream = frames
      .map(
        (f, i) =>
          [
            "id: " + f.id,
            "event: " + f.event,
            "retry: " + f.retryMs,
            ...f.data.map((s) => "data: " + s),
          ].join(nl) +
          nl +
          (i < input.count - 1 || input.terminateLast ? nl : ""),
      )
      .join("");
    return toolSuccess({
      frames,
      stream,
      parsed: coreOutput(calculateSseEventParser({ stream })),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const sseEventSequenceFixtureExample = {
  input: {
    frames: [
      { event: "update", id: "7", data: ["first", "second"], retryMs: 1500 },
    ],
    count: 1,
    newline: "lf",
    terminateLast: true,
    seed: 42,
  },
  output: {
    frames: [
      { event: "update", id: "7", data: ["first", "second"], retryMs: 1500 },
    ],
    stream: "id: 7\nevent: update\nretry: 1500\ndata: first\ndata: second\n\n",
    parsed: {
      events: [{ event: "update", data: "first\nsecond", id: "7" }],
      lastEventId: "7",
      retryMs: 1500,
    },
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  SseEventSequenceFixtureInput,
  SseEventSequenceFixtureOutput
>;
export const sseEventSequenceFixtureTool = createModelDefinition<
  SseEventSequenceFixtureInput,
  SseEventSequenceFixtureOutput
>({
  id: "random/sse-event-sequence-fixture",
  title: "Random SSE Event Sequence Fixture Generator",
  description:
    "Serialize supplied multiline SSE frames with explicit newline and final-dispatch controls and delegate event, ID and retry parsing.",
  inputSchema,
  outputSchema,
  execute: calculateSseEventSequenceFixture,
});
export const runSseEventSequenceFixture = sseEventSequenceFixtureTool.execute;
export default sseEventSequenceFixtureTool;
