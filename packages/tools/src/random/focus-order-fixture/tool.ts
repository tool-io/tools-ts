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
import {
  calculateTabindexPositiveAntipatternChecker,
  tabindexPositiveAntipatternCheckerOutputSchema,
  type TabindexPositiveAntipatternCheckerOutput,
} from "../../html/tabindex-positive-antipattern-checker/tool.js";

type Control = {
  readonly id: string;
  readonly label: string;
  readonly tabindex: number;
  readonly hidden: boolean;
};
export type Input = {
  readonly controls: readonly Control[];
  readonly seed?: number;
};
export type Output = {
  readonly controls: readonly (Control & {
    readonly domIndex: number;
    readonly html: string;
    readonly check: TabindexPositiveAntipatternCheckerOutput;
  })[];
  readonly expectedOrder: readonly string[];
  readonly randomness: GeneratorReplay;
};
const tabindex = integer(-Number.MAX_SAFE_INTEGER);
export const inputSchema = object(
  {
    controls: list(object({ id, label, tabindex, hidden: bool })),
    seed: generatorSeedSchema,
  },
  ["controls"],
);
export const outputSchema = object({
  controls: list(
    object({
      id,
      label,
      tabindex,
      hidden: bool,
      domIndex: integer(0, 31),
      html: markup,
      check: tabindexPositiveAntipatternCheckerOutputSchema,
    }),
  ),
  expectedOrder: list(id, 32, 0),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateFocusOrderFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(
      input.controls.map((c) => c.id),
      "controls",
    );
    const random = createGeneratorRandom(input.seed, context),
      pool = [...input.controls],
      ordered: Control[] = [];
    while (pool.length) {
      const selected = choose(pool, random);
      ordered.push(selected);
      pool.splice(
        pool.findIndex((c) => c.id === selected.id),
        1,
      );
    }
    const controls = ordered.map((c, domIndex) => {
        const core = calculateTabindexPositiveAntipatternChecker({
          tabindex: c.tabindex,
        });
        if (!core.ok) throw new Error("Validated tabindex rejected");
        return {
          ...c,
          tabindex: c.tabindex === 0 ? 0 : c.tabindex,
          domIndex,
          html:
            '<button id="' +
            c.id +
            '" tabindex="' +
            c.tabindex +
            '"' +
            (c.hidden ? " hidden" : "") +
            ">" +
            escape(c.label) +
            "</button>",
          check: core.output,
        };
      }),
      eligible = controls.filter((c) => !c.hidden && c.tabindex >= 0);
    eligible.sort((a, b) =>
      a.tabindex === 0 && b.tabindex > 0
        ? 1
        : b.tabindex === 0 && a.tabindex > 0
          ? -1
          : a.tabindex === b.tabindex
            ? a.domIndex - b.domIndex
            : a.tabindex < b.tabindex
              ? -1
              : 1,
    );
    return toolSuccess(
      finish({
        controls,
        expectedOrder: eligible.map((c) => c.id),
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const focusOrderFixtureExample = {
  input: {
    controls: [
      { id: "a", label: "Alpha", tabindex: 0, hidden: false },
      { id: "b", label: "Beta", tabindex: 2, hidden: false },
      { id: "c", label: "Gamma", tabindex: -1, hidden: true },
    ],
    seed: 42,
  },
  output: {
    controls: [
      {
        id: "b",
        label: "Beta",
        tabindex: 2,
        hidden: false,
        domIndex: 0,
        html: '<button id="b" tabindex="2">Beta</button>',
        check: {
          positiveOrdering: true,
          requestsSequentialFocus: true,
          requestsProgrammaticFocus: true,
        },
      },
      {
        id: "a",
        label: "Alpha",
        tabindex: 0,
        hidden: false,
        domIndex: 1,
        html: '<button id="a" tabindex="0">Alpha</button>',
        check: {
          positiveOrdering: false,
          requestsSequentialFocus: true,
          requestsProgrammaticFocus: true,
        },
      },
      {
        id: "c",
        label: "Gamma",
        tabindex: -1,
        hidden: true,
        domIndex: 2,
        html: '<button id="c" tabindex="-1" hidden>Gamma</button>',
        check: {
          positiveOrdering: false,
          requestsSequentialFocus: false,
          requestsProgrammaticFocus: true,
        },
      },
    ],
    expectedOrder: ["b", "a"],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const focusOrderFixtureTool = createModelDefinition<Input, Output>({
  id: "random/focus-order-fixture",
  title: "Random Focus Order Fixture Generator",
  description:
    "Shuffle supplied controls and derive a positive-tabindex-first, DOM-tied order excluding hidden/negative controls under an explicit convention, retaining attribute-only core flags.",
  inputSchema,
  outputSchema,
  execute: calculateFocusOrderFixture,
});
export const runFocusOrderFixture = focusOrderFixtureTool.execute;
export default focusOrderFixtureTool;
