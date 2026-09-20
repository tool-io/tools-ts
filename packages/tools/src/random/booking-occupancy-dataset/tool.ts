import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import { invalidInput, type ToolResult } from "../../core/result.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorRandom,
  type GeneratorReplay,
} from "../generator-random.js";
import { simpleError } from "../../core/simple.js";
import {
  mocksArray,
  mocksObject,
  mocksLabel,
  mocksInteger,
  mocksBoolean,
  mocksDate,
  mocksDistinct,
  mocksOrdered,
  mocksPick,
  mocksAddDays,
  mocksDays,
  mocksFinish,
} from "../m250-parser-mocks-support.js";
export type BookingOccupancyDatasetInput = {
  readonly resources: readonly {
    readonly id: string;
    readonly capacity: number;
  }[];
  readonly startDate: string;
  readonly endDateExclusive: string;
  readonly count: number;
  readonly minimumDurationDays: number;
  readonly maximumDurationDays: number;
  readonly includeOverlapControl: boolean;
  readonly seed?: number;
};
export type SyntheticReservation = {
  readonly id: string;
  readonly resourceId: string;
  readonly lane: number;
  readonly startDate: string;
  readonly endDateExclusive: string;
  readonly durationDays: number;
  readonly units: number;
};
export type BookingOccupancyDatasetOutput = {
  readonly reservations: readonly SyntheticReservation[];
  readonly occupancy: readonly {
    readonly resourceId: string;
    readonly date: string;
    readonly units: number;
    readonly capacity: number;
  }[];
  readonly overlappingPairs: readonly {
    readonly firstId: string;
    readonly secondId: string;
  }[];
  readonly controls: readonly {
    readonly resourceId: string;
    readonly startDate: string;
    readonly endDateExclusive: string;
    readonly units: number;
    readonly exceedsCapacity: boolean;
  }[];
  readonly randomness: GeneratorReplay;
};
const reservationSchema = mocksObject({
  id: mocksLabel,
  resourceId: mocksLabel,
  lane: mocksInteger,
  startDate: mocksDate,
  endDateExclusive: mocksDate,
  durationDays: mocksInteger,
  units: mocksInteger,
});
export const inputSchema = mocksObject(
  {
    resources: mocksArray(
      mocksObject({
        id: mocksLabel,
        capacity: { type: "integer", minimum: 1, maximum: 128 },
      }),
      32,
      1,
    ),
    startDate: mocksDate,
    endDateExclusive: mocksDate,
    count: { type: "integer", minimum: 1, maximum: 128 },
    minimumDurationDays: { type: "integer", minimum: 1 },
    maximumDurationDays: { type: "integer", minimum: 1 },
    includeOverlapControl: mocksBoolean,
    seed: generatorSeedSchema,
  },
  [
    "resources",
    "startDate",
    "endDateExclusive",
    "count",
    "minimumDurationDays",
    "maximumDurationDays",
    "includeOverlapControl",
  ],
);
export const outputSchema = mocksObject({
  reservations: mocksArray(reservationSchema, 128, 1),
  occupancy: mocksArray(
    mocksObject({
      resourceId: mocksLabel,
      date: mocksDate,
      units: mocksInteger,
      capacity: mocksInteger,
    }),
    4096,
  ),
  overlappingPairs: mocksArray(
    mocksObject({ firstId: mocksLabel, secondId: mocksLabel }),
    8128,
  ),
  controls: mocksArray(
    mocksObject({
      resourceId: mocksLabel,
      startDate: mocksDate,
      endDateExclusive: mocksDate,
      units: mocksInteger,
      exceedsCapacity: mocksBoolean,
    }),
    1,
  ),
  randomness: generatorReplaySchema,
});
const generate = (
  input: BookingOccupancyDatasetInput,
  random: GeneratorRandom,
): Omit<BookingOccupancyDatasetOutput, "randomness"> => {
  mocksDistinct(
    input.resources.map((resource) => resource.id),
    "resources",
  );
  mocksOrdered(
    input.minimumDurationDays,
    input.maximumDurationDays,
    "maximumDurationDays",
  );
  const days = mocksDays(input.startDate, input.endDateExclusive);
  if (days < 1)
    simpleError(
      "endDateExclusive",
      "The reservation window must be nonempty.",
      "empty_date_window",
    );
  if (days > 128)
    simpleError(
      "endDateExclusive",
      "At most 128 calendar days can be materialized.",
      "resource_limit_exceeded",
    );
  const lanes = input.resources.flatMap((resource) =>
    Array.from({ length: resource.capacity }, (_, lane) => ({
      resource,
      lane,
      cursor: 0,
    })),
  );
  const slots = (): number =>
    lanes.reduce(
      (total, lane) =>
        total + Math.floor((days - lane.cursor) / input.minimumDurationDays),
      0,
    );
  if (slots() < input.count)
    simpleError(
      "count",
      "Minimum reservation durations cannot fit within the supplied capacities.",
      "infeasible_booking_count",
    );
  const reservations: SyntheticReservation[] = [];
  for (let i = 0; i < input.count; i += 1) {
    const lane = mocksPick(
      lanes.filter((item) => days - item.cursor >= input.minimumDurationDays),
      random,
    );
    const available = days - lane.cursor,
      remaining = input.count - i - 1;
    const otherSlots =
      slots() - Math.floor(available / input.minimumDurationDays);
    const reservedSlots = Math.max(0, remaining - otherSlots);
    const durationDays = random.integer(
      input.minimumDurationDays,
      Math.min(
        input.maximumDurationDays,
        available - reservedSlots * input.minimumDurationDays,
      ),
    );
    const gap = random.integer(
      0,
      available - durationDays - reservedSlots * input.minimumDurationDays,
    );
    const startDate = mocksAddDays(input.startDate, lane.cursor + gap),
      endDateExclusive = mocksAddDays(startDate, durationDays);
    lane.cursor += gap + durationDays;
    if (mocksDays(startDate, endDateExclusive) !== durationDays)
      throw new Error("Date duration cross-check failed.");
    reservations.push({
      id: "booking-" + (i + 1),
      resourceId: lane.resource.id,
      lane: lane.lane,
      startDate,
      endDateExclusive,
      durationDays,
      units: 1,
    });
  }
  const occupancy = input.resources.flatMap((resource) =>
    Array.from({ length: days }, (_, day) => {
      const date = mocksAddDays(input.startDate, day);
      const units = reservations.filter(
        (r) =>
          r.resourceId === resource.id &&
          r.startDate <= date &&
          date < r.endDateExclusive,
      ).length;
      if (units > resource.capacity)
        throw new Error("Constructed reservation capacity exceeded.");
      return {
        resourceId: resource.id,
        date,
        units,
        capacity: resource.capacity,
      };
    }),
  );
  const overlappingPairs: { firstId: string; secondId: string }[] = [];
  for (let i = 0; i < reservations.length; i += 1)
    for (let j = i + 1; j < reservations.length; j += 1) {
      const a = reservations[i],
        b = reservations[j];
      if (
        a.resourceId === b.resourceId &&
        a.startDate < b.endDateExclusive &&
        b.startDate < a.endDateExclusive
      )
        overlappingPairs.push({ firstId: a.id, secondId: b.id });
    }
  const first = reservations[0],
    resource = input.resources.find((item) => item.id === first.resourceId);
  if (!resource) throw new Error("Reservation lost its supplied resource.");
  const controls = input.includeOverlapControl
    ? [
        {
          resourceId: first.resourceId,
          startDate: first.startDate,
          endDateExclusive: first.endDateExclusive,
          units: resource.capacity + 1,
          exceedsCapacity: true,
        },
      ]
    : [];
  return { reservations, occupancy, overlappingPairs, controls };
};
export const bookingOccupancyDatasetExample = {
  input: {
    resources: [{ id: "room", capacity: 2 }],
    startDate: "2024-02-27",
    endDateExclusive: "2024-03-01",
    count: 2,
    minimumDurationDays: 2,
    maximumDurationDays: 2,
    includeOverlapControl: true,
    seed: 42,
  },
  output: {
    reservations: [
      {
        id: "booking-1",
        resourceId: "room",
        lane: 1,
        startDate: "2024-02-28",
        endDateExclusive: "2024-03-01",
        durationDays: 2,
        units: 1,
      },
      {
        id: "booking-2",
        resourceId: "room",
        lane: 0,
        startDate: "2024-02-28",
        endDateExclusive: "2024-03-01",
        durationDays: 2,
        units: 1,
      },
    ],
    occupancy: [
      { resourceId: "room", date: "2024-02-27", units: 0, capacity: 2 },
      { resourceId: "room", date: "2024-02-28", units: 2, capacity: 2 },
      { resourceId: "room", date: "2024-02-29", units: 2, capacity: 2 },
    ],
    overlappingPairs: [{ firstId: "booking-1", secondId: "booking-2" }],
    controls: [
      {
        resourceId: "room",
        startDate: "2024-02-28",
        endDateExclusive: "2024-03-01",
        units: 3,
        exceedsCapacity: true,
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  BookingOccupancyDatasetInput,
  BookingOccupancyDatasetOutput
>;

const isInput = (input: unknown): input is BookingOccupancyDatasetInput =>
  matchesModelInput(input, inputSchema);
export const calculateBookingOccupancyDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<BookingOccupancyDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    return mocksFinish(
      {
        ...generate(input, random),
        randomness: generatorReplay(input.seed, context),
      },
      outputSchema,
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const bookingOccupancyDatasetTool = createModelDefinition<
  BookingOccupancyDatasetInput,
  BookingOccupancyDatasetOutput
>({
  id: "random/booking-occupancy-dataset",
  title: "Random Booking Occupancy Dataset Generator",
  description:
    "Construct synthetic half-open day reservations within resource capacity, with daily occupancy, overlap evidence, and optional labeled over-capacity controls.",
  inputSchema,
  outputSchema,
  execute: calculateBookingOccupancyDataset,
});
export const runBookingOccupancyDataset = bookingOccupancyDatasetTool.execute;
export default bookingOccupancyDatasetTool;
