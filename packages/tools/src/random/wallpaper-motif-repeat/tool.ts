import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import { simpleError } from "../../core/simple.js";
import { calculateRotate90 } from "../../matrix/rotate-90/tool.js";
import { calculateFlipVertical } from "../../matrix/flip-vertical/tool.js";
import {
  fcArray,
  fcBoolean,
  fcBudget,
  fcChoices,
  fcCounts,
  fcCountSchema,
  fcFinite,
  fcId,
  fcInput,
  fcInteger,
  fcNumber,
  fcObject,
  fcOutput,
  fcRun,
  fcUnique,
  matchesModelInput,
  type FcReplay,
  type FcSeed,
} from "../m250-fiction-craft-common.js";
export type WallpaperMotif = {
  readonly id: string;
  readonly matrix: readonly (readonly number[])[];
  readonly quarterTurns: readonly number[];
  readonly allowReflection: boolean;
};
export type WallpaperMotifRepeatInput = FcSeed & {
  readonly rows: number;
  readonly columns: number;
  readonly motifs: readonly WallpaperMotif[];
  readonly origin: { readonly x: number; readonly y: number };
  readonly columnVector: { readonly x: number; readonly y: number };
  readonly rowVector: { readonly x: number; readonly y: number };
  readonly boundaryPolicy: "free" | "seamless";
};
export type WallpaperMotifRepeatOutput = FcReplay & {
  readonly placements: readonly {
    readonly row: number;
    readonly column: number;
    readonly motifId: string;
    readonly quarterTurns: number;
    readonly reflected: boolean;
    readonly x: number;
    readonly y: number;
    readonly matrix: readonly (readonly number[])[];
  }[];
  readonly repetitionCounts: readonly {
    readonly id: string;
    readonly count: number;
  }[];
  readonly latticeDeterminant: number;
  readonly seamless: boolean;
};
const matrixSchema = fcArray(fcArray(fcNumber, 8, 1), 8, 1),
  vectorSchema = fcObject({ x: fcNumber, y: fcNumber });
export const inputSchema = fcInput({
  rows: fcInteger(1, 16),
  columns: fcInteger(1, 16),
  motifs: fcArray(
    fcObject({
      id: fcId,
      matrix: matrixSchema,
      quarterTurns: fcArray(fcInteger(0, 3), 4, 1),
      allowReflection: fcBoolean,
    }),
    16,
    1,
  ),
  origin: vectorSchema,
  columnVector: vectorSchema,
  rowVector: vectorSchema,
  boundaryPolicy: {
    type: "string",
    enum: ["free", "seamless"],
    description:
      "Seamless requires exact transformed matrix-border equality between neighbors and across both repeat seams.",
  },
});
export const outputSchema = fcOutput({
  placements: fcArray(
    fcObject({
      row: fcInteger(0, 15),
      column: fcInteger(0, 15),
      motifId: fcId,
      quarterTurns: fcInteger(0, 3),
      reflected: fcBoolean,
      x: fcNumber,
      y: fcNumber,
      matrix: matrixSchema,
    }),
    256,
    1,
  ),
  repetitionCounts: fcCountSchema,
  latticeDeterminant: fcNumber,
  seamless: fcBoolean,
});
const isInput = (v: unknown): v is WallpaperMotifRepeatInput =>
  matchesModelInput(v, inputSchema);
type Variant = {
  readonly motifId: string;
  readonly quarterTurns: number;
  readonly reflected: boolean;
  readonly matrix: readonly (readonly number[])[];
};
const edgesEqual = (a: readonly number[], b: readonly number[]): boolean =>
  a.length === b.length && a.every((v, i) => v === b[i]);
const west = (v: Variant): readonly number[] => v.matrix.map((r) => r[0]);
const east = (v: Variant): readonly number[] =>
  v.matrix.map((r) => r[r.length - 1]);
const north = (v: Variant): readonly number[] => v.matrix[0];
const south = (v: Variant): readonly number[] => v.matrix[v.matrix.length - 1];
export const calculateWallpaperMotifRepeat = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  fcRun(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<WallpaperMotifRepeatOutput, "randomness"> => {
      fcUnique(
        x.motifs.map((m) => m.id),
        "motifs",
      );
      const latticeDeterminant = fcFinite(
        x.columnVector.x * x.rowVector.y - x.columnVector.y * x.rowVector.x,
        "columnVector",
      );
      if (latticeDeterminant === 0)
        simpleError(
          "columnVector",
          "Lattice vectors must have a representably nonzero determinant.",
          "degenerate_lattice",
        );
      const variants: Variant[] = x.motifs.flatMap((m) => {
        fcUnique(m.quarterTurns, "motifs." + m.id + ".quarterTurns");
        if (m.matrix.some((r) => r.length !== m.matrix.length))
          simpleError(
            "motifs",
            "Each motif grid must be square.",
            "invalid_matrix",
          );
        return (m.allowReflection ? [false, true] : [false]).flatMap(
          (reflected) =>
            m.quarterTurns.map((quarterTurns) => {
              let matrix: readonly (readonly number[])[] = reflected
                ? calculateFlipVertical({ matrix: m.matrix }).flipped
                : m.matrix.map((r) => [...r]);
              for (let t = 0; t < quarterTurns; t++)
                matrix = calculateRotate90({ matrix }).rotated;
              return { motifId: m.id, quarterTurns, reflected, matrix };
            }),
        );
      });
      const placed: Variant[] = [],
        tick = fcBudget();
      const search = (): boolean => {
        tick();
        if (placed.length === x.rows * x.columns) return true;
        const r = Math.floor(placed.length / x.columns),
          c = placed.length % x.columns;
        const candidates = variants.filter((v) => {
          if (x.boundaryPolicy === "free") return true;
          if (c > 0 && !edgesEqual(east(placed[placed.length - 1]), west(v)))
            return false;
          if (
            r > 0 &&
            !edgesEqual(south(placed[(r - 1) * x.columns + c]), north(v))
          )
            return false;
          if (
            c === x.columns - 1 &&
            !edgesEqual(east(v), west(c === 0 ? v : placed[r * x.columns]))
          )
            return false;
          if (
            r === x.rows - 1 &&
            !edgesEqual(south(v), north(r === 0 ? v : placed[c]))
          )
            return false;
          return true;
        });
        for (const v of fcChoices(candidates, random)) {
          placed.push(v);
          if (search()) return true;
          placed.pop();
        }
        return false;
      };
      if (!search())
        simpleError(
          "motifs",
          "No repeat satisfies the supplied matrix-border continuity constraints.",
          "infeasible_repeat",
        );
      const placements = placed.map((v, i) => {
        const row = Math.floor(i / x.columns),
          column = i % x.columns;
        return {
          ...v,
          row,
          column,
          x: fcFinite(
            x.origin.x + column * x.columnVector.x + row * x.rowVector.x,
            "columnVector",
          ),
          y: fcFinite(
            x.origin.y + column * x.columnVector.y + row * x.rowVector.y,
            "rowVector",
          ),
        };
      });
      return {
        placements,
        repetitionCounts: fcCounts(
          placements.map((p) => p.motifId),
          x.motifs.map((m) => m.id),
        ),
        latticeDeterminant,
        seamless: x.boundaryPolicy === "seamless",
      };
    },
  );
export const wallpaperMotifRepeatExample = {
  input: {
    rows: 2,
    columns: 2,
    motifs: [
      {
        id: "checker",
        matrix: [
          [1, 2],
          [2, 1],
        ],
        quarterTurns: [0, 1],
        allowReflection: false,
      },
    ],
    origin: { x: 10, y: 20 },
    columnVector: { x: 3, y: 1 },
    rowVector: { x: 1, y: 2 },
    boundaryPolicy: "seamless",
    seed: 42,
  },
  output: {
    placements: [
      {
        row: 0,
        column: 0,
        motifId: "checker",
        quarterTurns: 1,
        reflected: false,
        x: 10,
        y: 20,
        matrix: [
          [2, 1],
          [1, 2],
        ],
      },
      {
        row: 0,
        column: 1,
        motifId: "checker",
        quarterTurns: 0,
        reflected: false,
        x: 13,
        y: 21,
        matrix: [
          [1, 2],
          [2, 1],
        ],
      },
      {
        row: 1,
        column: 0,
        motifId: "checker",
        quarterTurns: 0,
        reflected: false,
        x: 11,
        y: 22,
        matrix: [
          [1, 2],
          [2, 1],
        ],
      },
      {
        row: 1,
        column: 1,
        motifId: "checker",
        quarterTurns: 1,
        reflected: false,
        x: 14,
        y: 23,
        matrix: [
          [2, 1],
          [1, 2],
        ],
      },
    ],
    repetitionCounts: [{ id: "checker", count: 4 }],
    latticeDeterminant: 5,
    seamless: true,
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  WallpaperMotifRepeatInput,
  WallpaperMotifRepeatOutput
>;
export const wallpaperMotifRepeatTool = createModelDefinition<
  WallpaperMotifRepeatInput,
  WallpaperMotifRepeatOutput
>({
  id: "random/wallpaper-motif-repeat",
  title: "Random Wallpaper Motif Repeat Generator",
  description:
    "Arrange supplied square motifs on an explicit lattice with legal transforms and optional exact matrix-border continuity across neighbors and repeat seams.",
  inputSchema,
  outputSchema,
  execute: calculateWallpaperMotifRepeat,
});
export const runWallpaperMotifRepeat = wallpaperMotifRepeatTool.execute;
export default wallpaperMotifRepeatTool;
