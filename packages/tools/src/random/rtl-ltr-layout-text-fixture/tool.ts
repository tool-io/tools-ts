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
  runNormalizeUnicode,
  type UnicodeForm,
} from "../../text/normalize-unicode/tool.js";

export type Input = {
  readonly texts: readonly {
    readonly text: string;
    readonly direction: "ltr" | "rtl";
  }[];
  readonly form: UnicodeForm;
  readonly count: number;
  readonly seed?: number;
};
export type Output = {
  readonly spans: readonly {
    readonly logicalIndex: number;
    readonly original: string;
    readonly normalized: string;
    readonly direction: "ltr" | "rtl";
    readonly parsed: import("../../html/attribute-parser/tool.js").ParsedHtmlTag;
  }[];
  readonly html: string;
  readonly randomness: GeneratorReplay;
};
const direction = enumeration(["ltr", "rtl"]);
export const inputSchema = object(
  {
    texts: list(object({ text, direction })),
    form: enumeration(["NFC", "NFD", "NFKC", "NFKD"]),
    count: integer(1, 32),
    seed: generatorSeedSchema,
  },
  ["texts", "form", "count"],
);
export const outputSchema = object({
  spans: list(
    object({
      logicalIndex: integer(0, 31),
      original: text,
      normalized: { type: "string", maxLength: 8192 },
      direction,
      parsed: parsedSchema,
    }),
  ),
  html: { type: "string", maxLength: 524288 },
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateRtlLtrLayoutTextFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context),
      spans = Array.from({ length: input.count }, (_, logicalIndex) => {
        const supplied = choose(input.texts, random),
          core = runNormalizeUnicode({ text: supplied.text, form: input.form });
        if (!core.ok) throw new Error("Validated Unicode fixture rejected");
        return {
          logicalIndex,
          original: supplied.text,
          normalized: core.output.normalized,
          direction: supplied.direction,
          parsed: parse('<bdi dir="' + supplied.direction + '">'),
        };
      }),
      html = spans
        .map(
          (s) =>
            '<bdi dir="' + s.direction + '">' + escape(s.normalized) + "</bdi>",
        )
        .join("");
    return toolSuccess(
      finish({ spans, html, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const rtlLtrLayoutTextFixtureExample = {
  input: {
    texts: [
      { text: "אבג", direction: "rtl" },
      { text: "e\u0301", direction: "ltr" },
    ],
    form: "NFC",
    count: 2,
    seed: 42,
  },
  output: {
    spans: [
      {
        logicalIndex: 0,
        original: "e\u0301",
        normalized: "é",
        direction: "ltr",
        parsed: { name: "bdi", attributes: [{ name: "dir", value: "ltr" }] },
      },
      {
        logicalIndex: 1,
        original: "אבג",
        normalized: "אבג",
        direction: "rtl",
        parsed: { name: "bdi", attributes: [{ name: "dir", value: "rtl" }] },
      },
    ],
    html: '<bdi dir="ltr">é</bdi><bdi dir="rtl">אבג</bdi>',
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const rtlLtrLayoutTextFixtureTool = createModelDefinition<Input, Output>(
  {
    id: "random/rtl-ltr-layout-text-fixture",
    title: "Random RTL and LTR Layout Text Fixture Generator",
    description:
      "Normalize caller directional text and assemble labeled bdi spans in logical source order, retaining raw dir attributes without predicting visual bidi or assistive-technology behavior.",
    inputSchema,
    outputSchema,
    execute: calculateRtlLtrLayoutTextFixture,
  },
);
export const runRtlLtrLayoutTextFixture = rtlLtrLayoutTextFixtureTool.execute;
export default rtlLtrLayoutTextFixtureTool;
