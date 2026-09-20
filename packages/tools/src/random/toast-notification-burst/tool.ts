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
  text,
  label,
  id,
  bool,
  number,
  integer,
  list,
  object,
  enumeration,
  nullable,
  markup,
  parsedSchema,
  choose,
  preview,
  distinct,
  work,
  finite,
  escape,
  parse,
  finish,
} from "../m500b-ui-accessibility-support.js";

export type Input = {
  readonly messages: readonly string[];
  readonly eventCount: number;
  readonly maximumGap: number;
  readonly duration: number;
  readonly duplicateProbability: number;
  readonly seed?: number;
};
export type Output = {
  readonly events: readonly {
    readonly id: string;
    readonly message: string;
    readonly preview: string;
    readonly arrival: number;
    readonly expires: number;
    readonly priority: "normal" | "urgent";
    readonly dismissedAt: number | null;
    readonly duplicate: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    messages: list(label),
    eventCount: integer(1, 32),
    maximumGap: integer(),
    duration: integer(1),
    duplicateProbability: { type: "number", minimum: 0, maximum: 1 },
    seed: generatorSeedSchema,
  },
  ["messages", "eventCount", "maximumGap", "duration", "duplicateProbability"],
);
export const outputSchema = object({
  events: list(
    object({
      id,
      message: label,
      preview: text,
      arrival: integer(),
      expires: integer(),
      priority: enumeration(["normal", "urgent"]),
      dismissedAt: nullable(integer()),
      duplicate: bool,
    }),
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateToastNotificationBurst = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (
      BigInt(input.maximumGap) * BigInt(input.eventCount) +
        BigInt(input.duration) >
      BigInt(Number.MAX_SAFE_INTEGER)
    )
      return simpleError(
        "maximumGap",
        "Arrival and lifetime arithmetic must remain safe integers.",
        "unsafe_timeline",
      );
    if (input.duration === Number.MAX_SAFE_INTEGER)
      return simpleError(
        "duration",
        "The inclusive dismissal range must fit the integer sampler.",
        "unsafe_sampling_range",
      );
    const random = createGeneratorRandom(input.seed, context);
    let arrival = 0;
    const events: Output["events"][number][] = [];
    for (let i = 0; i < input.eventCount; i++) {
      arrival += random.integer(0, input.maximumGap);
      const message = choose(input.messages, random),
        priority = choose(["normal", "urgent"] as const, random),
        duplicateDraw = random.unit(),
        duplicate = i > 0 && duplicateDraw < input.duplicateProbability;
      const previous = events[i - 1];
      if (duplicate && !previous) throw new Error("Missing previous toast");
      const id = duplicate && previous ? previous.id : "toast-" + i,
        dismissed = random.unit() < 0.5,
        dismissedAt = dismissed
          ? arrival + random.integer(0, input.duration)
          : null;
      events.push({
        id,
        message,
        preview: preview(message, 32),
        arrival,
        expires: arrival + input.duration,
        priority,
        dismissedAt,
        duplicate,
      });
    }
    return toolSuccess(
      finish({ events, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const toastNotificationBurstExample = {
  input: {
    messages: ["Saved", "Queued"],
    eventCount: 2,
    maximumGap: 0,
    duration: 4,
    duplicateProbability: 1,
    seed: 42,
  },
  output: {
    events: [
      {
        id: "toast-0",
        message: "Saved",
        preview: "Saved",
        arrival: 0,
        expires: 4,
        priority: "urgent",
        dismissedAt: 2,
        duplicate: false,
      },
      {
        id: "toast-0",
        message: "Queued",
        preview: "Queued",
        arrival: 0,
        expires: 4,
        priority: "urgent",
        dismissedAt: 4,
        duplicate: true,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const toastNotificationBurstTool = createModelDefinition<Input, Output>({
  id: "random/toast-notification-burst",
  title: "Random Toast Notification Burst Fixture Generator",
  description:
    "Construct bounded synthetic toast arrivals with lifetime, priority, dismissal and explicit duplicate-ID controls; notification rendering remains app-owned.",
  inputSchema,
  outputSchema,
  execute: calculateToastNotificationBurst,
});
export const runToastNotificationBurst = toastNotificationBurstTool.execute;
export default toastNotificationBurstTool;
