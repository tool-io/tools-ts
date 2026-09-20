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
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { calculateRandomHexColor } from "../hex-color/tool.js";
import {
  generatedDrawingPointSchema,
  generatedSvgSchema,
  generatedDrawingDistance,
  generatedPolylineLength,
} from "../drawing-construction.js";

export type SvgConstellationPatternInput = {
  readonly nodeCount: number;
  readonly width: number;
  readonly height: number;
  readonly maximumLinkDistance: number;
  readonly seed?: number;
};
export type SvgConstellationPatternOutput = {
  readonly nodes: readonly { readonly x: number; readonly y: number }[];
  readonly links: readonly {
    readonly from: number;
    readonly to: number;
    readonly distance: number;
  }[];
  readonly color: string;
  readonly totalLinkLength: number;
  readonly svg: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nodeCount: { type: "integer", minimum: 2, maximum: 64 },
    width: { type: "integer", minimum: 2 },
    height: { type: "integer", minimum: 2 },
    maximumLinkDistance: { type: "number", minimum: 0 },
    seed: generatorSeedSchema,
  },
  required: ["nodeCount", "width", "height", "maximumLinkDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nodes: {
      type: "array",
      minItems: 2,
      maxItems: 64,
      items: generatedDrawingPointSchema,
    },
    links: {
      type: "array",
      maxItems: 2016,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          from: { type: "integer", minimum: 0, maximum: 63 },
          to: { type: "integer", minimum: 0, maximum: 63 },
          distance: { type: "number", minimum: 0 },
        },
        required: ["from", "to", "distance"],
      },
    },
    color: { type: "string", pattern: "^#[0-9A-F]{6}(?![\\s\\S])" },
    totalLinkLength: { type: "number", minimum: 0 },
    svg: generatedSvgSchema,
    randomness: generatorReplaySchema,
  },
  required: ["nodes", "links", "color", "totalLinkLength", "svg", "randomness"],
} as const;

const isInput = (input: unknown): input is SvgConstellationPatternInput =>
  matchesModelInput(input, inputSchema);
export const calculateSvgConstellationPattern = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<SvgConstellationPatternOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context),
      color = calculateRandomHexColor(random.unit)?.hex;
    if (color === undefined)
      throw new Error("The random hex-color core rejected a checked source.");
    const nodes = Array.from({ length: input.nodeCount }, () => ({
      x: random.integer(1, input.width - 1),
      y: random.integer(1, input.height - 1),
    }));
    const links: { from: number; to: number; distance: number }[] = [];
    let totalLinkLength = 0;
    for (let from = 0; from < nodes.length; from += 1)
      for (let to = from + 1; to < nodes.length; to += 1) {
        const distance = generatedDrawingDistance(
          nodes[from],
          nodes[to],
          "maximumLinkDistance",
        );
        if (distance <= input.maximumLinkDistance) {
          links.push({ from, to, distance });
          totalLinkLength += generatedPolylineLength(
            [nodes[from], nodes[to]],
            "maximumLinkDistance",
          );
        }
      }
    if (!Number.isFinite(totalLinkLength))
      simpleError(
        "maximumLinkDistance",
        "The accumulated link length is not representable.",
        "numeric_overflow",
      );
    const lines = links
      .map(
        ({ from, to }) =>
          '<line x1="' +
          nodes[from].x +
          '" y1="' +
          nodes[from].y +
          '" x2="' +
          nodes[to].x +
          '" y2="' +
          nodes[to].y +
          '" stroke="' +
          color +
          '" stroke-width="0.25"/>',
      )
      .join("");
    const circles = nodes
      .map(
        ({ x, y }) =>
          '<circle cx="' +
          x +
          '" cy="' +
          y +
          '" r="0.5" fill="' +
          color +
          '"/>',
      )
      .join("");
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
      input.width +
      " " +
      input.height +
      '">' +
      lines +
      circles +
      "</svg>";
    return toolSuccess({
      nodes,
      links,
      color,
      totalLinkLength,
      svg,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const svgConstellationPatternExample = {
  input: {
    nodeCount: 3,
    width: 5,
    height: 5,
    maximumLinkDistance: 2.5,
    seed: 42,
  },
  output: {
    nodes: [
      {
        x: 2,
        y: 4,
      },
      {
        x: 3,
        y: 1,
      },
      {
        x: 3,
        y: 2,
      },
    ],
    links: [
      {
        from: 0,
        to: 2,
        distance: 2.23606797749979,
      },
      {
        from: 1,
        to: 2,
        distance: 1,
      },
    ],
    color: "#99E1EF",
    totalLinkLength: 3.23606797749979,
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 5"><line x1="2" y1="4" x2="3" y2="2" stroke="#99E1EF" stroke-width="0.25"/><line x1="3" y1="1" x2="3" y2="2" stroke="#99E1EF" stroke-width="0.25"/><circle cx="2" cy="4" r="0.5" fill="#99E1EF"/><circle cx="3" cy="1" r="0.5" fill="#99E1EF"/><circle cx="3" cy="2" r="0.5" fill="#99E1EF"/></svg>',
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  SvgConstellationPatternInput,
  SvgConstellationPatternOutput
>;
export const svgConstellationPatternTool = createModelDefinition<
  SvgConstellationPatternInput,
  SvgConstellationPatternOutput
>({
  id: "random/svg-constellation-pattern",
  title: "Random SVG Constellation Pattern Generator",
  description:
    "Generate bounded decorative integer-coordinate nodes and all unordered links no longer than a supplied Euclidean threshold, with random hex styling and measured total link length in portable SVG; nodes may coincide and do not represent astronomical objects.",
  inputSchema,
  outputSchema,
  execute: calculateSvgConstellationPattern,
});
export const runSvgConstellationPattern = svgConstellationPatternTool.execute;
export default svgConstellationPatternTool;
