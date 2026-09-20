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
import { runLeastCommonMultiple } from "../../number/least-common-multiple/tool.js";
import { calculateNoteValueDurationSecondsAtBpm } from "../../music/note-value-duration-seconds-at-bpm/tool.js";
import {
  objectSchema,
  arraySchema,
  countSchema,
  numberSchema,
  positiveSchema,
  rangeSchema,
  drawInteger,
  orderedRange,
  coreOutput,
  ensureOutput,
  type NumericRange,
} from "../m250-css-music-space-support.js";
export type PolyrhythmEventGridInput = {
  readonly pulseCounts: readonly NumericRange[];
  readonly mode: "polyrhythm" | "polymeter";
  readonly sharedCycleQuarterNotes: number;
  readonly beatsPerMinute: number;
  readonly seed?: number;
};
export type PolyrhythmEventGridOutput = {
  readonly mode: "polyrhythm" | "polymeter";
  readonly pulseCounts: readonly number[];
  readonly gridTicks: number;
  readonly cycleQuarterNotes: number;
  readonly cycleSeconds: number;
  readonly events: readonly {
    readonly layer: number;
    readonly pulse: number;
    readonly bar: number;
    readonly pulseInBar: number;
    readonly tick: number;
    readonly cycleFractionNumerator: number;
    readonly cycleFractionDenominator: number;
    readonly timeSeconds: number;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    pulseCounts: arraySchema(rangeSchema(countSchema(32)), 8, 2),
    mode: { type: "string", enum: ["polyrhythm", "polymeter"] },
    sharedCycleQuarterNotes: positiveSchema,
    beatsPerMinute: positiveSchema,
    seed: generatorSeedSchema,
  },
  ["pulseCounts", "mode", "sharedCycleQuarterNotes", "beatsPerMinute"],
);
export const outputSchema = objectSchema({
  mode: { type: "string", enum: ["polyrhythm", "polymeter"] },
  pulseCounts: arraySchema(countSchema(32), 8, 2),
  gridTicks: countSchema(4096),
  cycleQuarterNotes: positiveSchema,
  cycleSeconds: positiveSchema,
  events: arraySchema(
    objectSchema({
      layer: countSchema(7, 0),
      pulse: countSchema(4095, 0),
      bar: countSchema(4095, 0),
      pulseInBar: countSchema(31, 0),
      tick: countSchema(4095, 0),
      cycleFractionNumerator: countSchema(4095, 0),
      cycleFractionDenominator: countSchema(4096),
      timeSeconds: numberSchema,
    }),
    2048,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is PolyrhythmEventGridInput =>
  matchesModelInput(value, inputSchema);
export const calculatePolyrhythmEventGrid = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<PolyrhythmEventGridOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    input.pulseCounts.forEach((r, i) => orderedRange(r, "pulseCounts." + i));
    if (input.mode === "polymeter" && input.sharedCycleQuarterNotes !== 1)
      simpleError(
        "sharedCycleQuarterNotes",
        "Polymeter uses one quarter note per shared beat; set this field to 1.",
        "polymeter_beat_required",
      );
    const random = createGeneratorRandom(input.seed, context),
      pulseCounts = input.pulseCounts.map((range, i) =>
        drawInteger(range, random, "pulseCounts." + i),
      );
    let gridTicks = 1;
    for (const count of pulseCounts) {
      gridTicks = coreOutput(
        runLeastCommonMultiple({ first: gridTicks, second: count }),
      ).leastCommonMultiple;
      if (gridTicks > 4096)
        simpleError(
          "pulseCounts",
          "Least-common-multiple grid exceeds 4096 ticks.",
          "grid_resource_limit",
        );
    }
    const cycleQuarterNotes =
      input.mode === "polyrhythm" ? input.sharedCycleQuarterNotes : gridTicks;
    const cycleSeconds = calculateNoteValueDurationSecondsAtBpm({
      quarterNoteMultiples: cycleQuarterNotes,
      beatsPerMinute: input.beatsPerMinute,
    }).durationSeconds;
    if (cycleSeconds <= 0)
      simpleError(
        "beatsPerMinute",
        "Positive cycle duration underflowed representation.",
        "numeric_range",
      );
    const eventCount =
      input.mode === "polyrhythm"
        ? pulseCounts.reduce((a, b) => a + b, 0)
        : gridTicks * pulseCounts.length;
    if (eventCount > 2048)
      simpleError(
        "pulseCounts",
        "Generated event count exceeds 2048.",
        "event_resource_limit",
      );
    const events: PolyrhythmEventGridOutput["events"][number][] = [];
    pulseCounts.forEach((count, layer) => {
      const n = input.mode === "polyrhythm" ? count : gridTicks,
        step = input.mode === "polyrhythm" ? gridTicks / count : 1;
      for (let pulse = 0; pulse < n; pulse++) {
        const tick = pulse * step;
        events.push({
          layer,
          pulse,
          bar: Math.floor(pulse / count),
          pulseInBar: pulse % count,
          tick,
          cycleFractionNumerator: tick,
          cycleFractionDenominator: gridTicks,
          timeSeconds: cycleSeconds * (tick / gridTicks),
        });
      }
    });
    events.sort((a, b) => a.tick - b.tick || a.layer - b.layer);
    return toolSuccess(
      ensureOutput(
        {
          mode: input.mode,
          pulseCounts,
          gridTicks,
          cycleQuarterNotes,
          cycleSeconds,
          events,
          randomness: generatorReplay(input.seed, context),
        },
        outputSchema,
      ),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const polyrhythmEventGridExample = {
  input: {
    pulseCounts: [
      {
        minimum: 3,
        maximum: 3,
      },
      {
        minimum: 2,
        maximum: 2,
      },
    ],
    mode: "polyrhythm",
    sharedCycleQuarterNotes: 4,
    beatsPerMinute: 120,
    seed: 42,
  },
  output: {
    mode: "polyrhythm",
    pulseCounts: [3, 2],
    gridTicks: 6,
    cycleQuarterNotes: 4,
    cycleSeconds: 2,
    events: [
      {
        layer: 0,
        pulse: 0,
        bar: 0,
        pulseInBar: 0,
        tick: 0,
        cycleFractionNumerator: 0,
        cycleFractionDenominator: 6,
        timeSeconds: 0,
      },
      {
        layer: 1,
        pulse: 0,
        bar: 0,
        pulseInBar: 0,
        tick: 0,
        cycleFractionNumerator: 0,
        cycleFractionDenominator: 6,
        timeSeconds: 0,
      },
      {
        layer: 0,
        pulse: 1,
        bar: 0,
        pulseInBar: 1,
        tick: 2,
        cycleFractionNumerator: 2,
        cycleFractionDenominator: 6,
        timeSeconds: 0.6666666666666666,
      },
      {
        layer: 1,
        pulse: 1,
        bar: 0,
        pulseInBar: 1,
        tick: 3,
        cycleFractionNumerator: 3,
        cycleFractionDenominator: 6,
        timeSeconds: 1,
      },
      {
        layer: 0,
        pulse: 2,
        bar: 0,
        pulseInBar: 2,
        tick: 4,
        cycleFractionNumerator: 4,
        cycleFractionDenominator: 6,
        timeSeconds: 1.3333333333333333,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<PolyrhythmEventGridInput, PolyrhythmEventGridOutput>;
export const polyrhythmEventGridTool = createModelDefinition<
  PolyrhythmEventGridInput,
  PolyrhythmEventGridOutput
>({
  id: "random/polyrhythm-event-grid",
  title: "Random Polyrhythm Event Grid Generator",
  description:
    "Generate exact rational event grids for shared-cycle polyrhythms or shared-beat polymeters with delegated tempo timing.",
  inputSchema,
  outputSchema,
  execute: calculatePolyrhythmEventGrid,
});
export const runPolyrhythmEventGrid = polyrhythmEventGridTool.execute;
export default polyrhythmEventGridTool;
