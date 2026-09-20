import type { ToolExecutionContext } from "../../core/definition.js";
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
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { budget as fixtureBudget } from "../m500b-web-json-json.js";
import {
  object,
  array,
  text,
  bounded,
  integer,
  boolean,
  choice,
} from "../m500b-web-json-schema.js";
import { pick } from "../m500b-web-json-json.js";
import { calculateRangeParser } from "../../http/range-parser/tool.js";
export type HttpRangeOverlapDatasetInput = {
  readonly resourceLength: number;
  readonly forms: readonly ("closed" | "open" | "suffix")[];
  readonly requestCount: number;
  readonly seed?: number;
};
export type HttpRangeOverlapDatasetOutput = {
  readonly ranges: readonly {
    readonly header: string;
    readonly kind: string;
    readonly satisfiable: boolean;
    readonly start: number | null;
    readonly end: number | null;
  }[];
  readonly overlaps: readonly {
    readonly left: number;
    readonly right: number;
    readonly start: number;
    readonly end: number;
  }[];
  readonly disjointPairs: readonly (readonly number[])[];
  readonly randomness: GeneratorReplay;
};
const nullableInteger = { anyOf: [integer, { type: "null" }] } as const;
export const inputSchema = object(
  {
    resourceLength: { type: "integer", minimum: 0 },
    forms: array(choice(["closed", "open", "suffix"]), 3, 1),
    requestCount: bounded(2, 16),
    seed: generatorSeedSchema,
  },
  ["resourceLength", "forms", "requestCount"],
);
export const outputSchema = object({
  ranges: array(
    object({
      header: text,
      kind: text,
      satisfiable: boolean,
      start: nullableInteger,
      end: nullableInteger,
    }),
    16,
    2,
  ),
  overlaps: array(
    object({ left: integer, right: integer, start: integer, end: integer }),
    120,
  ),
  disjointPairs: array(array(integer, 2, 2), 120),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is HttpRangeOverlapDatasetInput =>
  matchesModelInput(input, inputSchema);
export const calculateHttpRangeOverlapDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<HttpRangeOverlapDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    fixtureBudget(JSON.stringify(input).length, 512, "", 900000);
    if (!Number.isSafeInteger(input.resourceLength + 3))
      simpleError(
        "resourceLength",
        "Boundary arithmetic must remain safe.",
        "unsafe_range",
      );
    const random = createGeneratorRandom(input.seed, context),
      ranges = Array.from({ length: input.requestCount }, () => {
        const form = pick(input.forms, random),
          a = random.integer(0, input.resourceLength),
          b =
            form === "closed" ? random.integer(a, input.resourceLength + 2) : 0;
        const header =
            form === "suffix"
              ? "bytes=-" + a
              : "bytes=" + a + "-" + (form === "closed" ? b : ""),
          range = calculateRangeParser({ rangeHeader: header }).range;
        let start: number,
          end = input.resourceLength - 1;
        const kind = range.kind;
        if (typeof kind !== "string") throw new Error("Expected range kind");
        if (kind === "suffix") {
          if (typeof range.length !== "number")
            throw new Error("Expected suffix length");
          start = Math.max(0, input.resourceLength - range.length);
          if (range.length === 0) start = input.resourceLength;
        } else {
          if (typeof range.start !== "number")
            throw new Error("Expected start");
          start = range.start;
          if (kind === "closed") {
            if (typeof range.end !== "number") throw new Error("Expected end");
            end = Math.min(end, range.end);
          }
        }
        const satisfiable = input.resourceLength > 0 && start <= end;
        return {
          header,
          kind,
          satisfiable,
          start: satisfiable ? start : null,
          end: satisfiable ? end : null,
        };
      });
    const overlaps: {
        left: number;
        right: number;
        start: number;
        end: number;
      }[] = [],
      disjointPairs: number[][] = [];
    for (let i = 0; i < ranges.length; i++)
      for (let j = i + 1; j < ranges.length; j++) {
        const a = ranges[i],
          b = ranges[j];
        if (
          !a ||
          !b ||
          a.start === null ||
          a.end === null ||
          b.start === null ||
          b.end === null
        )
          continue;
        const start = Math.max(a.start, b.start),
          end = Math.min(a.end, b.end);
        if (start <= end) overlaps.push({ left: i, right: j, start, end });
        else disjointPairs.push([i, j]);
      }
    return toolSuccess({
      ranges,
      overlaps,
      disjointPairs,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const httpRangeOverlapDatasetExample = {
  input: { resourceLength: 10, forms: ["closed"], requestCount: 2, seed: 42 },
  output: {
    ranges: [
      {
        header: "bytes=4-11",
        kind: "closed",
        satisfiable: true,
        start: 4,
        end: 9,
      },
      {
        header: "bytes=1-7",
        kind: "closed",
        satisfiable: true,
        start: 1,
        end: 7,
      },
    ],
    overlaps: [{ left: 0, right: 1, start: 4, end: 7 }],
    disjointPairs: [],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  HttpRangeOverlapDatasetInput,
  HttpRangeOverlapDatasetOutput
>;
export const httpRangeOverlapDatasetTool = createModelDefinition<
  HttpRangeOverlapDatasetInput,
  HttpRangeOverlapDatasetOutput
>({
  id: "random/http-range-overlap-dataset",
  title: "Random HTTP Range Overlap Dataset Generator",
  description:
    "Construct single byte ranges, resolve inclusive intervals against a supplied resource length, and label exact overlap and disjoint pairs.",
  inputSchema,
  outputSchema,
  execute: calculateHttpRangeOverlapDataset,
});
export const runHttpRangeOverlapDataset = httpRangeOverlapDatasetTool.execute;
export default httpRangeOverlapDatasetTool;
