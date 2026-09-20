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
  calculateImgAltPresenceChecker,
  imgAltPresenceCheckerOutputSchema,
  type ImgAltPresenceCheckerOutput,
} from "../../html/img-alt-presence-checker/tool.js";

export type Input = {
  readonly images: readonly {
    readonly description: string;
    readonly context: "decorative" | "informative";
  }[];
  readonly modes: readonly ("contextual" | "missing")[];
  readonly count: number;
  readonly seed?: number;
};
export type Output = {
  readonly cases: readonly {
    readonly description: string;
    readonly context: "decorative" | "informative";
    readonly mode: "contextual" | "missing";
    readonly alt: string | null;
    readonly html: string;
    readonly presence: ImgAltPresenceCheckerOutput;
  }[];
  readonly randomness: GeneratorReplay;
};
const contextSchema = enumeration(["decorative", "informative"]),
  mode = enumeration(["contextual", "missing"]);
export const inputSchema = object(
  {
    images: list(object({ description: label, context: contextSchema })),
    modes: list(mode, 2),
    count: integer(1, 32),
    seed: generatorSeedSchema,
  },
  ["images", "modes", "count"],
);
export const outputSchema = object({
  cases: list(
    object({
      description: label,
      context: contextSchema,
      mode,
      alt: nullable(text),
      html: markup,
      presence: imgAltPresenceCheckerOutputSchema,
    }),
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateImageAltContextFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.modes, "modes");
    const random = createGeneratorRandom(input.seed, context),
      cases = Array.from({ length: input.count }, () => {
        const image = choose(input.images, random),
          mode = choose(input.modes, random),
          alt =
            mode === "missing"
              ? null
              : image.context === "decorative"
                ? ""
                : image.description,
          core = calculateImgAltPresenceChecker({
            hasAlt: alt !== null,
            alt: alt ?? "",
          });
        if (!core.ok) throw new Error("Constructed alt evidence rejected");
        return {
          ...image,
          mode,
          alt,
          html:
            "<img" + (alt === null ? "" : ' alt="' + escape(alt) + '"') + ">",
          presence: core.output,
        };
      });
    return toolSuccess(
      finish({ cases, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const imageAltContextFixtureExample = {
  input: {
    images: [
      { description: "Campus map", context: "informative" },
      { description: "Divider", context: "decorative" },
    ],
    modes: ["contextual", "missing"],
    count: 2,
    seed: 42,
  },
  output: {
    cases: [
      {
        description: "Divider",
        context: "decorative",
        mode: "contextual",
        alt: "",
        html: '<img alt="">',
        presence: { present: true, emptyAlternative: true },
      },
      {
        description: "Divider",
        context: "decorative",
        mode: "missing",
        alt: null,
        html: "<img>",
        presence: { present: false, emptyAlternative: false },
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const imageAltContextFixtureTool = createModelDefinition<Input, Output>({
  id: "random/image-alt-context-fixture",
  title: "Random Image Alt Context Fixture Generator",
  description:
    "Pair caller image descriptions with decorative/informative contexts and missing-alt controls, retaining presence-check results without judging alternative-text quality.",
  inputSchema,
  outputSchema,
  execute: calculateImageAltContextFixture,
});
export const runImageAltContextFixture = imageAltContextFixtureTool.execute;
export default imageAltContextFixtureTool;
