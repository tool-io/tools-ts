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
import { calculateSelectorSpecificity } from "../../css/selector-specificity/tool.js";
import {
  objectSchema,
  arraySchema,
  countSchema,
  coreOutput,
  ensureOutput,
} from "../m250-css-music-space-support.js";
export type SelectorSpecificityQuizInput = {
  readonly templates: readonly string[];
  readonly typeNames: readonly string[];
  readonly classNames: readonly string[];
  readonly idNames: readonly string[];
  readonly count: number;
  readonly seed?: number;
};
export type SelectorSpecificityQuizOutput = {
  readonly questions: readonly {
    readonly selector: string;
    readonly specificity: {
      readonly ids: number;
      readonly classes: number;
      readonly types: number;
    };
  }[];
  readonly randomness: GeneratorReplay;
};
const names = arraySchema(
  {
    type: "string",
    pattern: "^[A-Za-z_][A-Za-z0-9_-]*(?![\\s\\S])",
    minLength: 1,
    maxLength: 64,
  },
  32,
  1,
);
export const inputSchema = objectSchema(
  {
    templates: arraySchema(
      { type: "string", minLength: 1, maxLength: 512 },
      32,
      1,
    ),
    typeNames: names,
    classNames: names,
    idNames: names,
    count: countSchema(64),
    seed: generatorSeedSchema,
  },
  ["templates", "typeNames", "classNames", "idNames", "count"],
);
export const outputSchema = objectSchema({
  questions: arraySchema(
    objectSchema({
      selector: { type: "string", maxLength: 1024 },
      specificity: objectSchema({
        ids: { type: "integer", minimum: 0 },
        classes: { type: "integer", minimum: 0 },
        types: { type: "integer", minimum: 0 },
      }),
    }),
    64,
    1,
  ),
  randomness: generatorReplaySchema,
});
const compose = (
  template: string,
  type: string,
  cls: string,
  id: string,
): string =>
  template
    .replaceAll("{type}", type)
    .replaceAll("{class}", cls)
    .replaceAll("{id}", id);
const isInput = (value: unknown): value is SelectorSpecificityQuizInput =>
  matchesModelInput(value, inputSchema);
export const calculateSelectorSpecificityQuiz = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<SelectorSpecificityQuizOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    for (let i = 0; i < input.templates.length; i++) {
      const selector = compose(
        input.templates[i],
        input.typeNames[0],
        input.classNames[0],
        input.idNames[0],
      );
      if (/[{}]/.test(selector))
        simpleError(
          "templates." + i,
          "Only type, class and id placeholders are supported.",
          "unsupported_template",
        );
      const parsed = calculateSelectorSpecificity({ selectors: selector });
      if (!parsed.ok || parsed.output.selectors.length !== 1)
        simpleError(
          "templates." + i,
          "Each template must construct one supported selector.",
          "unsupported_selector",
        );
    }
    const random = createGeneratorRandom(input.seed, context);
    const questions = Array.from({ length: input.count }, () => {
      const template = random.pick(input.templates),
        type = random.pick(input.typeNames),
        cls = random.pick(input.classNames),
        id = random.pick(input.idNames);
      const selector = compose(template, type, cls, id),
        evaluated = coreOutput(
          calculateSelectorSpecificity({ selectors: selector }),
        ).selectors[0];
      if (!evaluated)
        throw new Error(
          "Validated selector template lost its single selector.",
        );
      return { selector, specificity: evaluated.specificity };
    });
    return toolSuccess(
      ensureOutput(
        { questions, randomness: generatorReplay(input.seed, context) },
        outputSchema,
      ),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const selectorSpecificityQuizExample = {
  input: {
    templates: ["{type}.{class}#{id}:hover", ":where(#{id}) {type}.{class}"],
    typeNames: ["article", "button"],
    classNames: ["card", "active"],
    idNames: ["hero", "main"],
    count: 2,
    seed: 42,
  },
  output: {
    questions: [
      {
        selector: ":where(#main) article.active",
        specificity: {
          ids: 0,
          classes: 1,
          types: 1,
        },
      },
      {
        selector: "button.card#main:hover",
        specificity: {
          ids: 1,
          classes: 2,
          types: 1,
        },
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  SelectorSpecificityQuizInput,
  SelectorSpecificityQuizOutput
>;
export const selectorSpecificityQuizTool = createModelDefinition<
  SelectorSpecificityQuizInput,
  SelectorSpecificityQuizOutput
>({
  id: "random/selector-specificity-quiz",
  title: "Random Selector Specificity Quiz Generator",
  description:
    "Compose selectors from caller templates and safe identifiers and return delegated specificity triples for supported syntax.",
  inputSchema,
  outputSchema,
  execute: calculateSelectorSpecificityQuiz,
});
export const runSelectorSpecificityQuiz = selectorSpecificityQuizTool.execute;
export default selectorSpecificityQuizTool;
