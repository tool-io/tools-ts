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
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  generatedMusicSeconds,
  midiSchema,
} from "../music-sequence-construction.js";
import { calculateMidiClockUsPerQuarterPpqn } from "../../music/midi-clock-us-per-quarter-ppqn/tool.js";
import { SimpleToolError } from "../../core/simple.js";

export type DrumLane = {
  readonly id: string;
  readonly midiNote: number;
  readonly hitProbability: number;
};
export type DrumPatternInput = {
  readonly bars: number;
  readonly meterNumerator: number;
  readonly meterDenominator: number;
  readonly subdivisionsPerQuarter: number;
  readonly pulsesPerQuarter: number;
  readonly beatsPerMinute: number;
  readonly lanes: readonly DrumLane[];
  readonly minimumVelocity: number;
  readonly maximumVelocity: number;
  readonly seed?: number;
};
export type DrumPatternOutput = {
  readonly lanes: readonly DrumLane[];
  readonly velocityGrid: readonly (readonly number[])[];
  readonly hits: readonly {
    readonly laneId: string;
    readonly midiNote: number;
    readonly step: number;
    readonly tick: number;
    readonly onsetSeconds: number;
    readonly velocity: number;
  }[];
  readonly totalSteps: number;
  readonly totalTicks: number;
  readonly stepDurationSeconds: number;
  readonly durationSeconds: number;
  readonly microsecondsPerPulse: number;
  readonly randomness: GeneratorReplay;
};
const positiveTime = { type: "number", exclusiveMinimum: 0 } as const;
const laneSchema = {
  type: "array",
  minItems: 1,
  maxItems: 16,
  items: {
    type: "object",
    additionalProperties: false,
    properties: {
      id: { type: "string", minLength: 1, maxLength: 64 },
      midiNote: midiSchema,
      hitProbability: { type: "number", minimum: 0, maximum: 1 },
    },
    required: ["id", "midiNote", "hitProbability"],
  },
} as const;
const velocity = { type: "integer", minimum: 1, maximum: 127 } as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bars: { type: "integer", minimum: 1, maximum: 16 },
    meterNumerator: { type: "integer", minimum: 1, maximum: 16 },
    meterDenominator: { type: "integer", enum: [1, 2, 4, 8, 16] },
    subdivisionsPerQuarter: { type: "integer", minimum: 1, maximum: 24 },
    pulsesPerQuarter: { type: "integer", minimum: 1 },
    beatsPerMinute: positiveTime,
    lanes: laneSchema,
    minimumVelocity: velocity,
    maximumVelocity: velocity,
    seed: generatorSeedSchema,
  },
  required: [
    "bars",
    "meterNumerator",
    "meterDenominator",
    "subdivisionsPerQuarter",
    "pulsesPerQuarter",
    "beatsPerMinute",
    "lanes",
    "minimumVelocity",
    "maximumVelocity",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lanes: laneSchema,
    velocityGrid: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: {
        type: "array",
        minItems: 1,
        maxItems: 4096,
        items: { type: "integer", minimum: 0, maximum: 127 },
      },
    },
    hits: {
      type: "array",
      maxItems: 4096,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          laneId: { type: "string", minLength: 1, maxLength: 64 },
          midiNote: midiSchema,
          step: { type: "integer", minimum: 0, maximum: 4095 },
          tick: { type: "integer", minimum: 0 },
          onsetSeconds: { type: "number", minimum: 0 },
          velocity,
        },
        required: [
          "laneId",
          "midiNote",
          "step",
          "tick",
          "onsetSeconds",
          "velocity",
        ],
      },
    },
    totalSteps: { type: "integer", minimum: 1, maximum: 4096 },
    totalTicks: { type: "integer", minimum: 1 },
    stepDurationSeconds: positiveTime,
    durationSeconds: positiveTime,
    microsecondsPerPulse: positiveTime,
    randomness: generatorReplaySchema,
  },
  required: [
    "lanes",
    "velocityGrid",
    "hits",
    "totalSteps",
    "totalTicks",
    "stepDurationSeconds",
    "durationSeconds",
    "microsecondsPerPulse",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is DrumPatternInput =>
  matchesModelInput(input, inputSchema);
export const calculateDrumPattern = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<DrumPatternOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.maximumVelocity < input.minimumVelocity)
      simpleError(
        "maximumVelocity",
        "Velocity bounds must be ordered.",
        "invalid_velocity_range",
      );
    if (new Set(input.lanes.map((lane) => lane.id)).size !== input.lanes.length)
      simpleError("lanes", "Lane IDs must be distinct.", "duplicate_lane_ids");
    const stepsPerBar =
      (input.meterNumerator * 4 * input.subdivisionsPerQuarter) /
      input.meterDenominator;
    if (!Number.isSafeInteger(stepsPerBar) || stepsPerBar < 1)
      simpleError(
        "subdivisionsPerQuarter",
        "The grid must divide each complete bar into an integer number of steps.",
        "nonintegral_bar_grid",
      );
    const totalSteps = input.bars * stepsPerBar;
    if (totalSteps * input.lanes.length > 4096)
      simpleError(
        "lanes",
        "At most 4,096 lane-step cells are supported.",
        "resource_limit",
      );
    if (
      !Number.isSafeInteger(input.pulsesPerQuarter) ||
      input.pulsesPerQuarter % input.subdivisionsPerQuarter !== 0
    )
      simpleError(
        "pulsesPerQuarter",
        "PPQN must be a safe multiple of subdivisions per quarter.",
        "nonintegral_pulse_grid",
      );
    const pulsesPerStep = input.pulsesPerQuarter / input.subdivisionsPerQuarter,
      tickCount = BigInt(totalSteps) * BigInt(pulsesPerStep);
    if (tickCount > BigInt(Number.MAX_SAFE_INTEGER))
      simpleError(
        "pulsesPerQuarter",
        "The complete tick span must be a safe integer.",
        "unsafe_tick_total",
      );
    const durationSeconds = generatedMusicSeconds(
        totalSteps / input.subdivisionsPerQuarter,
        input.beatsPerMinute,
      ),
      stepDurationSeconds = generatedMusicSeconds(
        1 / input.subdivisionsPerQuarter,
        input.beatsPerMinute,
      );
    const clock = (): number => {
      try {
        const value = calculateMidiClockUsPerQuarterPpqn({
          beatsPerMinute: input.beatsPerMinute,
          pulsesPerQuarter: input.pulsesPerQuarter,
        }).microsecondsPerPulse;
        if (!(value > 0))
          return simpleError(
            "beatsPerMinute",
            "Clock pulse intervals must remain representable.",
            "numeric_overflow",
          );
        return value;
      } catch (error) {
        if (error instanceof SimpleToolError)
          return simpleError(
            "beatsPerMinute",
            "Clock timing must remain positive and finite.",
            "numeric_overflow",
          );
        throw error;
      }
    };
    const microsecondsPerPulse = clock(),
      random = createGeneratorRandom(input.seed, context);
    const velocityGrid = input.lanes.map((lane) =>
      Array.from({ length: totalSteps }, () =>
        random.unit() < lane.hitProbability
          ? random.integer(input.minimumVelocity, input.maximumVelocity)
          : 0,
      ),
    );
    const hits: {
      laneId: string;
      midiNote: number;
      step: number;
      tick: number;
      onsetSeconds: number;
      velocity: number;
    }[] = [];
    for (let step = 0; step < totalSteps; step += 1)
      input.lanes.forEach((lane, index) => {
        const velocity = velocityGrid[index][step];
        if (velocity > 0)
          hits.push({
            laneId: lane.id,
            midiNote: lane.midiNote,
            step,
            tick: step * pulsesPerStep,
            onsetSeconds: generatedMusicSeconds(
              step / input.subdivisionsPerQuarter,
              input.beatsPerMinute,
            ),
            velocity,
          });
      });
    return toolSuccess({
      lanes: input.lanes.map((lane) => ({ ...lane })),
      velocityGrid,
      hits,
      totalSteps,
      totalTicks: Number(tickCount),
      stepDurationSeconds,
      durationSeconds,
      microsecondsPerPulse,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const drumPatternExample = {
  input: {
    bars: 1,
    meterNumerator: 4,
    meterDenominator: 4,
    subdivisionsPerQuarter: 2,
    pulsesPerQuarter: 24,
    beatsPerMinute: 120,
    lanes: [
      {
        id: "kick",
        midiNote: 36,
        hitProbability: 0.6,
      },
      {
        id: "snare",
        midiNote: 38,
        hitProbability: 0.3,
      },
    ],
    minimumVelocity: 60,
    maximumVelocity: 100,
    seed: 42,
  },
  output: {
    lanes: [
      {
        id: "kick",
        midiNote: 36,
        hitProbability: 0.6,
      },
      {
        id: "snare",
        midiNote: 38,
        hitProbability: 0.3,
      },
    ],
    velocityGrid: [
      [0, 94, 0, 81, 85, 0, 70, 0],
      [0, 0, 80, 0, 0, 79, 0, 84],
    ],
    hits: [
      {
        laneId: "kick",
        midiNote: 36,
        step: 1,
        tick: 12,
        onsetSeconds: 0.25,
        velocity: 94,
      },
      {
        laneId: "snare",
        midiNote: 38,
        step: 2,
        tick: 24,
        onsetSeconds: 0.5,
        velocity: 80,
      },
      {
        laneId: "kick",
        midiNote: 36,
        step: 3,
        tick: 36,
        onsetSeconds: 0.75,
        velocity: 81,
      },
      {
        laneId: "kick",
        midiNote: 36,
        step: 4,
        tick: 48,
        onsetSeconds: 1,
        velocity: 85,
      },
      {
        laneId: "snare",
        midiNote: 38,
        step: 5,
        tick: 60,
        onsetSeconds: 1.25,
        velocity: 79,
      },
      {
        laneId: "kick",
        midiNote: 36,
        step: 6,
        tick: 72,
        onsetSeconds: 1.5,
        velocity: 70,
      },
      {
        laneId: "snare",
        midiNote: 38,
        step: 7,
        tick: 84,
        onsetSeconds: 1.75,
        velocity: 84,
      },
    ],
    totalSteps: 8,
    totalTicks: 96,
    stepDurationSeconds: 0.25,
    durationSeconds: 2,
    microsecondsPerPulse: 20833.333333333332,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<DrumPatternInput, DrumPatternOutput>;
export const drumPatternTool = createModelDefinition<
  DrumPatternInput,
  DrumPatternOutput
>({
  id: "random/drum-pattern",
  title: "Random Quantized Drum Pattern Generator",
  description:
    "Generate caller-defined percussion lanes on a fixed integer subdivision grid with Bernoulli hits, inclusive MIDI velocities, explicit rests and delegated quarter-tempo/PPQN timing; no audio, MIDI file or percussion-map assumptions.",
  inputSchema,
  outputSchema,
  execute: calculateDrumPattern,
});
export const runDrumPattern = drumPatternTool.execute;
export default drumPatternTool;
