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
  strings,
  run,
  pick,
  distinct,
  finite,
  type AcSeed,
  type AcReplay,
  type ToolExample,
  type ToolExecutionContext,
} from "../m500b-art-craft-common.js";
import { area } from "../m500b-art-craft-geometry.js";
export type GreetingCardFoldLayoutInput = AcSeed & {
  readonly templates: readonly {
    readonly id: string;
    readonly width: number;
    readonly height: number;
    readonly panelRoles: readonly string[];
    readonly firstFold: "mountain" | "valley";
  }[];
};
export type GreetingCardFoldLayoutOutput = AcReplay & {
  readonly templateId: string;
  readonly panels: readonly {
    readonly role: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly area: number;
  }[];
  readonly folds: readonly {
    readonly x: number;
    readonly kind: "mountain" | "valley";
  }[];
  readonly sheetArea: number;
};
const fold = { type: "string", enum: ["mountain", "valley"] } as const;
export const inputSchema = inputObject({
  templates: array(
    object({
      id: label,
      width: positive,
      height: positive,
      panelRoles: array(label, 16, 2),
      firstFold: fold,
    }),
    16,
    1,
  ),
});
export const outputSchema = outputObject({
  templateId: label,
  panels: array(
    object({
      role: label,
      x: num,
      y: num,
      width: positive,
      height: positive,
      area: positive,
    }),
    16,
    2,
  ),
  folds: array(object({ x: num, kind: fold }), 15, 1),
  sheetArea: positive,
});
const isInput = (v: unknown): v is GreetingCardFoldLayoutInput =>
  matchesModelInput(v, inputSchema);
export const calculateGreetingCardFoldLayout = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<GreetingCardFoldLayoutOutput, "randomness"> => {
      distinct(
        x.templates.map((t) => t.id),
        "templates",
      );
      const t = pick(x.templates, random),
        width = t.width / t.panelRoles.length,
        sheetArea = area(t.width, t.height),
        panelArea = area(width, t.height);
      const panels = t.panelRoles.map((role, i) => ({
        role,
        x: finite(i * width),
        y: 0,
        width,
        height: t.height,
        area: panelArea,
      }));
      const folds = panels.slice(1).map((p, i) => ({
        x: p.x,
        kind:
          i % 2 === 0
            ? t.firstFold
            : t.firstFold === "mountain"
              ? ("valley" as const)
              : ("mountain" as const),
      }));
      return { templateId: t.id, panels, folds, sheetArea };
    },
  );
export const greetingCardFoldLayoutExample = {
  input: {
    templates: [
      {
        id: "half-fold",
        width: 12,
        height: 8,
        panelRoles: ["back", "front"],
        firstFold: "valley",
      },
    ],
    seed: 42,
  },
  output: {
    templateId: "half-fold",
    panels: [
      { role: "back", x: 0, y: 0, width: 6, height: 8, area: 48 },
      { role: "front", x: 6, y: 0, width: 6, height: 8, area: 48 },
    ],
    folds: [{ x: 6, kind: "valley" }],
    sheetArea: 96,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  GreetingCardFoldLayoutInput,
  GreetingCardFoldLayoutOutput
>;
export const greetingCardFoldLayoutTool = createModelDefinition<
  GreetingCardFoldLayoutInput,
  GreetingCardFoldLayoutOutput
>({
  id: "random/greeting-card-fold-layout",
  title: "Random Greeting Card Fold Layout Generator",
  description:
    "Draw a supplied equal-panel card template and return dimensioned roles and alternating fold labels in right/down sheet coordinates; print imposition is external.",
  inputSchema,
  outputSchema,
  execute: calculateGreetingCardFoldLayout,
});
export const runGreetingCardFoldLayout = greetingCardFoldLayoutTool.execute;
export default greetingCardFoldLayoutTool;
