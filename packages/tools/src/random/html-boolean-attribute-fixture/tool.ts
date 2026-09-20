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

type Attribute =
  | "disabled"
  | "checked"
  | "required"
  | "multiple"
  | "readonly"
  | "autofocus"
  | "open";
type Variant = "absent" | "bare" | "empty" | "name" | "false";
export type Input = {
  readonly attributes: readonly Attribute[];
  readonly variants: readonly Variant[];
  readonly count: number;
  readonly seed?: number;
};
export type Output = {
  readonly cases: readonly {
    readonly attribute: Attribute;
    readonly variant: Variant;
    readonly tag: string;
    readonly parsed: import("../../html/attribute-parser/tool.js").ParsedHtmlTag;
    readonly present: boolean;
    readonly interpreted: boolean;
    readonly spellingConforming: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
const attribute = enumeration([
    "disabled",
    "checked",
    "required",
    "multiple",
    "readonly",
    "autofocus",
    "open",
  ]),
  variant = enumeration(["absent", "bare", "empty", "name", "false"]);
export const inputSchema = object(
  {
    attributes: list(attribute, 7),
    variants: list(variant, 5),
    count: integer(1, 32),
    seed: generatorSeedSchema,
  },
  ["attributes", "variants", "count"],
);
export const outputSchema = object({
  cases: list(
    object({
      attribute,
      variant,
      tag: markup,
      parsed: parsedSchema,
      present: bool,
      interpreted: bool,
      spellingConforming: bool,
    }),
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateHtmlBooleanAttributeFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.attributes, "attributes");
    distinct(input.variants, "variants");
    const random = createGeneratorRandom(input.seed, context),
      cases = Array.from({ length: input.count }, () => {
        const attribute = choose(input.attributes, random),
          variant = choose(input.variants, random),
          name =
            attribute === "open"
              ? "details"
              : attribute === "multiple"
                ? "select"
                : attribute === "disabled"
                  ? "button"
                  : "input",
          base = attribute === "checked" ? ' type="checkbox"' : "",
          spelling =
            variant === "absent"
              ? ""
              : variant === "bare"
                ? " " + attribute
                : " " +
                  attribute +
                  '="' +
                  (variant === "empty"
                    ? ""
                    : variant === "name"
                      ? attribute
                      : "false") +
                  '"',
          tag = "<" + name + base + spelling + ">",
          parsed = parse(tag),
          present = parsed.attributes.some((a) => a.name === attribute);
        return {
          attribute,
          variant,
          tag,
          parsed,
          present,
          interpreted: present,
          spellingConforming: variant !== "false",
        };
      });
    return toolSuccess(
      finish({ cases, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const htmlBooleanAttributeFixtureExample = {
  input: {
    attributes: ["disabled"],
    variants: ["absent", "bare", "empty", "name", "false"],
    count: 2,
    seed: 42,
  },
  output: {
    cases: [
      {
        attribute: "disabled",
        variant: "empty",
        tag: '<button disabled="">',
        parsed: {
          name: "button",
          attributes: [{ name: "disabled", value: "" }],
        },
        present: true,
        interpreted: true,
        spellingConforming: true,
      },
      {
        attribute: "disabled",
        variant: "name",
        tag: '<button disabled="disabled">',
        parsed: {
          name: "button",
          attributes: [{ name: "disabled", value: "disabled" }],
        },
        present: true,
        interpreted: true,
        spellingConforming: true,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const htmlBooleanAttributeFixtureTool = createModelDefinition<
  Input,
  Output
>({
  id: "random/html-boolean-attribute-fixture",
  title: "Random HTML Boolean Attribute Fixture Generator",
  description:
    "Construct supported Boolean-attribute spellings with lexical parser outputs, separate presence-based interpretation and author-spelling keys, including the nonconforming false-value control.",
  inputSchema,
  outputSchema,
  execute: calculateHtmlBooleanAttributeFixture,
});
export const runHtmlBooleanAttributeFixture =
  htmlBooleanAttributeFixtureTool.execute;
export default htmlBooleanAttributeFixtureTool;
