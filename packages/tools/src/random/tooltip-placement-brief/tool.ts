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
  readonly rectangles: readonly {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  }[];
  readonly texts: readonly string[];
  readonly sides: readonly ("top" | "right" | "bottom" | "left")[];
  readonly count: number;
  readonly seed?: number;
};
export type Output = {
  readonly briefs: readonly {
    readonly trigger: {
      readonly x: number;
      readonly y: number;
      readonly width: number;
      readonly height: number;
    };
    readonly text: string;
    readonly preview: string;
    readonly side: "top" | "right" | "bottom" | "left";
    readonly anchor: { readonly x: number; readonly y: number };
  }[];
  readonly randomness: GeneratorReplay;
};
const rect = object({
    x: number,
    y: number,
    width: { type: "number", minimum: 0 },
    height: { type: "number", minimum: 0 },
  }),
  side = enumeration(["top", "right", "bottom", "left"]);
export const inputSchema = object(
  {
    rectangles: list(rect),
    texts: list(label),
    sides: list(side, 4),
    count: integer(1, 32),
    seed: generatorSeedSchema,
  },
  ["rectangles", "texts", "sides", "count"],
);
export const outputSchema = object({
  briefs: list(
    object({
      trigger: rect,
      text: label,
      preview: text,
      side,
      anchor: object({ x: number, y: number }),
    }),
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateTooltipPlacementBrief = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.sides, "sides");
    for (const r of input.rectangles) {
      finite(r.x + r.width, "rectangles");
      finite(r.y + r.height, "rectangles");
    }
    const random = createGeneratorRandom(input.seed, context),
      briefs = Array.from({ length: input.count }, () => {
        const selected = choose(input.rectangles, random),
          trigger = {
            x: finite(selected.x, "rectangles"),
            y: finite(selected.y, "rectangles"),
            width: finite(selected.width, "rectangles"),
            height: finite(selected.height, "rectangles"),
          },
          text = choose(input.texts, random),
          side = choose(input.sides, random),
          anchor = {
            x: finite(
              side === "left"
                ? trigger.x
                : side === "right"
                  ? trigger.x + trigger.width
                  : trigger.x + trigger.width / 2,
              "rectangles",
            ),
            y: finite(
              side === "top"
                ? trigger.y
                : side === "bottom"
                  ? trigger.y + trigger.height
                  : trigger.y + trigger.height / 2,
              "rectangles",
            ),
          };
        return { trigger, text, preview: preview(text, 32), side, anchor };
      });
    return toolSuccess(
      finish({ briefs, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const tooltipPlacementBriefExample = {
  input: {
    rectangles: [{ x: 2, y: 4, width: 6, height: 8 }],
    texts: ["Save changes", "Open details"],
    sides: ["top"],
    count: 1,
    seed: 42,
  },
  output: {
    briefs: [
      {
        trigger: { x: 2, y: 4, width: 6, height: 8 },
        text: "Save changes",
        preview: "Save changes",
        side: "top",
        anchor: { x: 5, y: 4 },
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const tooltipPlacementBriefTool = createModelDefinition<Input, Output>({
  id: "random/tooltip-placement-brief",
  title: "Random Tooltip Placement Brief Generator",
  description:
    "Draw caller trigger rectangles, text and side hints with exact side-center anchors and codepoint previews; collision resolution and viewport layout remain external.",
  inputSchema,
  outputSchema,
  execute: calculateTooltipPlacementBrief,
});
export const runTooltipPlacementBrief = tooltipPlacementBriefTool.execute;
export default tooltipPlacementBriefTool;
