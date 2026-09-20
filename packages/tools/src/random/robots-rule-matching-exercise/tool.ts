import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
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
import { budget as fixtureBudget } from "../m500b-web-json-json.js";
import {
  object,
  array,
  text,
  label,
  bounded,
  boolean,
} from "../m500b-web-json-schema.js";
import { pick } from "../m500b-web-json-json.js";
import { coreOutput } from "../m500b-web-json-protocol.js";
import { calculateRobotsAllowChecker } from "../../web/robots-allow-checker/tool.js";
export type RobotsRuleMatchingExerciseInput = {
  readonly productToken: string;
  readonly rules: readonly { readonly allow: boolean; readonly path: string }[];
  readonly paths: readonly string[];
  readonly count: number;
  readonly seed?: number;
};
export type RobotsRuleMatchingExerciseOutput = {
  readonly robots: string;
  readonly exercises: readonly {
    readonly path: string;
    readonly allowed: boolean;
    readonly matchedRule: string;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    productToken: label,
    rules: array(object({ allow: boolean, path: text }), 16),
    paths: array(text, 16, 1),
    count: bounded(1, 32),
    seed: generatorSeedSchema,
  },
  ["productToken", "rules", "paths", "count"],
);
export const outputSchema = object({
  robots: text,
  exercises: array(
    object({ path: text, allowed: boolean, matchedRule: text }),
    32,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is RobotsRuleMatchingExerciseInput =>
  matchesModelInput(input, inputSchema);
export const calculateRobotsRuleMatchingExercise = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<RobotsRuleMatchingExerciseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    if (!/^[A-Za-z_-]+(?![\s\S])/u.test(input.productToken))
      simpleError(
        "productToken",
        "Use an exact crawler product token.",
        "invalid_product_token",
      );
    if (
      input.rules.some(
        (r) => !r.path.startsWith("/") || /[\r\n#]/u.test(r.path),
      )
    )
      simpleError(
        "rules",
        "Rule paths must begin with slash and contain no comments or line breaks.",
        "invalid_rule",
      );
    if (input.paths.some((p) => !p.startsWith("/") || /[\r\n]/u.test(p)))
      simpleError(
        "paths",
        "Supply slash-prefixed line-free paths.",
        "invalid_path",
      );
    const robots =
        "User-agent: " +
        input.productToken +
        "\n" +
        input.rules
          .map((r) => (r.allow ? "Allow: " : "Disallow: ") + r.path + "\n")
          .join(""),
      random = createGeneratorRandom(input.seed, context),
      exercises = Array.from({ length: input.count }, () => {
        const path = pick(input.paths, random);
        return {
          path,
          ...coreOutput(
            calculateRobotsAllowChecker({
              robots,
              productToken: input.productToken,
              path,
            }),
          ),
        };
      });
    return toolSuccess({
      robots,
      exercises,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const robotsRuleMatchingExerciseExample = {
  input: {
    productToken: "FixtureBot",
    rules: [
      { allow: false, path: "/private" },
      { allow: true, path: "/private/public" },
    ],
    paths: ["/private/x", "/private/public/x"],
    count: 1,
    seed: 42,
  },
  output: {
    robots:
      "User-agent: FixtureBot\nDisallow: /private\nAllow: /private/public\n",
    exercises: [
      {
        path: "/private/public/x",
        allowed: true,
        matchedRule: "Allow: /private/public",
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  RobotsRuleMatchingExerciseInput,
  RobotsRuleMatchingExerciseOutput
>;
export const robotsRuleMatchingExerciseTool = createModelDefinition<
  RobotsRuleMatchingExerciseInput,
  RobotsRuleMatchingExerciseOutput
>({
  id: "random/robots-rule-matching-exercise",
  title: "Random Robots Rule Matching Exercise Generator",
  description:
    "Construct caller-supplied robots rule exercises and delegate winning-rule answers without fetching websites or granting scraping permission.",
  inputSchema,
  outputSchema,
  execute: calculateRobotsRuleMatchingExercise,
});
export const runRobotsRuleMatchingExercise =
  robotsRuleMatchingExerciseTool.execute;
export default robotsRuleMatchingExerciseTool;
