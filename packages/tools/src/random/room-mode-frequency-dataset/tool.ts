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
import { calculateAxialModeFrequency } from "../../acoustics/axial-mode-frequency/tool.js";
import { calculateTangentialModeFrequency } from "../../acoustics/tangential-mode-frequency/tool.js";
import { calculateObliqueModeFrequency } from "../../acoustics/oblique-mode-frequency/tool.js";
import {
  objectSchema,
  arraySchema,
  countSchema,
  positiveSchema,
  rangeSchema,
  drawReal,
  drawInteger,
  orderedRange,
  requireDistinct,
  ensureOutput,
  type NumericRange,
} from "../m250-css-music-space-support.js";
export type RoomModeKind = "axial" | "tangential" | "oblique";
export type RoomModeFrequencyDatasetInput = {
  readonly count: number;
  readonly lengthXMeters: NumericRange;
  readonly lengthYMeters: NumericRange;
  readonly lengthZMeters: NumericRange;
  readonly order: NumericRange;
  readonly soundSpeedMetersPerSecond: number;
  readonly kinds: readonly RoomModeKind[];
  readonly seed?: number;
};
export type RoomModeFrequencyDatasetOutput = {
  readonly rooms: readonly {
    readonly lengthXMeters: number;
    readonly lengthYMeters: number;
    readonly lengthZMeters: number;
    readonly soundSpeedMetersPerSecond: number;
    readonly kind: RoomModeKind;
    readonly ordersXYZ: readonly number[];
    readonly modeHertz: number;
  }[];
  readonly randomness: GeneratorReplay;
};
const kinds = {
  type: "string",
  enum: ["axial", "tangential", "oblique"],
} as const;
export const inputSchema = objectSchema(
  {
    count: countSchema(64),
    lengthXMeters: rangeSchema(positiveSchema),
    lengthYMeters: rangeSchema(positiveSchema),
    lengthZMeters: rangeSchema(positiveSchema),
    order: rangeSchema({ type: "integer", minimum: 1 }),
    soundSpeedMetersPerSecond: positiveSchema,
    kinds: arraySchema(kinds, 3, 1),
    seed: generatorSeedSchema,
  },
  [
    "count",
    "lengthXMeters",
    "lengthYMeters",
    "lengthZMeters",
    "order",
    "soundSpeedMetersPerSecond",
    "kinds",
  ],
);
export const outputSchema = objectSchema({
  rooms: arraySchema(
    objectSchema({
      lengthXMeters: positiveSchema,
      lengthYMeters: positiveSchema,
      lengthZMeters: positiveSchema,
      soundSpeedMetersPerSecond: positiveSchema,
      kind: kinds,
      ordersXYZ: arraySchema({ type: "integer", minimum: 0 }, 3, 3),
      modeHertz: positiveSchema,
    }),
    64,
    1,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is RoomModeFrequencyDatasetInput =>
  matchesModelInput(value, inputSchema);
export const calculateRoomModeFrequencyDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<RoomModeFrequencyDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    for (const field of [
      "lengthXMeters",
      "lengthYMeters",
      "lengthZMeters",
      "order",
    ] as const)
      orderedRange(input[field], field);
    requireDistinct(input.kinds, "kinds");
    const random = createGeneratorRandom(input.seed, context);
    const rooms = Array.from({ length: input.count }, () => {
      const lengthXMeters = drawReal(
          input.lengthXMeters,
          random,
          "lengthXMeters",
        ),
        lengthYMeters = drawReal(input.lengthYMeters, random, "lengthYMeters"),
        lengthZMeters = drawReal(input.lengthZMeters, random, "lengthZMeters"),
        dimensions = [lengthXMeters, lengthYMeters, lengthZMeters],
        kind = random.pick(input.kinds);
      const activeCount = kind === "axial" ? 1 : kind === "tangential" ? 2 : 3,
        axes = random
          .shuffle([0, 1, 2])
          .slice(0, activeCount)
          .sort((a, b) => a - b),
        ordersXYZ = [0, 0, 0];
      for (const axis of axes)
        ordersXYZ[axis] = drawInteger(input.order, random, "order");
      const soundSpeedMetersPerSecond = input.soundSpeedMetersPerSecond;
      let modeHertz: number;
      if (kind === "axial")
        modeHertz = calculateAxialModeFrequency({
          soundSpeedMetersPerSecond,
          modeOrder: ordersXYZ[axes[0]],
          roomLengthMeters: dimensions[axes[0]],
        }).modeHertz;
      else if (kind === "tangential")
        modeHertz = calculateTangentialModeFrequency({
          soundSpeedMetersPerSecond,
          orderX: ordersXYZ[axes[0]],
          orderY: ordersXYZ[axes[1]],
          lengthXMeters: dimensions[axes[0]],
          lengthYMeters: dimensions[axes[1]],
        }).modeHertz;
      else
        modeHertz = calculateObliqueModeFrequency({
          soundSpeedMetersPerSecond,
          orderX: ordersXYZ[0],
          orderY: ordersXYZ[1],
          orderZ: ordersXYZ[2],
          lengthXMeters,
          lengthYMeters,
          lengthZMeters,
        }).modeHertz;
      if (modeHertz <= 0)
        simpleError(
          "order",
          "Mode frequency underflowed positive representation.",
          "numeric_range",
        );
      return {
        lengthXMeters,
        lengthYMeters,
        lengthZMeters,
        soundSpeedMetersPerSecond,
        kind,
        ordersXYZ,
        modeHertz,
      };
    });
    return toolSuccess(
      ensureOutput(
        { rooms, randomness: generatorReplay(input.seed, context) },
        outputSchema,
      ),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const roomModeFrequencyDatasetExample = {
  input: {
    count: 1,
    lengthXMeters: {
      minimum: 5,
      maximum: 5,
    },
    lengthYMeters: {
      minimum: 4,
      maximum: 4,
    },
    lengthZMeters: {
      minimum: 3,
      maximum: 3,
    },
    order: {
      minimum: 1,
      maximum: 2,
    },
    soundSpeedMetersPerSecond: 340,
    kinds: ["axial", "tangential", "oblique"],
    seed: 42,
  },
  output: {
    rooms: [
      {
        lengthXMeters: 5,
        lengthYMeters: 4,
        lengthZMeters: 3,
        soundSpeedMetersPerSecond: 340,
        kind: "oblique",
        ordersXYZ: [1, 2, 2],
        modeHertz: 145.6895481647343,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  RoomModeFrequencyDatasetInput,
  RoomModeFrequencyDatasetOutput
>;
export const roomModeFrequencyDatasetTool = createModelDefinition<
  RoomModeFrequencyDatasetInput,
  RoomModeFrequencyDatasetOutput
>({
  id: "random/room-mode-frequency-dataset",
  title: "Random Room Mode Frequency Dataset Generator",
  description:
    "Generate synthetic rectangular rooms and mode indices with delegated axial, tangential, or oblique frequencies at explicit sound speed.",
  inputSchema,
  outputSchema,
  execute: calculateRoomModeFrequencyDataset,
});
export const runRoomModeFrequencyDataset = roomModeFrequencyDatasetTool.execute;
export default roomModeFrequencyDatasetTool;
