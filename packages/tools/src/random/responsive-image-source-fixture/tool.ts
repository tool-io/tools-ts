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
  calculateSrcsetParser,
  srcsetParserOutputSchema,
  type SrcsetParserOutput,
} from "../../web/srcset-parser/tool.js";

export type Input = {
  readonly candidates: readonly {
    readonly url: string;
    readonly value: number;
  }[];
  readonly kind: "width" | "density";
  readonly candidatesPerCase: number;
  readonly modes: readonly ("valid" | "duplicate" | "zero" | "mixed")[];
  readonly count: number;
  readonly seed?: number;
};
export type Output = {
  readonly cases: readonly {
    readonly mode: "valid" | "duplicate" | "zero" | "mixed";
    readonly srcset: string;
    readonly parserResult: SrcsetParserOutput | null;
    readonly parserError: {
      readonly field: string;
      readonly code: string;
    } | null;
  }[];
  readonly randomness: GeneratorReplay;
};
const url = {
    type: "string",
    minLength: 1,
    maxLength: 128,
    pattern: "^[^\\s,]+(?![\\s\\S])",
  } as const,
  mode = enumeration(["valid", "duplicate", "zero", "mixed"]);
export const inputSchema = object(
  {
    candidates: list(
      object({ url, value: { type: "number", exclusiveMinimum: 0 } }),
      16,
    ),
    kind: enumeration(["width", "density"]),
    candidatesPerCase: integer(1, 16),
    modes: list(mode, 4),
    count: integer(1, 32),
    seed: generatorSeedSchema,
  },
  ["candidates", "kind", "candidatesPerCase", "modes", "count"],
);
export const outputSchema = object({
  cases: list(
    object({
      mode,
      srcset: markup,
      parserResult: nullable(srcsetParserOutputSchema),
      parserError: nullable(object({ field: text, code: text })),
    }),
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateResponsiveImageSourceFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.modes, "modes");
    if (
      new Set(input.candidates.map((c) => c.value)).size !==
      input.candidates.length
    )
      return simpleError(
        "candidates",
        "Baseline descriptor values must be distinct.",
        "duplicate_descriptor",
      );
    if (
      input.kind === "width" &&
      input.candidates.some((c) => !Number.isSafeInteger(c.value))
    )
      return simpleError(
        "candidates",
        "Width descriptors must be positive safe integers.",
        "invalid_width",
      );
    if (input.candidatesPerCase > input.candidates.length)
      return simpleError(
        "candidatesPerCase",
        "Cannot sample more descriptors than supplied.",
        "infeasible_candidate_count",
      );
    if (
      input.candidatesPerCase < 2 &&
      input.modes.some((m) => m === "duplicate" || m === "mixed")
    )
      return simpleError(
        "candidatesPerCase",
        "Mixed and duplicate controls need two candidates.",
        "insufficient_candidates",
      );
    work(input.count, input.candidatesPerCase, "count", 128);
    const random = createGeneratorRandom(input.seed, context),
      cases = Array.from({ length: input.count }, () => {
        const pool = [...input.candidates],
          selected: Input["candidates"][number][] = [];
        for (let i = 0; i < input.candidatesPerCase; i++) {
          const candidate = choose(pool, random);
          selected.push(candidate);
          pool.splice(pool.indexOf(candidate), 1);
        }
        const mode = choose(input.modes, random),
          suffix = input.kind === "width" ? "w" : "x",
          descriptors = selected.map((c) => String(c.value) + suffix);
        if (mode === "zero") descriptors[0] = "0" + suffix;
        if (mode === "duplicate") {
          const first = descriptors[0];
          if (first === undefined) throw new Error("Missing first descriptor");
          descriptors[descriptors.length - 1] = first;
        }
        if (mode === "mixed")
          descriptors[descriptors.length - 1] =
            input.kind === "width" ? "2x" : "100w";
        const srcset = selected
            .map((c, i) => c.url + " " + descriptors[i])
            .join(", "),
          core = calculateSrcsetParser({ srcset });
        let parserResult: SrcsetParserOutput | null = null,
          parserError: { field: string; code: string } | null = null;
        if (core.ok) {
          if (mode !== "valid")
            throw new Error(
              "Constructed invalid srcset was unexpectedly accepted",
            );
          parserResult = core.output;
        } else {
          const issue = core.error.issues[0],
            expected =
              mode === "mixed"
                ? "mixed_descriptors"
                : mode === "duplicate"
                  ? "duplicate_descriptor"
                  : "invalid_descriptor";
          if (mode === "valid" || issue?.code !== expected)
            throw new Error("Unexpected srcset parser failure");
          parserError = { field: issue.field, code: issue.code };
        }
        return { mode, srcset, parserResult, parserError };
      });
    return toolSuccess(
      finish({ cases, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const responsiveImageSourceFixtureExample = {
  input: {
    candidates: [
      { url: "a.png", value: 100 },
      { url: "b.png", value: 200 },
    ],
    kind: "width",
    candidatesPerCase: 2,
    modes: ["valid", "duplicate", "zero", "mixed"],
    count: 1,
    seed: 42,
  },
  output: {
    cases: [
      {
        mode: "mixed",
        srcset: "b.png 200w, a.png 2x",
        parserResult: null,
        parserError: { field: "srcset", code: "mixed_descriptors" },
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const responsiveImageSourceFixtureTool = createModelDefinition<
  Input,
  Output
>({
  id: "random/responsive-image-source-fixture",
  title: "Random Responsive Image Source Fixture Generator",
  description:
    "Construct caller srcset candidates with unique sampled descriptors and controlled mixed/duplicate/zero mutations, retaining actual lexical parser outcomes without selecting a browser image source.",
  inputSchema,
  outputSchema,
  execute: calculateResponsiveImageSourceFixture,
});
export const runResponsiveImageSourceFixture =
  responsiveImageSourceFixtureTool.execute;
export default responsiveImageSourceFixtureTool;
