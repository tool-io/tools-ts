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
import { calculate as calculateStations } from "../../pedagogy/station-rotation-schedule/tool.js";

export type ClassroomStationRotationInput = {
  readonly groupIds: readonly string[];
  readonly stationIds: readonly string[];
  readonly roundMinutes: number;
  readonly startMinute: number;
  readonly seed?: number;
};
export type ClassroomStationRotationOutput = {
  readonly groupOrder: readonly string[];
  readonly stationOrder: readonly string[];
  readonly rounds: readonly {
    readonly round: number;
    readonly startMinute: number;
    readonly visits: readonly {
      readonly groupId: string;
      readonly stationId: string;
    }[];
  }[];
  readonly endMinute: number;
  readonly randomness: GeneratorReplay;
};
const idSchema = { type: "string", minLength: 1, maxLength: 128 } as const,
  idsSchema = {
    type: "array",
    minItems: 1,
    maxItems: 32,
    items: idSchema,
  } as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    groupIds: idsSchema,
    stationIds: idsSchema,
    roundMinutes: { type: "number", exclusiveMinimum: 0 },
    startMinute: { type: "number" },
    seed: generatorSeedSchema,
  },
  required: ["groupIds", "stationIds", "roundMinutes", "startMinute"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    groupOrder: idsSchema,
    stationOrder: idsSchema,
    rounds: {
      type: "array",
      minItems: 1,
      maxItems: 32,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          round: { type: "integer", minimum: 1, maximum: 32 },
          startMinute: { type: "number" },
          visits: {
            type: "array",
            minItems: 1,
            maxItems: 32,
            items: {
              type: "object",
              additionalProperties: false,
              properties: { groupId: idSchema, stationId: idSchema },
              required: ["groupId", "stationId"],
            },
          },
        },
        required: ["round", "startMinute", "visits"],
      },
    },
    endMinute: { type: "number" },
    randomness: generatorReplaySchema,
  },
  required: ["groupOrder", "stationOrder", "rounds", "endMinute", "randomness"],
} as const;

const isInput = (input: unknown): input is ClassroomStationRotationInput =>
  matchesModelInput(input, inputSchema);
export const calculateClassroomStationRotation = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ClassroomStationRotationOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (new Set(input.groupIds).size !== input.groupIds.length)
      simpleError("groupIds", "Entries must be distinct.", "duplicate_entries");
    if (new Set(input.stationIds).size !== input.stationIds.length)
      simpleError(
        "stationIds",
        "Entries must be distinct.",
        "duplicate_entries",
      );
    if (input.groupIds.length !== input.stationIds.length)
      simpleError(
        "stationIds",
        "Equal counts of distinct groups and stations are required.",
        "unaligned_stations",
      );
    const random = createGeneratorRandom(input.seed, context),
      groupOrder = random.shuffle(input.groupIds),
      stationOrder = random.shuffle(input.stationIds);
    const core = calculateStations({
      groupIds: groupOrder.map((_, i) => String(i)),
      stationIds: stationOrder.map((_, i) => String(i)),
      roundMinutes: input.roundMinutes,
      startMinute: input.startMinute,
    });
    const times = [...core.roundStartMinutes, core.endMinute];
    if (times.some((time) => !Number.isFinite(time)))
      simpleError(
        "roundMinutes",
        "Schedule times overflow the finite numeric domain.",
        "time_overflow",
      );
    if (times.some((time, i) => i > 0 && time <= times[i - 1]))
      simpleError(
        "roundMinutes",
        "Duration must produce distinct increasing representable times at this origin.",
        "time_resolution",
      );
    const rounds = core.assignments.map((assignment, i) => ({
      round: i + 1,
      startMinute: core.roundStartMinutes[i],
      visits: assignment.split(",").map((pair) => {
        const [group, station] = pair.split(":");
        return {
          groupId: groupOrder[Number(group)],
          stationId: stationOrder[Number(station)],
        };
      }),
    }));
    return toolSuccess({
      groupOrder,
      stationOrder,
      rounds,
      endMinute: core.endMinute,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const classroomStationRotationExample = {
  input: {
    groupIds: ["A", "B", "C"],
    stationIds: ["read", "write", "discuss"],
    roundMinutes: 10,
    startMinute: 5,
    seed: 42,
  },
  output: {
    groupOrder: ["C", "A", "B"],
    stationOrder: ["read", "write", "discuss"],
    rounds: [
      {
        round: 1,
        startMinute: 5,
        visits: [
          {
            groupId: "C",
            stationId: "read",
          },
          {
            groupId: "A",
            stationId: "write",
          },
          {
            groupId: "B",
            stationId: "discuss",
          },
        ],
      },
      {
        round: 2,
        startMinute: 15,
        visits: [
          {
            groupId: "C",
            stationId: "write",
          },
          {
            groupId: "A",
            stationId: "discuss",
          },
          {
            groupId: "B",
            stationId: "read",
          },
        ],
      },
      {
        round: 3,
        startMinute: 25,
        visits: [
          {
            groupId: "C",
            stationId: "discuss",
          },
          {
            groupId: "A",
            stationId: "read",
          },
          {
            groupId: "B",
            stationId: "write",
          },
        ],
      },
    ],
    endMinute: 35,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  ClassroomStationRotationInput,
  ClassroomStationRotationOutput
>;
export const classroomStationRotationTool = createModelDefinition<
  ClassroomStationRotationInput,
  ClassroomStationRotationOutput
>({
  id: "random/classroom-station-rotation",
  title: "Random Classroom Station Rotation Generator",
  description:
    "Shuffle supplied distinct group and station orders once, then delegate a complete cyclic schedule with one group per station per round and one visit per pair. Explicit start and duration use a common caller-defined minute origin; numeric token adapters preserve arbitrary IDs, and nonfinite or unresolvable time increments fail rather than imply feasible timing.",
  inputSchema,
  outputSchema,
  execute: calculateClassroomStationRotation,
});
export const runClassroomStationRotation = classroomStationRotationTool.execute;
export default classroomStationRotationTool;
