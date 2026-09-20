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
  readonly records: readonly {
    readonly name: string;
    readonly imageLabel: string;
  }[];
  readonly count: number;
  readonly visibleLimit: number;
  readonly seed?: number;
};
export type Output = {
  readonly avatars: readonly {
    readonly id: string;
    readonly name: string;
    readonly initials: string;
    readonly imageLabel: string | null;
    readonly visible: boolean;
  }[];
  readonly visibleCount: number;
  readonly overflowCount: number;
  readonly overflowLabel: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    records: list(object({ name: label, imageLabel: text })),
    count: integer(1, 32),
    visibleLimit: integer(0, 32),
    seed: generatorSeedSchema,
  },
  ["records", "count", "visibleLimit"],
);
export const outputSchema = object({
  avatars: list(
    object({
      id,
      name: label,
      initials: text,
      imageLabel: nullable(text),
      visible: bool,
    }),
  ),
  visibleCount: integer(0, 32),
  overflowCount: integer(0, 32),
  overflowLabel: text,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateAvatarGroupOverflowFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.records.some((r) => r.name.trim() === ""))
      return simpleError(
        "records",
        "Names need at least one non-whitespace character.",
        "empty_name",
      );
    const random = createGeneratorRandom(input.seed, context),
      avatars = Array.from({ length: input.count }, (_, i) => {
        const record = choose(input.records, random),
          missing = random.unit() < 0.5,
          words = record.name.trim().split(/\s+/u),
          initials = words
            .slice(0, 2)
            .map((word) => Array.from(word)[0] ?? "")
            .join("")
            .toUpperCase();
        return {
          id: "avatar-" + i,
          name: preview(record.name, 128),
          initials,
          imageLabel:
            missing || record.imageLabel === "" ? null : record.imageLabel,
          visible: i < input.visibleLimit,
        };
      }),
      visibleCount = Math.min(input.visibleLimit, input.count),
      overflowCount = input.count - visibleCount;
    return toolSuccess(
      finish({
        avatars,
        visibleCount,
        overflowCount,
        overflowLabel: overflowCount > 0 ? "+" + overflowCount : "",
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const avatarGroupOverflowFixtureExample = {
  input: {
    records: [
      { name: "Ana Reed", imageLabel: "portrait-a" },
      { name: "Bo Li", imageLabel: "portrait-b" },
    ],
    count: 3,
    visibleLimit: 2,
    seed: 42,
  },
  output: {
    avatars: [
      {
        id: "avatar-0",
        name: "Bo Li",
        initials: "BL",
        imageLabel: null,
        visible: true,
      },
      {
        id: "avatar-1",
        name: "Bo Li",
        initials: "BL",
        imageLabel: "portrait-b",
        visible: true,
      },
      {
        id: "avatar-2",
        name: "Ana Reed",
        initials: "AR",
        imageLabel: "portrait-a",
        visible: false,
      },
    ],
    visibleCount: 2,
    overflowCount: 1,
    overflowLabel: "+1",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const avatarGroupOverflowFixtureTool = createModelDefinition<
  Input,
  Output
>({
  id: "random/avatar-group-overflow-fixture",
  title: "Random Avatar Group Overflow Fixture Generator",
  description:
    "Sample caller-owned fictional avatar records, derive word initials and missing-image flags, and produce visible/overflow counts without creating image assets.",
  inputSchema,
  outputSchema,
  execute: calculateAvatarGroupOverflowFixture,
});
export const runAvatarGroupOverflowFixture =
  avatarGroupOverflowFixtureTool.execute;
export default avatarGroupOverflowFixtureTool;
