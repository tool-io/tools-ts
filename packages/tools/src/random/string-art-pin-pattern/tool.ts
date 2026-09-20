import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import { simpleError } from "../../core/simple.js";
import { calculateDistance } from "../../geometry/distance/tool.js";
import {
  fcArray,
  fcBudget,
  fcChoices,
  fcCounts,
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
export type StringArtPinPatternInput = FcSeed & {
  readonly pins: readonly {
    readonly id: string;
    readonly x: number;
    readonly y: number;
  }[];
  readonly connectionCount: number;
  readonly minimumDegree: number;
  readonly maximumDegree: number;
  readonly maximumPairRepetition: number;
};
export type StringArtPinPatternOutput = FcReplay & {
  readonly connections: readonly {
    readonly step: number;
    readonly from: string;
    readonly to: string;
    readonly length: number;
  }[];
  readonly degrees: readonly { readonly id: string; readonly degree: number }[];
  readonly pairCounts: readonly {
    readonly from: string;
    readonly to: string;
    readonly count: number;
  }[];
  readonly totalLength: number;
};
export const inputSchema = fcInput({
  pins: fcArray(fcObject({ id: fcId, x: fcNumber, y: fcNumber }), 12, 2),
  connectionCount: fcInteger(1, 64),
  minimumDegree: fcInteger(0, 128),
  maximumDegree: fcInteger(0, 128),
  maximumPairRepetition: fcInteger(1, 8),
});
export const outputSchema = fcOutput({
  connections: fcArray(
    fcObject({
      step: fcInteger(1, 64),
      from: fcId,
      to: fcId,
      length: { type: "number", minimum: 0 },
    }),
    64,
    1,
  ),
  degrees: fcArray(fcObject({ id: fcId, degree: fcInteger(0, 64) }), 12, 2),
  pairCounts: fcArray(
    fcObject({ from: fcId, to: fcId, count: fcInteger(1, 8) }),
    64,
    1,
  ),
  totalLength: { type: "number", minimum: 0 },
});
const isInput = (v: unknown): v is StringArtPinPatternInput =>
  matchesModelInput(v, inputSchema);
export const calculateStringArtPinPattern = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  fcRun(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<StringArtPinPatternOutput, "randomness"> => {
      fcUnique(
        x.pins.map((p) => p.id),
        "pins",
      );
      const n = x.pins.length,
        pairs: { a: number; b: number }[] = [];
      for (let a = 0; a < n; a++)
        for (let b = a + 1; b < n; b++) pairs.push({ a, b });
      if (
        x.minimumDegree > x.maximumDegree ||
        2 * x.connectionCount < n * x.minimumDegree ||
        2 * x.connectionCount > n * x.maximumDegree ||
        x.connectionCount > pairs.length * x.maximumPairRepetition ||
        x.minimumDegree > (n - 1) * x.maximumPairRepetition
      )
        simpleError(
          "constraints",
          "Connection count, degree bounds, and pair repetition are incompatible.",
          "infeasible_connections",
        );
      const degree = Array<number>(n).fill(0),
        multiplicities = Array<number>(pairs.length).fill(0),
        tick = fcBudget();
      const search = (index: number, remaining: number): boolean => {
        tick();
        if (remaining === 0) return degree.every((d) => d >= x.minimumDegree);
        if (
          index === pairs.length ||
          remaining > (pairs.length - index) * x.maximumPairRepetition
        )
          return false;
        const { a, b } = pairs[index],
          upper = Math.min(
            remaining,
            x.maximumPairRepetition,
            x.maximumDegree - degree[a],
            x.maximumDegree - degree[b],
          ),
          lower = Math.max(
            0,
            remaining - (pairs.length - index - 1) * x.maximumPairRepetition,
          );
        if (upper < lower) return false;
        for (const count of fcChoices(
          Array.from({ length: upper - lower + 1 }, (_, i) => lower + i),
          random,
        )) {
          multiplicities[index] = count;
          degree[a] += count;
          degree[b] += count;
          if (search(index + 1, remaining - count)) return true;
          degree[a] -= count;
          degree[b] -= count;
          multiplicities[index] = 0;
        }
        return false;
      };
      if (!search(0, x.connectionCount))
        simpleError(
          "constraints",
          "No connection multiset satisfies all supplied bounds.",
          "infeasible_connections",
        );
      const connections: StringArtPinPatternOutput["connections"][number][] =
          [],
        pairCounts: StringArtPinPatternOutput["pairCounts"][number][] = [];
      for (let i = 0; i < pairs.length; i++)
        if (multiplicities[i]) {
          const a = x.pins[pairs[i].a],
            b = x.pins[pairs[i].b],
            distance = calculateDistance({
              mode: "2d-euclidean",
              point1A: a.x,
              point1B: a.y,
              point2A: b.x,
              point2B: b.y,
            });
          if (distance === null)
            throw new Error("Validated Euclidean coordinates were rejected");
          const length = fcFinite(distance, "pins");
          pairCounts.push({ from: a.id, to: b.id, count: multiplicities[i] });
          for (let j = 0; j < multiplicities[i]; j++)
            connections.push({
              step: connections.length + 1,
              from: a.id,
              to: b.id,
              length,
            });
        }
      const counts = fcCounts(
        connections.flatMap((c) => [c.from, c.to]),
        x.pins.map((p) => p.id),
      );
      return {
        connections,
        pairCounts,
        degrees: counts.map((c) => ({ id: c.id, degree: c.count })),
        totalLength: fcFinite(
          connections.reduce((s, c) => s + c.length, 0),
          "pins",
        ),
      };
    },
  );
export const stringArtPinPatternExample = {
  input: {
    pins: [
      { id: "a", x: 0, y: 0 },
      { id: "b", x: 3, y: 0 },
      { id: "c", x: 3, y: 4 },
    ],
    connectionCount: 3,
    minimumDegree: 2,
    maximumDegree: 2,
    maximumPairRepetition: 1,
    seed: 42,
  },
  output: {
    connections: [
      { step: 1, from: "a", to: "b", length: 3 },
      { step: 2, from: "a", to: "c", length: 5 },
      { step: 3, from: "b", to: "c", length: 4 },
    ],
    degrees: [
      { id: "a", degree: 2 },
      { id: "b", degree: 2 },
      { id: "c", degree: 2 },
    ],
    pairCounts: [
      { from: "a", to: "b", count: 1 },
      { from: "a", to: "c", count: 1 },
      { from: "b", to: "c", count: 1 },
    ],
    totalLength: 12,
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  StringArtPinPatternInput,
  StringArtPinPatternOutput
>;
export const stringArtPinPatternTool = createModelDefinition<
  StringArtPinPatternInput,
  StringArtPinPatternOutput
>({
  id: "random/string-art-pin-pattern",
  title: "Random String Art Pin Pattern Generator",
  description:
    "Generate numbered pin connections with bounded multiset search, exact degree and repetition constraints, and full-precision lengths; a continuous threading walk is not required.",
  inputSchema,
  outputSchema,
  execute: calculateStringArtPinPattern,
});
export const runStringArtPinPattern = stringArtPinPatternTool.execute;
export default stringArtPinPatternTool;
