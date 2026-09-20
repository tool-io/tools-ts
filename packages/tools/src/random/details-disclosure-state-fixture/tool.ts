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
    readonly summary: string;
    readonly body: string;
  }[];
  readonly nodeCount: number;
  readonly seed?: number;
};
export type Output = {
  readonly nodes: readonly {
    readonly id: string;
    readonly parentId: string | null;
    readonly summary: string;
    readonly body: string;
    readonly open: boolean;
    readonly visible: boolean;
    readonly parsed: import("../../html/attribute-parser/tool.js").ParsedHtmlTag;
  }[];
  readonly html: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    sections: list(object({ summary: label, body: text }), 16),
    nodeCount: integer(1, 16),
    seed: generatorSeedSchema,
  },
  ["sections", "nodeCount"],
);
export const outputSchema = object({
  nodes: list(
    object({
      id,
      parentId: nullable(id),
      summary: label,
      body: text,
      open: bool,
      visible: bool,
      parsed: parsedSchema,
    }),
    16,
  ),
  html: markup,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateDetailsDisclosureStateFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context),
      nodes: {
        id: string;
        parentId: string | null;
        summary: string;
        body: string;
        open: boolean;
        visible: boolean;
        parsed: import("../../html/attribute-parser/tool.js").ParsedHtmlTag;
        depth: number;
      }[] = [];
    for (let i = 0; i < input.nodeCount; i++) {
      const parent =
          i === 0
            ? null
            : choose(
                nodes.filter((n) => n.depth < 8),
                random,
              ),
        section = choose(input.sections, random),
        open = random.unit() < 0.5,
        start =
          '<details id="disclosure-' + i + '"' + (open ? " open" : "") + ">";
      nodes.push({
        id: "disclosure-" + i,
        parentId: parent?.id ?? null,
        ...section,
        open,
        visible: parent === null || (parent.visible && parent.open),
        parsed: parse(start),
        depth: parent === null ? 0 : parent.depth + 1,
      });
    }
    const render = (node: (typeof nodes)[number]): string =>
        '<details id="' +
        node.id +
        '"' +
        (node.open ? " open" : "") +
        "><summary>" +
        escape(node.summary) +
        "</summary><p>" +
        escape(node.body) +
        "</p>" +
        nodes
          .filter((n) => n.parentId === node.id)
          .map(render)
          .join("") +
        "</details>",
      root = nodes[0];
    if (!root) throw new Error("Missing disclosure root");
    return toolSuccess(
      finish({
        nodes: nodes.map(({ depth, ...n }) => n),
        html: render(root),
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const detailsDisclosureStateFixtureExample = {
  input: {
    sections: [{ summary: "More", body: "Details" }],
    nodeCount: 2,
    seed: 42,
  },
  output: {
    nodes: [
      {
        id: "disclosure-0",
        parentId: null,
        summary: "More",
        body: "Details",
        open: true,
        visible: true,
        parsed: {
          name: "details",
          attributes: [
            { name: "id", value: "disclosure-0" },
            { name: "open", value: "" },
          ],
        },
      },
      {
        id: "disclosure-1",
        parentId: "disclosure-0",
        summary: "More",
        body: "Details",
        open: true,
        visible: true,
        parsed: {
          name: "details",
          attributes: [
            { name: "id", value: "disclosure-1" },
            { name: "open", value: "" },
          ],
        },
      },
    ],
    html: '<details id="disclosure-0" open><summary>More</summary><p>Details</p><details id="disclosure-1" open><summary>More</summary><p>Details</p></details></details>',
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const detailsDisclosureStateFixtureTool = createModelDefinition<
  Input,
  Output
>({
  id: "random/details-disclosure-state-fixture",
  title: "Random Details Disclosure State Fixture Generator",
  description:
    "Construct nested supplied disclosure content with open-presence keys and visibility derived from ancestor state; browser interaction and rendering remain app-tested.",
  inputSchema,
  outputSchema,
  execute: calculateDetailsDisclosureStateFixture,
});
export const runDetailsDisclosureStateFixture =
  detailsDisclosureStateFixtureTool.execute;
export default detailsDisclosureStateFixtureTool;
