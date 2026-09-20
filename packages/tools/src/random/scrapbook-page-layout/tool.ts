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
  bool,
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
import {
  area,
  inside,
  overlap,
  type Rect,
} from "../m500b-art-craft-geometry.js";
type Role = "photo" | "caption" | "embellishment";
type Block = {
  readonly id: string;
  readonly role: Role;
  readonly width: number;
  readonly height: number;
  readonly allowOverlap: boolean;
};
type Slot = Rect & { readonly id: string; readonly role: Role };
export type ScrapbookPageLayoutInput = AcSeed & {
  readonly width: number;
  readonly height: number;
  readonly blocks: readonly Block[];
  readonly slots: readonly Slot[];
};
export type ScrapbookPageLayoutOutput = AcReplay & {
  readonly placements: readonly (Rect & {
    readonly id: string;
    readonly slotId: string;
    readonly role: Role;
    readonly allowOverlap: boolean;
    readonly area: number;
  })[];
  readonly pageArea: number;
  readonly summedBlockArea: number;
};
const role = {
  type: "string",
  enum: ["photo", "caption", "embellishment"],
} as const;
export const inputSchema = inputObject({
  width: positive,
  height: positive,
  blocks: array(
    object({
      id: label,
      role,
      width: positive,
      height: positive,
      allowOverlap: bool,
    }),
    12,
    1,
  ),
  slots: array(
    object({
      id: label,
      role,
      x: num,
      y: num,
      width: positive,
      height: positive,
    }),
    12,
    1,
  ),
});
export const outputSchema = outputObject({
  placements: array(
    object({
      id: label,
      slotId: label,
      role,
      x: num,
      y: num,
      width: positive,
      height: positive,
      allowOverlap: bool,
      area: positive,
    }),
    12,
    1,
  ),
  pageArea: positive,
  summedBlockArea: positive,
});
const isInput = (v: unknown): v is ScrapbookPageLayoutInput =>
  matchesModelInput(v, inputSchema);
export const calculateScrapbookPageLayout = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<ScrapbookPageLayoutOutput, "randomness"> => {
      distinct(
        x.blocks.map((b) => b.id),
        "blocks",
      );
      distinct(
        x.slots.map((s) => s.id),
        "slots",
      );
      const pageArea = area(x.width, x.height);
      for (const s of x.slots)
        if (!inside(s, x.width, x.height))
          return simpleError(
            "slots",
            "Every slot must fit the page.",
            "outside_page",
          );
      const placements: ScrapbookPageLayoutOutput["placements"][number][] = [],
        used = new Set<string>(),
        tick = budget();
      const search = (i: number): boolean => {
        tick();
        if (i === x.blocks.length) return true;
        const b = x.blocks[i];
        for (const s of choices(
          x.slots.filter(
            (s) =>
              s.role === b.role &&
              s.width >= b.width &&
              s.height >= b.height &&
              !used.has(s.id),
          ),
          random,
        )) {
          const p = {
            ...b,
            x: finite(s.x),
            y: finite(s.y),
            slotId: s.id,
            area: area(b.width, b.height),
          };
          if (
            placements.some(
              (a) => overlap(a, p) && !(a.allowOverlap && p.allowOverlap),
            )
          )
            continue;
          placements.push(p);
          used.add(s.id);
          if (search(i + 1)) return true;
          placements.pop();
          used.delete(s.id);
        }
        return false;
      };
      if (!search(0))
        return simpleError(
          "blocks",
          "No supplied role/slot assignment satisfies fit and overlap permissions.",
          "infeasible_layout",
        );
      return {
        placements,
        pageArea,
        summedBlockArea: finite(placements.reduce((s, p) => s + p.area, 0)),
      };
    },
  );
export const scrapbookPageLayoutExample = {
  input: {
    width: 4,
    height: 4,
    blocks: [
      { id: "photo", role: "photo", width: 2, height: 2, allowOverlap: false },
      {
        id: "caption",
        role: "caption",
        width: 2,
        height: 1,
        allowOverlap: false,
      },
    ],
    slots: [
      { id: "top", role: "photo", x: 0, y: 0, width: 2, height: 2 },
      { id: "below", role: "caption", x: 0, y: 2, width: 2, height: 1 },
    ],
    seed: 42,
  },
  output: {
    placements: [
      {
        id: "photo",
        role: "photo",
        width: 2,
        height: 2,
        allowOverlap: false,
        x: 0,
        y: 0,
        slotId: "top",
        area: 4,
      },
      {
        id: "caption",
        role: "caption",
        width: 2,
        height: 1,
        allowOverlap: false,
        x: 0,
        y: 2,
        slotId: "below",
        area: 2,
      },
    ],
    pageArea: 16,
    summedBlockArea: 6,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<ScrapbookPageLayoutInput, ScrapbookPageLayoutOutput>;
export const scrapbookPageLayoutTool = createModelDefinition<
  ScrapbookPageLayoutInput,
  ScrapbookPageLayoutOutput
>({
  id: "random/scrapbook-page-layout",
  title: "Random Scrapbook Page Layout Generator",
  description:
    "Assign supplied photo, caption and embellishment blocks to dimensioned compatible slots with explicit pairwise overlap permission and bounded randomized search.",
  inputSchema,
  outputSchema,
  execute: calculateScrapbookPageLayout,
});
export const runScrapbookPageLayout = scrapbookPageLayoutTool.execute;
export default scrapbookPageLayoutTool;
