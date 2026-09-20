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
  readonly sections: readonly {
    readonly heading: string;
    readonly body: string;
  }[];
  readonly count: number;
  readonly expandedProbability: number;
  readonly previewLimit: number;
  readonly seed?: number;
};
export type Output = {
  readonly sections: readonly {
    readonly id: string;
    readonly heading: string;
    readonly body: string;
    readonly preview: string;
    readonly expanded: boolean;
    readonly lengthClass: "empty" | "within-limit" | "over-limit";
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    sections: list(object({ heading: label, body: text })),
    count: integer(1, 32),
    expandedProbability: { type: "number", minimum: 0, maximum: 1 },
    previewLimit: integer(0, 256),
    seed: generatorSeedSchema,
  },
  ["sections", "count", "expandedProbability", "previewLimit"],
);
export const outputSchema = object({
  sections: list(
    object({
      id,
      heading: label,
      body: text,
      preview: text,
      expanded: bool,
      lengthClass: enumeration(["empty", "within-limit", "over-limit"]),
    }),
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateAccordionContentFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    const sections = Array.from(
      { length: input.count },
      (_, index): Output["sections"][number] => {
        const section = choose(input.sections, random),
          expanded = random.unit() < input.expandedProbability,
          length = Array.from(section.body).length;
        return {
          id: "section-" + index,
          ...section,
          preview: preview(section.body, input.previewLimit),
          expanded,
          lengthClass:
            length === 0
              ? "empty"
              : length > input.previewLimit
                ? "over-limit"
                : "within-limit",
        };
      },
    );
    return toolSuccess(
      finish({ sections, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const accordionContentFixtureExample = {
  input: {
    sections: [
      { heading: "Details", body: "" },
      { heading: "Release", body: "Launch notes" },
    ],
    count: 2,
    expandedProbability: 0.5,
    previewLimit: 3,
    seed: 42,
  },
  output: {
    sections: [
      {
        id: "section-0",
        heading: "Release",
        body: "Launch notes",
        preview: "La…",
        expanded: true,
        lengthClass: "over-limit",
      },
      {
        id: "section-1",
        heading: "Release",
        body: "Launch notes",
        preview: "La…",
        expanded: false,
        lengthClass: "over-limit",
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const accordionContentFixtureTool = createModelDefinition<Input, Output>(
  {
    id: "random/accordion-content-fixture",
    title: "Random Accordion Content Fixture Generator",
    description:
      "Sample supplied accordion section content with independent expansion flags and codepoint previews; these synthetic fixtures do not execute a browser.",
    inputSchema,
    outputSchema,
    execute: calculateAccordionContentFixture,
  },
);
export const runAccordionContentFixture = accordionContentFixtureTool.execute;
export default accordionContentFixtureTool;
