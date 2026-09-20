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
  pick,
  distinct,
  simpleError,
  type AcSeed,
  type AcReplay,
  type ToolExample,
  type ToolExecutionContext,
} from "../m500b-art-craft-common.js";
import { area } from "../m500b-art-craft-geometry.js";
type ZineTemplate = {
  readonly id: string;
  readonly pageCount: number;
  readonly sheetWidth: number;
  readonly sheetHeight: number;
  readonly binding: "left" | "right";
};
export type ZinePageImpositionPlanInput = AcSeed & {
  readonly contents: readonly string[];
  readonly templates: readonly ZineTemplate[];
};
type ZinePanel = {
  readonly page: number;
  readonly content: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};
export type ZinePageImpositionPlanOutput = AcReplay & {
  readonly templateId: string;
  readonly readingOrder: readonly string[];
  readonly sheets: readonly {
    readonly sheetIndex: number;
    readonly front: readonly ZinePanel[];
    readonly back: readonly ZinePanel[];
  }[];
  readonly sheetArea: number;
  readonly duplexConvention: string;
};
const binding = { type: "string", enum: ["left", "right"] } as const,
  panel = object({
    page: integer(1, 32),
    content: label,
    x: num,
    y: num,
    width: positive,
    height: positive,
  });
export const inputSchema = inputObject({
  contents: array(label, 32, 4),
  templates: array(
    object({
      id: label,
      pageCount: integer(4, 32),
      sheetWidth: positive,
      sheetHeight: positive,
      binding,
    }),
    16,
    1,
  ),
});
export const outputSchema = outputObject({
  templateId: label,
  readingOrder: array(label, 32, 4),
  sheets: array(
    object({
      sheetIndex: integer(0, 7),
      front: array(panel, 2, 2),
      back: array(panel, 2, 2),
    }),
    8,
    1,
  ),
  sheetArea: positive,
  duplexConvention: {
    type: "string",
    const: "short-edge flip; each face viewed upright",
  },
});
const isInput = (v: unknown): v is ZinePageImpositionPlanInput =>
  matchesModelInput(v, inputSchema);
export const calculateZinePageImpositionPlan = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<ZinePageImpositionPlanOutput, "randomness"> => {
      distinct(
        x.templates.map((t) => t.id),
        "templates",
      );
      distinct(x.contents, "contents");
      if (x.templates.some((t) => t.pageCount % 4 !== 0))
        return simpleError(
          "templates",
          "Supported saddle signatures require page counts divisible by four.",
          "unsupported_signature",
        );
      const available = x.templates.filter(
        (t) => t.pageCount === x.contents.length,
      );
      if (available.length === 0)
        return simpleError(
          "contents",
          "Content count must exactly match a supplied supported template.",
          "incompatible_template",
        );
      const t = pick(available, random),
        readingOrder = random.shuffle(x.contents),
        width = t.sheetWidth / 2,
        sheetArea = area(t.sheetWidth, t.sheetHeight);
      area(width, t.sheetHeight);
      const spread = (pages: readonly number[]): ZinePanel[] => {
        const ordered = t.binding === "right" ? [...pages].reverse() : pages;
        return ordered.map((page, index) => ({
          page,
          content: readingOrder[page - 1],
          x: index * width,
          y: 0,
          width,
          height: t.sheetHeight,
        }));
      };
      const sheets = Array.from(
        { length: t.pageCount / 4 },
        (_, sheetIndex) => ({
          sheetIndex,
          front: spread([t.pageCount - 2 * sheetIndex, 1 + 2 * sheetIndex]),
          back: spread([2 + 2 * sheetIndex, t.pageCount - 1 - 2 * sheetIndex]),
        }),
      );
      return {
        templateId: t.id,
        readingOrder,
        sheets,
        sheetArea,
        duplexConvention: "short-edge flip; each face viewed upright",
      };
    },
  );
export const zinePageImpositionPlanExample = {
  input: {
    contents: ["A", "B", "C", "D"],
    templates: [
      {
        id: "four-page",
        pageCount: 4,
        sheetWidth: 12,
        sheetHeight: 8,
        binding: "left",
      },
    ],
    seed: 42,
  },
  output: {
    templateId: "four-page",
    readingOrder: ["A", "D", "C", "B"],
    sheets: [
      {
        sheetIndex: 0,
        front: [
          { page: 4, content: "B", x: 0, y: 0, width: 6, height: 8 },
          { page: 1, content: "A", x: 6, y: 0, width: 6, height: 8 },
        ],
        back: [
          { page: 2, content: "D", x: 0, y: 0, width: 6, height: 8 },
          { page: 3, content: "C", x: 6, y: 0, width: 6, height: 8 },
        ],
      },
    ],
    sheetArea: 96,
    duplexConvention: "short-edge flip; each face viewed upright",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  ZinePageImpositionPlanInput,
  ZinePageImpositionPlanOutput
>;
export const zinePageImpositionPlanTool = createModelDefinition<
  ZinePageImpositionPlanInput,
  ZinePageImpositionPlanOutput
>({
  id: "random/zine-page-imposition-plan",
  title: "Random Zine Page Imposition Plan Generator",
  description:
    "Shuffle supplied content into reviewed two-up saddle signatures and return upright face-on front/back page order for declared binding and duplex convention; printer feed handling is external.",
  inputSchema,
  outputSchema,
  execute: calculateZinePageImpositionPlan,
});
export const runZinePageImpositionPlan = zinePageImpositionPlanTool.execute;
export default zinePageImpositionPlanTool;
