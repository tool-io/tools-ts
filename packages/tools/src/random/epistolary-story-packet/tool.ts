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
import { calculateWordWrap } from "../../text/word-wrap/tool.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  snArray,
  snBoundOutput,
  snDistinct,
  snId,
  snInteger,
  snObject,
  snPick,
  snTemplate,
  snText,
} from "../m250-sampling-narrative-support.js";

export type EpistolaryStoryPacketInput = {
  readonly people: readonly { readonly id: string; readonly name: string }[];
  readonly events: readonly {
    readonly id: string;
    readonly text: string;
    readonly requires: readonly string[];
  }[];
  readonly openingTemplates: readonly string[];
  readonly replyTemplates: readonly string[];
  readonly closingTemplates: readonly string[];
  readonly delays: readonly {
    readonly id: string;
    readonly minimumDays: number;
    readonly maximumDays: number;
    readonly text: string;
  }[];
  readonly count: number;
  readonly startDay: number;
  readonly wrapWidth: number;
  readonly seed?: number;
};
export type EpistolaryLetter = {
  readonly id: string;
  readonly senderId: string;
  readonly recipientId: string;
  readonly eventId: string;
  readonly sentDay: number;
  readonly receivedDay: number;
  readonly delayId: string;
  readonly delayDays: number;
  readonly reply: { readonly to: string | null };
  readonly knownEventsBefore: readonly string[];
  readonly text: string;
  readonly lineCount: number;
};
export type EpistolaryStoryPacketOutput = {
  readonly letters: readonly EpistolaryLetter[];
  readonly revealOrder: readonly string[];
  readonly deliveryOrder: readonly string[];
  readonly randomness: GeneratorReplay;
};
const templates = snArray(snText, 16, 1);
export const inputSchema = snObject(
  {
    people: snArray(snObject({ id: snId, name: snId }), 32, 2),
    events: snArray(
      snObject({ id: snId, text: snText, requires: snArray(snId, 64) }),
      64,
      1,
    ),
    openingTemplates: templates,
    replyTemplates: templates,
    closingTemplates: templates,
    delays: snArray(
      snObject({
        id: snId,
        minimumDays: snInteger,
        maximumDays: snInteger,
        text: snText,
      }),
      16,
      1,
    ),
    count: { type: "integer", minimum: 1, maximum: 32 },
    startDay: {
      type: "integer",
      description:
        "Relative integer day origin supplied by the caller; no calendar or timezone assumptions.",
    },
    wrapWidth: { type: "integer", minimum: 1, maximum: 4096 },
    seed: generatorSeedSchema,
  },
  [
    "people",
    "events",
    "openingTemplates",
    "replyTemplates",
    "closingTemplates",
    "delays",
    "count",
    "startDay",
    "wrapWidth",
  ],
);
export const outputSchema = snObject({
  letters: snArray(
    snObject({
      id: snId,
      senderId: snId,
      recipientId: snId,
      eventId: snId,
      sentDay: { type: "integer" },
      receivedDay: { type: "integer" },
      delayId: snId,
      delayDays: snInteger,
      reply: snObject({ to: { anyOf: [snId, { type: "null" }] } }),
      knownEventsBefore: snArray(snId, 32),
      text: { type: "string", maxLength: 65536 },
      lineCount: snInteger,
    }),
    32,
    1,
  ),
  revealOrder: snArray(snId, 32, 1),
  deliveryOrder: snArray(snId, 32, 1),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is EpistolaryStoryPacketInput =>
  matchesModelInput(input, inputSchema);
export const calculateEpistolaryStoryPacket = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<EpistolaryStoryPacketOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    snDistinct(
      input.people.map((person) => person.id),
      "people",
    );
    snDistinct(
      input.events.map((event) => event.id),
      "events",
    );
    snDistinct(
      input.delays.map((delay) => delay.id),
      "delays",
    );
    if (input.count > input.events.length)
      simpleError(
        "count",
        "Each letter must reveal a distinct supplied event.",
        "infeasible_event_count",
      );
    const eventIds = new Set(input.events.map((event) => event.id)),
      ordered = new Set<string>();
    for (const event of input.events) {
      snDistinct(event.requires, "events");
      if (event.requires.some((id) => !eventIds.has(id)))
        simpleError(
          "events",
          "Event prerequisites must name supplied events.",
          "unknown_prerequisite",
        );
    }
    while (ordered.size < input.events.length) {
      const ready = input.events.filter(
        (event) =>
          !ordered.has(event.id) &&
          event.requires.every((id) => ordered.has(id)),
      );
      if (!ready.length)
        simpleError(
          "events",
          "Event prerequisites contain a cycle.",
          "cyclic_prerequisites",
        );
      ready.forEach((event) => ordered.add(event.id));
    }
    const tokens = {
      sender: "",
      recipient: "",
      eventId: "",
      replyId: "",
      delayDays: "",
    };
    for (const template of [
      ...input.openingTemplates,
      ...input.replyTemplates,
      ...input.closingTemplates,
      ...input.events.map((event) => event.text),
      ...input.delays.map((delay) => delay.text),
    ])
      snTemplate(template, tokens, "templates");
    for (const delay of input.delays)
      if (
        delay.maximumDays < delay.minimumDays ||
        !Number.isSafeInteger(delay.maximumDays - delay.minimumDays + 1)
      )
        simpleError(
          "delays",
          "Every transit delay range must be ordered with a safe inclusive integer width.",
          "invalid_delay_range",
        );
    const maximumEnd =
      BigInt(input.startDay) +
      BigInt(input.count) *
        BigInt(Math.max(...input.delays.map((delay) => delay.maximumDays)));
    if (maximumEnd > BigInt(Number.MAX_SAFE_INTEGER))
      simpleError(
        "delays",
        "Relative day arithmetic must remain a safe integer.",
        "unsafe_day_range",
      );
    const random = createGeneratorRandom(input.seed, context),
      first = snPick(input.people, random),
      second = snPick(
        input.people.filter((person) => person.id !== first.id),
        random,
      ),
      revealed = new Set<string>(),
      letters: EpistolaryLetter[] = [];
    let day = input.startDay;
    for (let i = 0; i < input.count; i += 1) {
      const sender = i % 2 ? second : first,
        recipient = i % 2 ? first : second,
        previous = letters[i - 1];
      const event = snPick(
        input.events.filter(
          (candidate) =>
            !revealed.has(candidate.id) &&
            candidate.requires.every((id) => revealed.has(id)),
        ),
        random,
      );
      const opening = snPick(
          i === 0 ? input.openingTemplates : input.replyTemplates,
          random,
        ),
        closing = snPick(input.closingTemplates, random),
        delay = snPick(input.delays, random),
        delayDays = random.integer(delay.minimumDays, delay.maximumDays);
      const values = {
        sender: sender.name,
        recipient: recipient.name,
        eventId: event.id,
        replyId: previous?.id ?? "",
        delayDays: String(delayDays),
      };
      const body = [opening, event.text, delay.text, closing]
        .map((text) => snTemplate(text, values, "templates"))
        .join(" ");
      const wrapped = calculateWordWrap({ text: body, width: input.wrapWidth });
      if (wrapped.wrappedText.length > 65536)
        simpleError(
          "templates",
          "An expanded letter exceeds 65536 UTF-16 units.",
          "resource_limit_exceeded",
        );
      letters.push({
        id: `letter-${i + 1}`,
        senderId: sender.id,
        recipientId: recipient.id,
        eventId: event.id,
        sentDay: day,
        receivedDay: day + delayDays,
        delayId: delay.id,
        delayDays,
        reply: { to: previous?.id ?? null },
        knownEventsBefore: [...revealed],
        text: wrapped.wrappedText,
        lineCount: wrapped.lineCount,
      });
      day += delayDays;
      revealed.add(event.id);
    }
    return toolSuccess(
      snBoundOutput({
        letters,
        revealOrder: [...revealed],
        deliveryOrder: letters.map((letter) => letter.id),
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const epistolaryStoryPacketExample = {
  input: {
    people: [
      { id: "m", name: "Mara" },
      { id: "i", name: "Ivo" },
    ],
    events: [
      { id: "gate", text: "The gate is open.", requires: [] },
      { id: "map", text: "The map is inside.", requires: ["gate"] },
    ],
    openingTemplates: ["Dear {recipient},"],
    replyTemplates: ["Re {replyId},"],
    closingTemplates: ["From {sender}."],
    delays: [
      {
        id: "courier",
        minimumDays: 1,
        maximumDays: 2,
        text: "Transit {delayDays} days.",
      },
    ],
    count: 2,
    startDay: 10,
    wrapWidth: 80,
    seed: 42,
  },
  output: {
    letters: [
      {
        id: "letter-1",
        senderId: "i",
        recipientId: "m",
        eventId: "gate",
        sentDay: 10,
        receivedDay: 11,
        delayId: "courier",
        delayDays: 1,
        reply: { to: null },
        knownEventsBefore: [],
        text: "Dear Mara, The gate is open. Transit 1 days. From Ivo.",
        lineCount: 1,
      },
      {
        id: "letter-2",
        senderId: "m",
        recipientId: "i",
        eventId: "map",
        sentDay: 11,
        receivedDay: 13,
        delayId: "courier",
        delayDays: 2,
        reply: { to: "letter-1" },
        knownEventsBefore: ["gate"],
        text: "Re letter-1, The map is inside. Transit 2 days. From Mara.",
        lineCount: 1,
      },
    ],
    revealOrder: ["gate", "map"],
    deliveryOrder: ["letter-1", "letter-2"],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  EpistolaryStoryPacketInput,
  EpistolaryStoryPacketOutput
>;
export const epistolaryStoryPacketTool = createModelDefinition<
  EpistolaryStoryPacketInput,
  EpistolaryStoryPacketOutput
>({
  id: "random/epistolary-story-packet",
  title: "Random Epistolary Story Packet Generator",
  description:
    "Compose fictional supplied-template correspondence with prerequisite-ordered reveals, explicit reply links, relative transit days, and delegated word wrapping.",
  inputSchema,
  outputSchema,
  execute: calculateEpistolaryStoryPacket,
});
export const runEpistolaryStoryPacket = epistolaryStoryPacketTool.execute;
export default epistolaryStoryPacketTool;
