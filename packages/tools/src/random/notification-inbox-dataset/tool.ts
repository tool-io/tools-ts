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
import {
  mocksArray,
  mocksObject,
  mocksLabel,
  mocksText,
  mocksInteger,
  mocksBoolean,
  mocksProbability,
  mocksNullable,
  mocksPick,
  mocksTimestamp,
  mocksFrequencies,
  mocksOrdered,
  mocksSafe,
  mocksFinish,
} from "../m250-parser-mocks-support.js";
export type NotificationInboxDatasetInput = {
  readonly templates: readonly {
    readonly category: string;
    readonly text: string;
  }[];
  readonly count: number;
  readonly startMilliseconds: number;
  readonly endMilliseconds: number;
  readonly readProbability: number;
  readonly seed?: number;
};
export type NotificationInboxDatasetOutput = {
  readonly notifications: readonly {
    readonly id: string;
    readonly category: string;
    readonly text: string;
    readonly createdMilliseconds: number;
    readonly read: boolean;
    readonly readAtMilliseconds: number | null;
  }[];
  readonly unreadCount: number;
  readonly categoryCounts: readonly {
    readonly label: string;
    readonly count: number;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = mocksObject(
  {
    templates: mocksArray(
      mocksObject({ category: mocksLabel, text: mocksText }),
      128,
      1,
    ),
    count: { type: "integer", minimum: 1, maximum: 128 },
    startMilliseconds: mocksInteger,
    endMilliseconds: mocksInteger,
    readProbability: mocksProbability,
    seed: generatorSeedSchema,
  },
  [
    "templates",
    "count",
    "startMilliseconds",
    "endMilliseconds",
    "readProbability",
  ],
);
export const outputSchema = mocksObject({
  notifications: mocksArray(
    mocksObject({
      id: mocksLabel,
      category: mocksLabel,
      text: mocksText,
      createdMilliseconds: mocksInteger,
      read: mocksBoolean,
      readAtMilliseconds: mocksNullable(mocksInteger),
    }),
    128,
    1,
  ),
  unreadCount: mocksInteger,
  categoryCounts: mocksArray(
    mocksObject({ label: mocksLabel, count: mocksInteger }),
  ),
  randomness: generatorReplaySchema,
});
const generate = (
  input: NotificationInboxDatasetInput,
  random: GeneratorRandom,
): Omit<NotificationInboxDatasetOutput, "randomness"> => {
  mocksOrdered(
    input.startMilliseconds,
    input.endMilliseconds,
    "endMilliseconds",
  );
  mocksSafe(
    input.endMilliseconds - input.startMilliseconds + 1,
    "endMilliseconds",
  );
  const notifications = Array.from({ length: input.count }, (_, i) => {
    const template = mocksPick(input.templates, random),
      createdMilliseconds = mocksTimestamp(
        input.startMilliseconds,
        input.endMilliseconds,
        random,
      );
    const read = random.unit() < input.readProbability;
    return {
      id: "notification-" + (i + 1),
      ...template,
      createdMilliseconds,
      read,
      readAtMilliseconds: read
        ? mocksTimestamp(createdMilliseconds, input.endMilliseconds, random)
        : null,
    };
  }).sort((a, b) => b.createdMilliseconds - a.createdMilliseconds);
  return {
    notifications,
    unreadCount: notifications.filter((notification) => !notification.read)
      .length,
    categoryCounts: mocksFrequencies(
      notifications.map((notification) => notification.category),
    ),
  };
};
export const notificationInboxDatasetExample = {
  input: {
    templates: [
      { category: "updates", text: "A fictional file changed." },
      { category: "social", text: "A fictional invitation arrived." },
      { category: "system", text: "A fictional task finished." },
    ],
    count: 2,
    startMilliseconds: 1000,
    endMilliseconds: 5000,
    readProbability: 0.7,
    seed: 42,
  },
  output: {
    notifications: [
      {
        id: "notification-1",
        category: "social",
        text: "A fictional invitation arrived.",
        createdMilliseconds: 2793,
        read: false,
        readAtMilliseconds: null,
      },
      {
        id: "notification-2",
        category: "system",
        text: "A fictional task finished.",
        createdMilliseconds: 1699,
        read: true,
        readAtMilliseconds: 2601,
      },
    ],
    unreadCount: 1,
    categoryCounts: [
      { label: "social", count: 1 },
      { label: "system", count: 1 },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  NotificationInboxDatasetInput,
  NotificationInboxDatasetOutput
>;

const isInput = (input: unknown): input is NotificationInboxDatasetInput =>
  matchesModelInput(input, inputSchema);
export const calculateNotificationInboxDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<NotificationInboxDatasetOutput> => {
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
export const notificationInboxDatasetTool = createModelDefinition<
  NotificationInboxDatasetInput,
  NotificationInboxDatasetOutput
>({
  id: "random/notification-inbox-dataset",
  title: "Random Notification Inbox Dataset Generator",
  description:
    "Compose supplied notification templates into a synthetic inbox with feasible read timestamps, chronological order, and unread and category counts.",
  inputSchema,
  outputSchema,
  execute: calculateNotificationInboxDataset,
});
export const runNotificationInboxDataset = notificationInboxDatasetTool.execute;
export default notificationInboxDatasetTool;
