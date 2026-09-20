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

type Region = {
  readonly tag: "nav" | "main" | "aside" | "section";
  readonly label: string;
};
export type Input = {
  readonly regions: readonly Region[];
  readonly duplicateLabel: boolean;
  readonly seed?: number;
};
export type Output = {
  readonly regions: readonly {
    readonly id: string;
    readonly tag: "nav" | "main" | "aside" | "section";
    readonly label: string;
    readonly parsed: import("../../html/attribute-parser/tool.js").ParsedHtmlTag;
  }[];
  readonly duplicateLabelIds: readonly string[];
  readonly html: string;
  readonly randomness: GeneratorReplay;
};
const tag = enumeration(["nav", "main", "aside", "section"]);
export const inputSchema = object(
  {
    regions: list(object({ tag, label: text }), 16),
    duplicateLabel: bool,
    seed: generatorSeedSchema,
  },
  ["regions", "duplicateLabel"],
);
export const outputSchema = object({
  regions: list(object({ id, tag, label: text, parsed: parsedSchema }), 17),
  duplicateLabelIds: list(id, 17, 0),
  html: markup,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateLandmarkRegionLayoutFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.duplicateLabel && input.regions.every((r) => r.label === ""))
      return simpleError(
        "regions",
        "A nonempty supplied label is needed for a duplicate-label control.",
        "missing_label_control",
      );
    const random = createGeneratorRandom(input.seed, context),
      pool = [...input.regions],
      ordered: Region[] = [];
    while (pool.length) {
      const chosen = choose(pool, random);
      ordered.push(chosen);
      pool.splice(pool.indexOf(chosen), 1);
    }
    if (input.duplicateLabel)
      ordered.push({
        ...choose(
          ordered.filter((r) => r.label !== ""),
          random,
        ),
      });
    const regions = ordered.map((r, i) => {
        const start =
          "<" +
          r.tag +
          (r.label === "" ? "" : ' aria-label="' + escape(r.label) + '"') +
          ">";
        return { id: "region-" + i, ...r, parsed: parse(start) };
      }),
      duplicateLabelIds = regions
        .filter(
          (r) =>
            r.label !== "" &&
            regions.filter((s) => s.tag === r.tag && s.label === r.label)
              .length > 1,
        )
        .map((r) => r.id),
      html = regions
        .map(
          (r) =>
            "<" +
            r.tag +
            (r.label === "" ? "" : ' aria-label="' + escape(r.label) + '"') +
            "></" +
            r.tag +
            ">",
        )
        .join("");
    return toolSuccess(
      finish({
        regions,
        duplicateLabelIds,
        html,
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const landmarkRegionLayoutFixtureExample = {
  input: {
    regions: [
      { tag: "nav", label: "Primary" },
      { tag: "main", label: "Content" },
    ],
    duplicateLabel: true,
    seed: 42,
  },
  output: {
    regions: [
      {
        id: "region-0",
        tag: "main",
        label: "Content",
        parsed: {
          name: "main",
          attributes: [{ name: "aria-label", value: "Content" }],
        },
      },
      {
        id: "region-1",
        tag: "nav",
        label: "Primary",
        parsed: {
          name: "nav",
          attributes: [{ name: "aria-label", value: "Primary" }],
        },
      },
      {
        id: "region-2",
        tag: "nav",
        label: "Primary",
        parsed: {
          name: "nav",
          attributes: [{ name: "aria-label", value: "Primary" }],
        },
      },
    ],
    duplicateLabelIds: ["region-1", "region-2"],
    html: '<main aria-label="Content"></main><nav aria-label="Primary"></nav><nav aria-label="Primary"></nav>',
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const landmarkRegionLayoutFixtureTool = createModelDefinition<
  Input,
  Output
>({
  id: "random/landmark-region-layout-fixture",
  title: "Random Landmark Region Layout Fixture Generator",
  description:
    "Assemble caller landmark templates in sampled order with optional repeated-role label controls, retaining lexical attributes and exact same-tag label collisions without a document accessibility verdict.",
  inputSchema,
  outputSchema,
  execute: calculateLandmarkRegionLayoutFixture,
});
export const runLandmarkRegionLayoutFixture =
  landmarkRegionLayoutFixtureTool.execute;
export default landmarkRegionLayoutFixtureTool;
