import {
  createModelDefinition,
  matchesModelInput,
  inputObject,
  outputObject,
  array,
  positive,
  num,
  integer,
  object,
  label,
  run,
  choices,
  budget,
  distinct,
  finite,
  simpleError,
  type AcSeed,
  type AcReplay,
  type ToolExample,
  type ToolExecutionContext,
} from "../m500b-art-craft-common.js";
import { area } from "../m500b-art-craft-geometry.js";
type FanMotif = {
  readonly id: string;
  readonly width: number;
  readonly height: number;
  readonly leftEdge: string;
  readonly rightEdge: string;
};
export type PaperFanPanelPatternInput = AcSeed & {
  readonly width: number;
  readonly height: number;
  readonly panelCount: number;
  readonly motifs: readonly FanMotif[];
  readonly leftEdge: string;
  readonly rightEdge: string;
  readonly firstFold: "mountain" | "valley";
};
export type PaperFanPanelPatternOutput = AcReplay & {
  readonly panels: readonly {
    readonly index: number;
    readonly motifId: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly motifX: number;
    readonly motifY: number;
    readonly motifWidth: number;
    readonly motifHeight: number;
    readonly leftEdge: string;
    readonly rightEdge: string;
  }[];
  readonly folds: readonly {
    readonly x: number;
    readonly kind: "mountain" | "valley";
  }[];
  readonly sheetArea: number;
};
const fold = { type: "string", enum: ["mountain", "valley"] } as const;
export const inputSchema = inputObject({
  width: positive,
  height: positive,
  panelCount: integer(2, 32),
  motifs: array(
    object({
      id: label,
      width: positive,
      height: positive,
      leftEdge: label,
      rightEdge: label,
    }),
    16,
    1,
  ),
  leftEdge: label,
  rightEdge: label,
  firstFold: fold,
});
export const outputSchema = outputObject({
  panels: array(
    object({
      index: integer(0, 31),
      motifId: label,
      x: num,
      y: num,
      width: positive,
      height: positive,
      motifX: num,
      motifY: num,
      motifWidth: positive,
      motifHeight: positive,
      leftEdge: label,
      rightEdge: label,
    }),
    32,
    2,
  ),
  folds: array(object({ x: num, kind: fold }), 31, 1),
  sheetArea: positive,
});
const isInput = (v: unknown): v is PaperFanPanelPatternInput =>
  matchesModelInput(v, inputSchema);
export const calculatePaperFanPanelPattern = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<PaperFanPanelPatternOutput, "randomness"> => {
      distinct(
        x.motifs.map((m) => m.id),
        "motifs",
      );
      const width = x.width / x.panelCount,
        sheetArea = area(x.width, x.height);
      area(width, x.height);
      const selected: FanMotif[] = [],
        tick = budget();
      const search = (): boolean => {
        tick();
        const i = selected.length;
        if (i === x.panelCount)
          return selected[i - 1].rightEdge === x.rightEdge;
        const edge = i ? selected[i - 1].rightEdge : x.leftEdge;
        for (const m of choices(
          x.motifs.filter(
            (m) =>
              m.width <= width &&
              m.height <= x.height &&
              m.leftEdge === edge &&
              (i < x.panelCount - 1 || m.rightEdge === x.rightEdge),
          ),
          random,
        )) {
          selected.push(m);
          if (search()) return true;
          selected.pop();
        }
        return false;
      };
      if (!search())
        return simpleError(
          "motifs",
          "No panel sequence satisfies supplied edge tags and box fit.",
          "infeasible_panels",
        );
      const panels = selected.map((m, index) => ({
        index,
        motifId: m.id,
        x: finite(index * width),
        y: 0,
        width,
        height: x.height,
        motifX: finite(index * width + (width - m.width) / 2),
        motifY: finite((x.height - m.height) / 2),
        motifWidth: m.width,
        motifHeight: m.height,
        leftEdge: m.leftEdge,
        rightEdge: m.rightEdge,
      }));
      const folds = panels.slice(1).map((p, i) => ({
        x: p.x,
        kind:
          i % 2 === 0
            ? x.firstFold
            : x.firstFold === "mountain"
              ? ("valley" as const)
              : ("mountain" as const),
      }));
      return { panels, folds, sheetArea };
    },
  );
export const paperFanPanelPatternExample = {
  input: {
    width: 4,
    height: 3,
    panelCount: 2,
    motifs: [
      { id: "A", width: 2, height: 3, leftEdge: "x", rightEdge: "x" },
      { id: "B", width: 2, height: 3, leftEdge: "x", rightEdge: "x" },
    ],
    leftEdge: "x",
    rightEdge: "x",
    firstFold: "mountain",
    seed: 42,
  },
  output: {
    panels: [
      {
        index: 0,
        motifId: "B",
        x: 0,
        y: 0,
        width: 2,
        height: 3,
        motifX: 0,
        motifY: 0,
        motifWidth: 2,
        motifHeight: 3,
        leftEdge: "x",
        rightEdge: "x",
      },
      {
        index: 1,
        motifId: "A",
        x: 2,
        y: 0,
        width: 2,
        height: 3,
        motifX: 2,
        motifY: 0,
        motifWidth: 2,
        motifHeight: 3,
        leftEdge: "x",
        rightEdge: "x",
      },
    ],
    folds: [{ x: 2, kind: "mountain" }],
    sheetArea: 12,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<PaperFanPanelPatternInput, PaperFanPanelPatternOutput>;
export const paperFanPanelPatternTool = createModelDefinition<
  PaperFanPanelPatternInput,
  PaperFanPanelPatternOutput
>({
  id: "random/paper-fan-panel-pattern",
  title: "Random Paper Fan Panel Pattern Generator",
  description:
    "Build equal accordion panels from supplied motif boxes with matching caller edge tags and alternating fold labels; tag compatibility is not graphical continuity certification.",
  inputSchema,
  outputSchema,
  execute: calculatePaperFanPanelPattern,
});
export const runPaperFanPanelPattern = paperFanPanelPatternTool.execute;
export default paperFanPanelPatternTool;
