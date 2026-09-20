import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import { simpleError } from "../../core/simple.js";
import { calculateRectangleArea } from "../../geometry/rectangle-area/tool.js";
import {
  fcArray,
  fcFinite,
  fcInput,
  fcInteger,
  fcNumber,
  fcObject,
  fcOutput,
  fcPick,
  fcRun,
  fcUnique,
  matchesModelInput,
  type FcReplay,
  type FcSeed,
} from "../m250-fiction-craft-common.js";
export type StainedGlassPanelLayoutInput = FcSeed & {
  readonly width: number;
  readonly height: number;
  readonly cellCount: number;
  readonly palette: readonly string[];
};
export type StainedGlassPanelLayoutOutput = FcReplay & {
  readonly artworkOnly: boolean;
  readonly cells: readonly {
    readonly id: number;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly area: number;
    readonly color: string;
  }[];
  readonly adjacency: readonly {
    readonly a: number;
    readonly b: number;
    readonly sharedEdgeLength: number;
  }[];
  readonly totalArea: number;
  readonly cellAreaSum: number;
};
const positive = { type: "number", exclusiveMinimum: 0 } as const,
  color = {
    type: "string",
    pattern: "^#[0-9a-fA-F]{6}(?![\\s\\S])",
    minLength: 7,
    maxLength: 7,
  } as const;
export const inputSchema = fcInput({
  width: positive,
  height: positive,
  cellCount: fcInteger(1, 64),
  palette: fcArray(color, 32, 1),
});
export const outputSchema = fcOutput({
  artworkOnly: { type: "boolean", const: true },
  cells: fcArray(
    fcObject({
      id: fcInteger(1, 64),
      x: fcNumber,
      y: fcNumber,
      width: positive,
      height: positive,
      area: positive,
      color,
    }),
    64,
    1,
  ),
  adjacency: fcArray(
    fcObject({
      a: fcInteger(1, 64),
      b: fcInteger(1, 64),
      sharedEdgeLength: positive,
    }),
    2016,
  ),
  totalArea: positive,
  cellAreaSum: positive,
});
const isInput = (v: unknown): v is StainedGlassPanelLayoutInput =>
  matchesModelInput(v, inputSchema);
export const calculateStainedGlassPanelLayout = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  fcRun(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<StainedGlassPanelLayoutOutput, "randomness"> => {
      fcUnique(x.palette, "palette");
      const totalArea = fcFinite(calculateRectangleArea(x).area, "width");
      if (totalArea <= 0)
        simpleError(
          "width",
          "Panel area is smaller than numeric resolution.",
          "numeric_resolution",
        );
      const bounds = [{ x0: 0, y0: 0, x1: x.width, y1: x.height }];
      while (bounds.length < x.cellCount) {
        const b = fcPick(bounds, random),
          vertical = random.unit() < 0.5,
          fraction = 0.25 + random.unit() * 0.5;
        const split = vertical
          ? b.x0 + (b.x1 - b.x0) * fraction
          : b.y0 + (b.y1 - b.y0) * fraction;
        if (
          vertical
            ? split <= b.x0 || split >= b.x1
            : split <= b.y0 || split >= b.y1
        )
          simpleError(
            "cellCount",
            "A requested cell split is below floating-point resolution.",
            "numeric_resolution",
          );
        bounds.splice(
          bounds.indexOf(b),
          1,
          vertical ? { ...b, x1: split } : { ...b, y1: split },
          vertical ? { ...b, x0: split } : { ...b, y0: split },
        );
      }
      const cells = bounds.map((b, i) => {
        const width = b.x1 - b.x0,
          height = b.y1 - b.y0,
          area = fcFinite(
            calculateRectangleArea({ width, height }).area,
            "cellCount",
          );
        if (area <= 0)
          simpleError(
            "cellCount",
            "A requested cell area is below numeric resolution.",
            "numeric_resolution",
          );
        return {
          id: i + 1,
          x: b.x0,
          y: b.y0,
          width,
          height,
          area,
          color: fcPick(x.palette, random),
        };
      });
      const adjacency: StainedGlassPanelLayoutOutput["adjacency"][number][] =
        [];
      for (let i = 0; i < bounds.length; i++)
        for (let j = i + 1; j < bounds.length; j++) {
          const a = bounds[i],
            b = bounds[j];
          let length = 0;
          if (a.x1 === b.x0 || b.x1 === a.x0)
            length = Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));
          if (a.y1 === b.y0 || b.y1 === a.y0)
            length = Math.max(
              length,
              Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0),
            );
          if (length > 0)
            adjacency.push({ a: i + 1, b: j + 1, sharedEdgeLength: length });
        }
      return {
        artworkOnly: true,
        cells,
        adjacency,
        totalArea,
        cellAreaSum: fcFinite(
          cells.reduce((s, c) => s + c.area, 0),
          "cellCount",
        ),
      };
    },
  );
export const stainedGlassPanelLayoutExample = {
  input: {
    width: 6,
    height: 4,
    cellCount: 2,
    palette: ["#d09030", "#3060b0"],
    seed: 42,
  },
  output: {
    artworkOnly: true,
    cells: [
      {
        id: 1,
        x: 0,
        y: 0,
        width: 4.0573973804712296,
        height: 4,
        area: 16.229589521884918,
        color: "#3060b0",
      },
      {
        id: 2,
        x: 4.0573973804712296,
        y: 0,
        width: 1.9426026195287704,
        height: 4,
        area: 7.770410478115082,
        color: "#d09030",
      },
    ],
    adjacency: [{ a: 1, b: 2, sharedEdgeLength: 4 }],
    totalArea: 24,
    cellAreaSum: 24,
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  StainedGlassPanelLayoutInput,
  StainedGlassPanelLayoutOutput
>;
export const stainedGlassPanelLayoutTool = createModelDefinition<
  StainedGlassPanelLayoutInput,
  StainedGlassPanelLayoutOutput
>({
  id: "random/stained-glass-panel-layout",
  title: "Random Stained Glass Panel Layout Generator",
  description:
    "Partition a rectangular artwork into colored nonoverlapping guillotine cells with middle-half random cuts, area evidence, and shared-edge adjacency.",
  inputSchema,
  outputSchema,
  execute: calculateStainedGlassPanelLayout,
});
export const runStainedGlassPanelLayout = stainedGlassPanelLayoutTool.execute;
export default stainedGlassPanelLayoutTool;
