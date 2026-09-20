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
  calculateCustomElementDashNameRequirement,
  customElementDashNameRequirementOutputSchema,
  type CustomElementDashNameRequirementOutput,
} from "../../html/custom-element-dash-name-requirement/tool.js";

export type Input = {
  readonly prefixes: readonly string[];
  readonly suffixes: readonly string[];
  readonly modes: readonly (
    "valid" | "remove-dash" | "uppercase" | "reserved"
  )[];
  readonly count: number;
  readonly seed?: number;
};
export type Output = {
  readonly cases: readonly {
    readonly prefix: string;
    readonly suffix: string;
    readonly original: string;
    readonly mode: "valid" | "remove-dash" | "uppercase" | "reserved";
    readonly name: string;
    readonly check: CustomElementDashNameRequirementOutput;
  }[];
  readonly randomness: GeneratorReplay;
};
const part = {
    type: "string",
    minLength: 1,
    maxLength: 32,
    pattern: "^[a-z][a-z0-9]*(?![\\s\\S])",
  } as const,
  mode = enumeration(["valid", "remove-dash", "uppercase", "reserved"]);
export const inputSchema = object(
  {
    prefixes: list(part),
    suffixes: list(part),
    modes: list(mode, 4),
    count: integer(1, 32),
    seed: generatorSeedSchema,
  },
  ["prefixes", "suffixes", "modes", "count"],
);
export const outputSchema = object({
  cases: list(
    object({
      prefix: part,
      suffix: part,
      original: text,
      mode,
      name: text,
      check: customElementDashNameRequirementOutputSchema,
    }),
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateCustomElementNameFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.modes, "modes");
    work(input.prefixes.length, input.suffixes.length, "suffixes", 128);
    for (const prefix of input.prefixes)
      for (const suffix of input.suffixes) {
        const baseline = calculateCustomElementDashNameRequirement({
          name: prefix + "-" + suffix,
        });
        if (!baseline.ok) throw new Error("Bounded custom name rejected");
        if (!baseline.output.valid)
          return simpleError(
            "prefixes",
            "Every supplied part pairing must form a permitted baseline name.",
            "invalid_baseline_name",
          );
      }
    const random = createGeneratorRandom(input.seed, context),
      cases = Array.from({ length: input.count }, () => {
        const prefix = choose(input.prefixes, random),
          suffix = choose(input.suffixes, random),
          original = prefix + "-" + suffix,
          mode = choose(input.modes, random),
          name =
            mode === "remove-dash"
              ? prefix + suffix
              : mode === "uppercase"
                ? prefix.toUpperCase() + "-" + suffix
                : mode === "reserved"
                  ? "font-face"
                  : original,
          core = calculateCustomElementDashNameRequirement({ name });
        if (!core.ok) throw new Error("Constructed custom name rejected");
        return { prefix, suffix, original, mode, name, check: core.output };
      });
    return toolSuccess(
      finish({ cases, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const customElementNameFixtureExample = {
  input: {
    prefixes: ["weather", "news"],
    suffixes: ["panel", "card"],
    modes: ["valid", "remove-dash", "uppercase", "reserved"],
    count: 1,
    seed: 42,
  },
  output: {
    cases: [
      {
        prefix: "news",
        suffix: "panel",
        original: "news-panel",
        mode: "reserved",
        name: "font-face",
        check: { valid: false, containsDash: true, reserved: true },
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const customElementNameFixtureTool = createModelDefinition<
  Input,
  Output
>({
  id: "random/custom-element-name-fixture",
  title: "Random Custom Element Name Fixture Generator",
  description:
    "Construct names from caller-supplied ASCII parts and controlled dash-removal, uppercase and reserved-name mutations, retaining current core flags without registering elements.",
  inputSchema,
  outputSchema,
  execute: calculateCustomElementNameFixture,
});
export const runCustomElementNameFixture = customElementNameFixtureTool.execute;
export default customElementNameFixtureTool;
