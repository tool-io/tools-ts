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

type Option = {
  readonly id: string;
  readonly label: string;
  readonly group: string;
  readonly disabled: boolean;
};
export type Input = {
  readonly options: readonly Option[];
  readonly minimumSelected: number;
  readonly maximumSelected: number;
  readonly seed?: number;
};
export type Output = {
  readonly options: readonly (Option & {
    readonly displayLabel: string;
    readonly selected: boolean;
  })[];
  readonly selectedIds: readonly string[];
  readonly randomness: GeneratorReplay;
};
const optionSchema = object({ id, label, group: label, disabled: bool });
export const inputSchema = object(
  {
    options: list(optionSchema),
    minimumSelected: integer(0, 32),
    maximumSelected: integer(0, 32),
    seed: generatorSeedSchema,
  },
  ["options", "minimumSelected", "maximumSelected"],
);
export const outputSchema = object({
  options: list(
    object({
      id,
      label,
      group: label,
      disabled: bool,
      displayLabel: text,
      selected: bool,
    }),
  ),
  selectedIds: list(id, 32, 0),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateMultiSelectOptionFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(
      input.options.map((o) => o.id),
      "options",
    );
    const enabled = input.options.filter((o) => !o.disabled);
    if (input.minimumSelected > input.maximumSelected)
      return simpleError(
        "maximumSelected",
        "Selection bounds must be ordered.",
        "invalid_selection_range",
      );
    if (input.maximumSelected > enabled.length)
      return simpleError(
        "maximumSelected",
        "The entire selected range must fit enabled options.",
        "infeasible_selection",
      );
    const random = createGeneratorRandom(input.seed, context),
      count = random.integer(input.minimumSelected, input.maximumSelected),
      pool = [...enabled],
      selectedIds: string[] = [];
    for (let i = 0; i < count; i++) {
      const picked = choose(pool, random);
      selectedIds.push(picked.id);
      pool.splice(
        pool.findIndex((o) => o.id === picked.id),
        1,
      );
    }
    const options = input.options.map((option) => ({
      ...option,
      displayLabel: preview(option.label, 32),
      selected: selectedIds.includes(option.id),
    }));
    return toolSuccess(
      finish({
        options,
        selectedIds,
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const multiSelectOptionFixtureExample = {
  input: {
    options: [
      { id: "a", label: "Same", group: "A", disabled: false },
      { id: "b", label: "Same", group: "B", disabled: false },
      { id: "c", label: "Locked", group: "B", disabled: true },
    ],
    minimumSelected: 2,
    maximumSelected: 2,
    seed: 42,
  },
  output: {
    options: [
      {
        id: "a",
        label: "Same",
        group: "A",
        disabled: false,
        displayLabel: "Same",
        selected: true,
      },
      {
        id: "b",
        label: "Same",
        group: "B",
        disabled: false,
        displayLabel: "Same",
        selected: true,
      },
      {
        id: "c",
        label: "Locked",
        group: "B",
        disabled: true,
        displayLabel: "Locked",
        selected: false,
      },
    ],
    selectedIds: ["a", "b"],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const multiSelectOptionFixtureTool = createModelDefinition<
  Input,
  Output
>({
  id: "random/multi-select-option-fixture",
  title: "Random Multi-Select Option Fixture Generator",
  description:
    "Sample enabled option IDs without replacement under explicit minimum/maximum selection constraints, preserving caller groups, disabled flags and duplicate labels.",
  inputSchema,
  outputSchema,
  execute: calculateMultiSelectOptionFixture,
});
export const runMultiSelectOptionFixture = multiSelectOptionFixtureTool.execute;
export default multiSelectOptionFixtureTool;
