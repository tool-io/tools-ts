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

type Column = {
  readonly id: string;
  readonly label: string;
  readonly required: boolean;
  readonly pin: "left" | "none" | "right";
};
export type Input = {
  readonly columns: readonly Column[];
  readonly seed?: number;
};
export type Output = {
  readonly columns: readonly (Column & {
    readonly displayLabel: string;
    readonly visible: boolean;
  })[];
  readonly order: readonly string[];
  readonly visibleOrder: readonly string[];
  readonly randomness: GeneratorReplay;
};
const pin = enumeration(["left", "none", "right"]);
export const inputSchema = object(
  {
    columns: list(object({ id, label, required: bool, pin })),
    seed: generatorSeedSchema,
  },
  ["columns"],
);
export const outputSchema = object({
  columns: list(
    object({
      id,
      label,
      required: bool,
      pin,
      displayLabel: text,
      visible: bool,
    }),
  ),
  order: list(id),
  visibleOrder: list(id, 32, 0),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateTableColumnVisibilityFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(
      input.columns.map((c) => c.id),
      "columns",
    );
    const random = createGeneratorRandom(input.seed, context),
      shuffled = random.shuffle(input.columns);
    const columns = shuffled.map((column) => {
        const visibleDraw = choose([true, false], random);
        return {
          ...column,
          displayLabel: preview(column.label, 32),
          visible: column.required || visibleDraw,
        };
      }),
      order = columns.map((c) => c.id),
      visibleOrder = (["left", "none", "right"] as const).flatMap((pin) =>
        columns.filter((c) => c.visible && c.pin === pin).map((c) => c.id),
      );
    return toolSuccess(
      finish({
        columns,
        order,
        visibleOrder,
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const tableColumnVisibilityFixtureExample = {
  input: {
    columns: [
      { id: "name", label: "Name", required: true, pin: "left" },
      { id: "age", label: "Age", required: false, pin: "none" },
      { id: "status", label: "Status", required: false, pin: "right" },
    ],
    seed: 42,
  },
  output: {
    columns: [
      {
        id: "status",
        label: "Status",
        required: false,
        pin: "right",
        displayLabel: "Status",
        visible: false,
      },
      {
        id: "name",
        label: "Name",
        required: true,
        pin: "left",
        displayLabel: "Name",
        visible: true,
      },
      {
        id: "age",
        label: "Age",
        required: false,
        pin: "none",
        displayLabel: "Age",
        visible: true,
      },
    ],
    order: ["status", "name", "age"],
    visibleOrder: ["name", "age"],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const tableColumnVisibilityFixtureTool = createModelDefinition<
  Input,
  Output
>({
  id: "random/table-column-visibility-fixture",
  title: "Random Table Column Visibility Fixture Generator",
  description:
    "Shuffle supplied unique columns and draw optional visibility while retaining required columns and stable left/none/right pin partitions.",
  inputSchema,
  outputSchema,
  execute: calculateTableColumnVisibilityFixture,
});
export const runTableColumnVisibilityFixture =
  tableColumnVisibilityFixtureTool.execute;
export default tableColumnVisibilityFixtureTool;
