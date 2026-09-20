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
  readonly labels: readonly {
    readonly text: string;
    readonly direction: "ltr" | "rtl";
  }[];
  readonly count: number;
  readonly labelLimit: number;
  readonly totalBudget: number;
  readonly seed?: number;
};
export type Output = {
  readonly tabs: readonly {
    readonly id: string;
    readonly label: string;
    readonly direction: "ltr" | "rtl";
    readonly displayLabel: string;
    readonly codepoints: number;
    readonly active: boolean;
  }[];
  readonly totalCodepoints: number;
  readonly overflow: boolean;
  readonly randomness: GeneratorReplay;
};
const direction = enumeration(["ltr", "rtl"]);
export const inputSchema = object(
  {
    labels: list(object({ text: label, direction })),
    count: integer(1, 32),
    labelLimit: integer(0, 128),
    totalBudget: integer(0, 4096),
    seed: generatorSeedSchema,
  },
  ["labels", "count", "labelLimit", "totalBudget"],
);
export const outputSchema = object({
  tabs: list(
    object({
      id,
      label,
      direction,
      displayLabel: text,
      codepoints: integer(1, 128),
      active: bool,
    }),
  ),
  totalCodepoints: integer(1, 4096),
  overflow: bool,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateTabLabelOverflowFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context),
      chosen = Array.from({ length: input.count }, () =>
        choose(input.labels, random),
      ),
      active = random.integer(0, input.count - 1);
    const tabs = chosen.map((record, i) => ({
        id: "tab-" + i,
        label: record.text,
        direction: record.direction,
        displayLabel: preview(record.text, input.labelLimit),
        codepoints: Array.from(record.text).length,
        active: i === active,
      })),
      totalCodepoints = tabs.reduce((n, t) => n + t.codepoints, 0);
    return toolSuccess(
      finish({
        tabs,
        totalCodepoints,
        overflow: totalCodepoints > input.totalBudget,
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const tabLabelOverflowFixtureExample = {
  input: {
    labels: [
      { text: "Home", direction: "ltr" },
      { text: "אבגדה", direction: "rtl" },
    ],
    count: 2,
    labelLimit: 3,
    totalBudget: 8,
    seed: 42,
  },
  output: {
    tabs: [
      {
        id: "tab-0",
        label: "אבגדה",
        direction: "rtl",
        displayLabel: "אב…",
        codepoints: 5,
        active: false,
      },
      {
        id: "tab-1",
        label: "Home",
        direction: "ltr",
        displayLabel: "Ho…",
        codepoints: 4,
        active: true,
      },
    ],
    totalCodepoints: 9,
    overflow: true,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const tabLabelOverflowFixtureTool = createModelDefinition<Input, Output>(
  {
    id: "random/tab-label-overflow-fixture",
    title: "Random Tab Label Overflow Fixture Generator",
    description:
      "Sample caller directional tab labels, choose one active tab, and report codepoint truncation and total-budget overflow without predicting rendered widths.",
    inputSchema,
    outputSchema,
    execute: calculateTabLabelOverflowFixture,
  },
);
export const runTabLabelOverflowFixture = tabLabelOverflowFixtureTool.execute;
export default tabLabelOverflowFixtureTool;
