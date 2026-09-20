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
import { calculateClipPathPolygonVertexValidator } from "../../css/clip-path-polygon-vertex-validator/tool.js";
import { calculatePolygonArea } from "../../geometry/polygon-area/tool.js";
import {
  objectSchema,
  arraySchema,
  countSchema,
  numberSchema,
  rangeSchema,
  drawInteger,
  orderedRange,
  coreOutput,
  ensureOutput,
  type NumericRange,
} from "../m250-css-music-space-support.js";
export type ClipVertex = { readonly x: number; readonly y: number };
export type CssClipPathShapeInput = {
  readonly vertexCount: number;
  readonly radiusPercent: NumericRange;
  readonly areaPercentSquared: NumericRange;
  readonly maximumAttempts: number;
  readonly seed?: number;
};
export type CssClipPathShapeOutput = {
  readonly vertices: readonly ClipVertex[];
  readonly areaPercentSquared: number;
  readonly css: string;
  readonly attempts: number;
  readonly randomness: GeneratorReplay;
};
const vertexSchema = objectSchema({
  x: { type: "number", minimum: 0, maximum: 100 },
  y: { type: "number", minimum: 0, maximum: 100 },
});
export const inputSchema = objectSchema(
  {
    vertexCount: countSchema(32, 3),
    radiusPercent: rangeSchema({ type: "integer", minimum: 1, maximum: 50 }),
    areaPercentSquared: rangeSchema({
      type: "number",
      minimum: 0,
      maximum: 10000,
    }),
    maximumAttempts: countSchema(128),
    seed: generatorSeedSchema,
  },
  ["vertexCount", "radiusPercent", "areaPercentSquared", "maximumAttempts"],
);
export const outputSchema = objectSchema({
  vertices: arraySchema(vertexSchema, 32, 3),
  areaPercentSquared: numberSchema,
  css: { type: "string", maxLength: 4096 },
  attempts: countSchema(128),
  randomness: generatorReplaySchema,
});
const cross = (a: ClipVertex, b: ClipVertex, c: ClipVertex): number =>
  (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
const simplePolygon = (vertices: readonly ClipVertex[]): boolean => {
  const n = vertices.length;
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) {
      if (j === i + 1 || (i === 0 && j === n - 1)) continue;
      const a = vertices[i],
        b = vertices[(i + 1) % n],
        c = vertices[j],
        d = vertices[(j + 1) % n];
      const ac = cross(a, b, c),
        ad = cross(a, b, d),
        ca = cross(c, d, a),
        cb = cross(c, d, b);
      if (ac * ad <= 0 && ca * cb <= 0) return false;
    }
  return true;
};
const isInput = (value: unknown): value is CssClipPathShapeInput =>
  matchesModelInput(value, inputSchema);
export const calculateCssClipPathShape = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CssClipPathShapeOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    orderedRange(input.radiusPercent, "radiusPercent");
    orderedRange(input.areaPercentSquared, "areaPercentSquared");
    const count = coreOutput(
      calculateClipPathPolygonVertexValidator({
        vertexCount: input.vertexCount,
      }),
    );
    if (!count.canEncloseArea)
      throw new Error("Validated vertex count cannot enclose area.");
    const random = createGeneratorRandom(input.seed, context);
    for (let attempts = 1; attempts <= input.maximumAttempts; attempts++) {
      const vertices = Array.from({ length: input.vertexCount }, (_, i) => {
        const radius = drawInteger(
            input.radiusPercent,
            random,
            "radiusPercent",
          ),
          angle = (2 * Math.PI * i) / input.vertexCount;
        // Exact cardinal vectors avoid artificial near-zero offsets in serialized CSS.
        const quarter = (4 * i) / input.vertexCount;
        const dx = Number.isInteger(quarter)
          ? [1, 0, -1, 0][quarter % 4]
          : Math.cos(angle);
        const dy = Number.isInteger(quarter)
          ? [0, 1, 0, -1][quarter % 4]
          : Math.sin(angle);
        return { x: 50 + radius * dx, y: 50 + radius * dy };
      });
      const areaPercentSquared = calculatePolygonArea({
        xs: vertices.map((v) => v.x),
        ys: vertices.map((v) => v.y),
      }).area;
      if (
        !simplePolygon(vertices) ||
        areaPercentSquared <= 0 ||
        areaPercentSquared < input.areaPercentSquared.minimum ||
        areaPercentSquared > input.areaPercentSquared.maximum
      )
        continue;
      const css =
        "clip-path: polygon(" +
        vertices.map((v) => v.x + "% " + v.y + "%").join(", ") +
        ");";
      return toolSuccess(
        ensureOutput(
          {
            vertices,
            areaPercentSquared,
            css,
            attempts,
            randomness: generatorReplay(input.seed, context),
          },
          outputSchema,
        ),
      );
    }
    return simpleError(
      "maximumAttempts",
      "No polygon met the area window within the bounded search.",
      "search_exhausted",
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const cssClipPathShapeExample = {
  input: {
    vertexCount: 4,
    radiusPercent: {
      minimum: 20,
      maximum: 40,
    },
    areaPercentSquared: {
      minimum: 100,
      maximum: 5000,
    },
    maximumAttempts: 32,
    seed: 42,
  },
  output: {
    vertices: [
      {
        x: 82,
        y: 50,
      },
      {
        x: 50,
        y: 79,
      },
      {
        x: 13,
        y: 50,
      },
      {
        x: 50,
        y: 16,
      },
    ],
    areaPercentSquared: 2173.5,
    css: "clip-path: polygon(82% 50%, 50% 79%, 13% 50%, 50% 16%);",
    attempts: 1,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<CssClipPathShapeInput, CssClipPathShapeOutput>;
export const cssClipPathShapeTool = createModelDefinition<
  CssClipPathShapeInput,
  CssClipPathShapeOutput
>({
  id: "random/css-clip-path-shape",
  title: "Random CSS Clip-Path Shape Generator",
  description:
    "Generate a bounded simple radial percentage polygon with verified area and serialize clip-path CSS.",
  inputSchema,
  outputSchema,
  execute: calculateCssClipPathShape,
});
export const runCssClipPathShape = cssClipPathShapeTool.execute;
export default cssClipPathShapeTool;
