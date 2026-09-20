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

type Command = {
  readonly id: string;
  readonly label: string;
  readonly group: string;
  readonly shortcut: string;
  readonly available: boolean;
};
export type Input = {
  readonly commands: readonly Command[];
  readonly labelLimit: number;
  readonly seed?: number;
};
export type Output = {
  readonly commands: readonly (Command & { readonly displayLabel: string })[];
  readonly searches: readonly {
    readonly query: string;
    readonly matchedIds: readonly string[];
    readonly availableIds: readonly string[];
  }[];
  readonly randomness: GeneratorReplay;
};
const commandSchema = object({
  id,
  label,
  group: label,
  shortcut: text,
  available: bool,
});
export const inputSchema = object(
  {
    commands: list(commandSchema, 16),
    labelLimit: integer(0, 128),
    seed: generatorSeedSchema,
  },
  ["commands", "labelLimit"],
);
export const outputSchema = object({
  commands: list(
    object({
      id: { type: "string", maxLength: 64 },
      label,
      group: label,
      shortcut: text,
      available: bool,
      displayLabel: text,
    }),
    17,
  ),
  searches: list(
    object({
      query: text,
      matchedIds: list(text, 17, 0),
      availableIds: list(text, 17, 0),
    }),
    2,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateCommandPaletteFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(
      input.commands.map((c) => c.id),
      "commands",
    );
    if (input.commands.some((c) => c.id.startsWith("tie-")))
      return simpleError(
        "commands",
        "The tie- prefix is reserved for a constructed control.",
        "reserved_id",
      );
    const random = createGeneratorRandom(input.seed, context),
      shuffled = random.shuffle(input.commands),
      tied = choose(shuffled, random);
    const commands = [...shuffled, { ...tied, id: "tie-" + tied.id }].map(
      (c) => ({ ...c, displayLabel: preview(c.label, input.labelLimit) }),
    );
    let absent = "[missing]";
    while (commands.some((c) => c.label.toLowerCase().includes(absent)))
      absent += "!";
    const searches = [tied.label, absent].map((query) => {
      const matched = commands.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase()),
      );
      return {
        query,
        matchedIds: matched.map((c) => c.id),
        availableIds: matched.filter((c) => c.available).map((c) => c.id),
      };
    });
    return toolSuccess(
      finish({
        commands,
        searches,
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const commandPaletteFixtureExample = {
  input: {
    commands: [
      {
        id: "open",
        label: "Open",
        group: "Files",
        shortcut: "Ctrl+O",
        available: true,
      },
      {
        id: "close",
        label: "Close",
        group: "Files",
        shortcut: "Ctrl+W",
        available: false,
      },
    ],
    labelLimit: 3,
    seed: 42,
  },
  output: {
    commands: [
      {
        id: "open",
        label: "Open",
        group: "Files",
        shortcut: "Ctrl+O",
        available: true,
        displayLabel: "Op…",
      },
      {
        id: "close",
        label: "Close",
        group: "Files",
        shortcut: "Ctrl+W",
        available: false,
        displayLabel: "Cl…",
      },
      {
        id: "tie-open",
        label: "Open",
        group: "Files",
        shortcut: "Ctrl+O",
        available: true,
        displayLabel: "Op…",
      },
    ],
    searches: [
      {
        query: "Open",
        matchedIds: ["open", "tie-open"],
        availableIds: ["open", "tie-open"],
      },
      { query: "[missing]", matchedIds: [], availableIds: [] },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const commandPaletteFixtureTool = createModelDefinition<Input, Output>({
  id: "random/command-palette-fixture",
  title: "Random Command Palette Fixture Generator",
  description:
    "Shuffle supplied commands, construct a deliberate search tie and guaranteed empty query, and retain shortcut, group and availability expectations.",
  inputSchema,
  outputSchema,
  execute: calculateCommandPaletteFixture,
});
export const runCommandPaletteFixture = commandPaletteFixtureTool.execute;
export default commandPaletteFixtureTool;
