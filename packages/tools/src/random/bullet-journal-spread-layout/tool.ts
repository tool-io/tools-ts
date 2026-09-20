import {
  createModelDefinition,
  matchesModelInput,
  inputObject,
  outputObject,
  array,
  positive,
  nonnegative,
  num,
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
import { area, type Rect } from "../m500b-art-craft-geometry.js";
type Side = "left" | "right";
type Kind = "tracker" | "note" | "calendar";
export type BulletJournalSpreadLayoutInput = AcSeed & {
  readonly pageWidth: number;
  readonly pageHeight: number;
  readonly gutter: number;
  readonly blocks: readonly {
    readonly id: string;
    readonly kind: Kind;
    readonly width: number;
    readonly height: number;
    readonly allowedSides: readonly Side[];
  }[];
};
export type BulletJournalSpreadLayoutOutput = AcReplay & {
  readonly placements: readonly (Rect & {
    readonly id: string;
    readonly kind: Kind;
    readonly side: Side;
    readonly area: number;
  })[];
  readonly spreadWidth: number;
  readonly spreadHeight: number;
  readonly paperArea: number;
};
const side = { type: "string", enum: ["left", "right"] } as const,
  kind = { type: "string", enum: ["tracker", "note", "calendar"] } as const;
export const inputSchema = inputObject({
  pageWidth: positive,
  pageHeight: positive,
  gutter: nonnegative,
  blocks: array(
    object({
      id: label,
      kind,
      width: positive,
      height: positive,
      allowedSides: array(side, 2, 1),
    }),
    16,
    1,
  ),
});
export const outputSchema = outputObject({
  placements: array(
    object({
      id: label,
      kind,
      side,
      x: num,
      y: num,
      width: positive,
      height: positive,
      area: positive,
    }),
    16,
    1,
  ),
  spreadWidth: positive,
  spreadHeight: positive,
  paperArea: positive,
});
const isInput = (v: unknown): v is BulletJournalSpreadLayoutInput =>
  matchesModelInput(v, inputSchema);
export const calculateBulletJournalSpreadLayout = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<BulletJournalSpreadLayoutOutput, "randomness"> => {
      distinct(
        x.blocks.map((b) => b.id),
        "blocks",
      );
      x.blocks.forEach((b) => distinct(b.allowedSides, "blocks"));
      const spreadWidth = finite(2 * x.pageWidth + x.gutter),
        paperArea = finite(2 * area(x.pageWidth, x.pageHeight)),
        used = { left: 0, right: 0 },
        placements: BulletJournalSpreadLayoutOutput["placements"][number][] =
          [],
        tick = budget();
      const search = (i: number): boolean => {
        tick();
        if (i === x.blocks.length) return true;
        const b = x.blocks[i];
        for (const side of choices(b.allowedSides, random)) {
          if (
            b.width > x.pageWidth ||
            finite(used[side] + b.height) > x.pageHeight
          )
            continue;
          const y = used[side];
          placements.push({
            id: b.id,
            kind: b.kind,
            side,
            x: side === "left" ? 0 : finite(x.pageWidth + x.gutter),
            y,
            width: b.width,
            height: b.height,
            area: area(b.width, b.height),
          });
          used[side] = finite(y + b.height);
          if (search(i + 1)) return true;
          used[side] = y;
          placements.pop();
        }
        return false;
      };
      if (!search(0))
        return simpleError(
          "blocks",
          "No side assignment fits vertically stacked blocks on both pages.",
          "infeasible_layout",
        );
      return { placements, spreadWidth, spreadHeight: x.pageHeight, paperArea };
    },
  );
export const bulletJournalSpreadLayoutExample = {
  input: {
    pageWidth: 4,
    pageHeight: 6,
    gutter: 2,
    blocks: [
      {
        id: "habit",
        kind: "tracker",
        width: 4,
        height: 2,
        allowedSides: ["left"],
      },
      {
        id: "ideas",
        kind: "note",
        width: 4,
        height: 3,
        allowedSides: ["right"],
      },
    ],
    seed: 42,
  },
  output: {
    placements: [
      {
        id: "habit",
        kind: "tracker",
        side: "left",
        x: 0,
        y: 0,
        width: 4,
        height: 2,
        area: 8,
      },
      {
        id: "ideas",
        kind: "note",
        side: "right",
        x: 6,
        y: 0,
        width: 4,
        height: 3,
        area: 12,
      },
    ],
    spreadWidth: 10,
    spreadHeight: 6,
    paperArea: 48,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  BulletJournalSpreadLayoutInput,
  BulletJournalSpreadLayoutOutput
>;
export const bulletJournalSpreadLayoutTool = createModelDefinition<
  BulletJournalSpreadLayoutInput,
  BulletJournalSpreadLayoutOutput
>({
  id: "random/bullet-journal-spread-layout",
  title: "Random Bullet Journal Spread Layout Generator",
  description:
    "Stack supplied tracker, note and calendar blocks on two dimensioned pages with gutter and legal-side constraints, without accessing journal content.",
  inputSchema,
  outputSchema,
  execute: calculateBulletJournalSpreadLayout,
});
export const runBulletJournalSpreadLayout =
  bulletJournalSpreadLayoutTool.execute;
export default bulletJournalSpreadLayoutTool;
