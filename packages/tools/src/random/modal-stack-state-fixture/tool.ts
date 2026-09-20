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
  readonly dialogs: readonly string[];
  readonly eventCount: number;
  readonly seed?: number;
};
export type Output = {
  readonly events: readonly {
    readonly action: "open" | "close" | "orphan-close";
    readonly targetId: string;
    readonly title: string;
    readonly parentId: string | null;
    readonly accepted: boolean;
    readonly stack: readonly string[];
  }[];
  readonly finalStack: readonly string[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    dialogs: list(label),
    eventCount: integer(1, 32),
    seed: generatorSeedSchema,
  },
  ["dialogs", "eventCount"],
);
export const outputSchema = object({
  events: list(
    object({
      action: enumeration(["open", "close", "orphan-close"]),
      targetId: id,
      title: text,
      parentId: nullable(id),
      accepted: bool,
      stack: list(id, 32, 0),
    }),
  ),
  finalStack: list(id, 32, 0),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateModalStackStateFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    work(input.eventCount, input.eventCount, "eventCount");
    const random = createGeneratorRandom(input.seed, context),
      stack: { id: string; title: string; parentId: string | null }[] = [];
    const events = Array.from({ length: input.eventCount }, (_, i) => {
      const action = choose(["close", "open", "orphan-close"] as const, random),
        top = stack.at(-1);
      if (action === "open") {
        const title = preview(choose(input.dialogs, random), 128),
          entry = { id: "modal-" + i, title, parentId: top?.id ?? null };
        stack.push(entry);
        return {
          action,
          targetId: entry.id,
          title,
          parentId: entry.parentId,
          accepted: true,
          stack: stack.map((d) => d.id),
        };
      }
      const accepted = action === "close" && top !== undefined,
        targetId = action === "orphan-close" ? "absent" : "modal-empty";
      if (accepted) stack.pop();
      return {
        action,
        targetId: accepted && top ? top.id : targetId,
        title: accepted && top ? top.title : "",
        parentId: accepted && top ? top.parentId : null,
        accepted,
        stack: stack.map((d) => d.id),
      };
    });
    return toolSuccess(
      finish({
        events,
        finalStack: stack.map((d) => d.id),
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const modalStackStateFixtureExample = {
  input: { dialogs: ["Settings", "Help"], eventCount: 2, seed: 42 },
  output: {
    events: [
      {
        action: "open",
        targetId: "modal-0",
        title: "Settings",
        parentId: null,
        accepted: true,
        stack: ["modal-0"],
      },
      {
        action: "orphan-close",
        targetId: "absent",
        title: "",
        parentId: null,
        accepted: false,
        stack: ["modal-0"],
      },
    ],
    finalStack: ["modal-0"],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const modalStackStateFixtureTool = createModelDefinition<Input, Output>({
  id: "random/modal-stack-state-fixture",
  title: "Random Modal Stack State Fixture Generator",
  description:
    "Construct dialog open, top-close and labeled orphan-close attempts with parent ownership and stack snapshots under a synthetic policy; focus behavior requires app tests.",
  inputSchema,
  outputSchema,
  execute: calculateModalStackStateFixture,
});
export const runModalStackStateFixture = modalStackStateFixtureTool.execute;
export default modalStackStateFixtureTool;
