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
import { calculateStatusCategory } from "../../http/status-category/tool.js";
import { runSubtractTwoNumbers } from "../../arithmetic/subtract-two-numbers/tool.js";
import { calculateFormatDuration } from "../../format/duration/tool.js";
import {
  mocksArray,
  mocksObject,
  mocksLabel,
  mocksInteger,
  mocksText,
  mocksBoolean,
  mocksDistinct,
  mocksPick,
  mocksSafe,
  mocksCore,
  mocksFinish,
} from "../m250-parser-mocks-support.js";
export type WebhookRetryTraceInput = {
  readonly deliveryId: string;
  readonly statuses: readonly number[];
  readonly retryStatusCodes: readonly number[];
  readonly maximumAttempts: number;
  readonly startMilliseconds: number;
  readonly baseDelayMilliseconds: number;
  readonly backoffFactor: number;
  readonly maximumDelayMilliseconds: number;
  readonly jitterMilliseconds: number;
  readonly seed?: number;
};
export type WebhookRetryTraceOutput = {
  readonly attempts: readonly {
    readonly deliveryId: string;
    readonly attemptId: string;
    readonly attempt: number;
    readonly statusCode: number;
    readonly category: string;
    readonly timestampMilliseconds: number;
    readonly elapsedMilliseconds: number;
    readonly elapsedFormatted: string;
    readonly retry: {
      readonly scheduled: boolean;
      readonly baseMilliseconds: number;
      readonly jitterMilliseconds: number;
      readonly waitMilliseconds: number;
    };
  }[];
  readonly termination: "success" | "nonretryable" | "exhausted";
  readonly randomness: GeneratorReplay;
};
const nonnegative = { type: "integer", minimum: 0 } as const,
  statusSchema = { type: "integer", minimum: 100, maximum: 599 } as const;
export const inputSchema = mocksObject(
  {
    deliveryId: { ...mocksLabel, maxLength: 96 },
    statuses: mocksArray(statusSchema, 128, 1),
    retryStatusCodes: mocksArray(statusSchema, 500),
    maximumAttempts: { type: "integer", minimum: 1, maximum: 128 },
    startMilliseconds: mocksInteger,
    baseDelayMilliseconds: nonnegative,
    backoffFactor: { type: "integer", minimum: 1 },
    maximumDelayMilliseconds: nonnegative,
    jitterMilliseconds: nonnegative,
    seed: generatorSeedSchema,
  },
  [
    "deliveryId",
    "statuses",
    "retryStatusCodes",
    "maximumAttempts",
    "startMilliseconds",
    "baseDelayMilliseconds",
    "backoffFactor",
    "maximumDelayMilliseconds",
    "jitterMilliseconds",
  ],
);
export const outputSchema = mocksObject({
  attempts: mocksArray(
    mocksObject({
      deliveryId: mocksLabel,
      attemptId: mocksLabel,
      attempt: mocksInteger,
      statusCode: statusSchema,
      category: mocksText,
      timestampMilliseconds: mocksInteger,
      elapsedMilliseconds: nonnegative,
      elapsedFormatted: mocksText,
      retry: mocksObject({
        scheduled: mocksBoolean,
        baseMilliseconds: nonnegative,
        jitterMilliseconds: nonnegative,
        waitMilliseconds: nonnegative,
      }),
    }),
    128,
    1,
  ),
  termination: {
    type: "string",
    enum: ["success", "nonretryable", "exhausted"],
  },
  randomness: generatorReplaySchema,
});
const generate = (
  input: WebhookRetryTraceInput,
  random: GeneratorRandom,
): Omit<WebhookRetryTraceOutput, "randomness"> => {
  mocksDistinct(input.retryStatusCodes.map(String), "retryStatusCodes");
  // All arithmetic remains exact integer milliseconds; no provider policy is implied.
  let timestamp = input.startMilliseconds,
    delay = Math.min(
      input.baseDelayMilliseconds,
      input.maximumDelayMilliseconds,
    );
  const attempts: WebhookRetryTraceOutput["attempts"][number][] = [];
  let termination: WebhookRetryTraceOutput["termination"] = "exhausted";
  for (let i = 0; i < input.maximumAttempts; i += 1) {
    const statusCode = mocksPick(input.statuses, random),
      category = calculateStatusCategory({ statusCode }).category;
    const success = statusCode >= 200 && statusCode < 300,
      retryable = input.retryStatusCodes.includes(statusCode);
    const scheduled = !success && retryable && i + 1 < input.maximumAttempts;
    const jitter = scheduled ? random.integer(0, input.jitterMilliseconds) : 0,
      wait = scheduled ? mocksSafe(delay + jitter, "jitterMilliseconds") : 0;
    const elapsedMilliseconds = mocksCore(
      runSubtractTwoNumbers({
        minuend: timestamp,
        subtrahend: input.startMilliseconds,
      }),
      "startMilliseconds",
    ).difference;
    mocksSafe(elapsedMilliseconds, "startMilliseconds");
    const elapsedFormatted = mocksCore(
      calculateFormatDuration({
        seconds: elapsedMilliseconds / 1000,
        style: "compact",
      }),
      "startMilliseconds",
    ).formatted;
    attempts.push({
      deliveryId: input.deliveryId,
      attemptId: input.deliveryId + "/attempt-" + (i + 1),
      attempt: i + 1,
      statusCode,
      category,
      timestampMilliseconds: timestamp,
      elapsedMilliseconds,
      elapsedFormatted,
      retry: {
        scheduled,
        baseMilliseconds: scheduled ? delay : 0,
        jitterMilliseconds: jitter,
        waitMilliseconds: wait,
      },
    });
    if (!scheduled) {
      termination = success
        ? "success"
        : retryable
          ? "exhausted"
          : "nonretryable";
      break;
    }
    timestamp = mocksSafe(timestamp + wait, "startMilliseconds");
    delay =
      delay >= input.maximumDelayMilliseconds / input.backoffFactor
        ? input.maximumDelayMilliseconds
        : mocksSafe(delay * input.backoffFactor, "backoffFactor");
  }
  return { attempts, termination };
};
export const webhookRetryTraceExample = {
  input: {
    deliveryId: "delivery-demo",
    statuses: [500, 502, 204],
    retryStatusCodes: [500, 502],
    maximumAttempts: 4,
    startMilliseconds: 1000,
    baseDelayMilliseconds: 1000,
    backoffFactor: 2,
    maximumDelayMilliseconds: 8000,
    jitterMilliseconds: 100,
    seed: 42,
  },
  output: {
    attempts: [
      {
        deliveryId: "delivery-demo",
        attemptId: "delivery-demo/attempt-1",
        attempt: 1,
        statusCode: 502,
        category: "Server Error",
        timestampMilliseconds: 1000,
        elapsedMilliseconds: 0,
        elapsedFormatted: "0s",
        retry: {
          scheduled: true,
          baseMilliseconds: 1000,
          jitterMilliseconds: 45,
          waitMilliseconds: 1045,
        },
      },
      {
        deliveryId: "delivery-demo",
        attemptId: "delivery-demo/attempt-2",
        attempt: 2,
        statusCode: 204,
        category: "Successful",
        timestampMilliseconds: 2045,
        elapsedMilliseconds: 1045,
        elapsedFormatted: "1s",
        retry: {
          scheduled: false,
          baseMilliseconds: 0,
          jitterMilliseconds: 0,
          waitMilliseconds: 0,
        },
      },
    ],
    termination: "success",
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  WebhookRetryTraceInput,
  WebhookRetryTraceOutput
>;

const isInput = (input: unknown): input is WebhookRetryTraceInput =>
  matchesModelInput(input, inputSchema);
export const calculateWebhookRetryTrace = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<WebhookRetryTraceOutput> => {
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
export const webhookRetryTraceTool = createModelDefinition<
  WebhookRetryTraceInput,
  WebhookRetryTraceOutput
>({
  id: "random/webhook-retry-trace",
  title: "Random Webhook Retry Trace Generator",
  description:
    "Generate synthetic webhook attempts under a supplied capped integer backoff policy with jitter, repeated delivery IDs, and success or nonretryable termination.",
  inputSchema,
  outputSchema,
  execute: calculateWebhookRetryTrace,
});
export const runWebhookRetryTrace = webhookRetryTraceTool.execute;
export default webhookRetryTraceTool;
