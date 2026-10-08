import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly groupCount: number;
  readonly seatsPerGroup: number;
  readonly learnerCount: number;
};
export type Output = {
  readonly availableSeats: number;
  readonly excessSeats: number;
  readonly shortfallSeats: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    groupCount: { type: "integer", minimum: 0 },
    seatsPerGroup: { type: "integer", minimum: 0 },
    learnerCount: { type: "integer", minimum: 0 },
  },
  required: ["groupCount", "seatsPerGroup", "learnerCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableSeats: { type: "integer" },
    excessSeats: { type: "integer" },
    shortfallSeats: { type: "integer" },
  },
  required: ["availableSeats", "excessSeats", "shortfallSeats"],
} as const;
/** Compare explicit equal-size group seating with a learner count using exact integer capacity arithmetic. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { groupCount, seatsPerGroup, learnerCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(groupCount) &&
        groupCount >= 0 &&
        groupCount <= Number.MAX_SAFE_INTEGER,
      "groupCount",
    ),
      groupCount);
    (H.domain(
      Number.isSafeInteger(seatsPerGroup) &&
        seatsPerGroup >= 0 &&
        seatsPerGroup <= Number.MAX_SAFE_INTEGER,
      "seatsPerGroup",
    ),
      seatsPerGroup);
    (H.domain(
      Number.isSafeInteger(learnerCount) &&
        learnerCount >= 0 &&
        learnerCount <= Number.MAX_SAFE_INTEGER,
      "learnerCount",
    ),
      learnerCount);
    return (() => {
      const availableSeats = Number(BigInt(groupCount) * BigInt(seatsPerGroup));
      return {
        availableSeats,
        excessSeats: Math.max(0, availableSeats - learnerCount),
        shortfallSeats: Math.max(0, learnerCount - availableSeats),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { groupCount: 5, seatsPerGroup: 4, learnerCount: 18 },
  output: { availableSeats: 20, excessSeats: 2, shortfallSeats: 0 },
} satisfies ToolExample<Input, Output>;
export const classroomGroupExcessSeatCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["education"],
      keywords: ["education"],
    },
    id: "education/classroom-group-excess-seat-count",
    title: "Classroom Group Excess Seat Count",
    description:
      "Compare explicit equal-size group seating with a learner count using exact integer capacity arithmetic.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        groupCount: { type: "integer", minimum: 0 },
        seatsPerGroup: { type: "integer", minimum: 0 },
        learnerCount: { type: "integer", minimum: 0 },
      },
      required: ["groupCount", "seatsPerGroup", "learnerCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableSeats: { type: "integer" },
        excessSeats: { type: "integer" },
        shortfallSeats: { type: "integer" },
      },
      required: ["availableSeats", "excessSeats", "shortfallSeats"],
    },
    ports: {
      inputs: [
        {
          id: "groupCount",
          label: "Group Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "seatsPerGroup",
          label: "Seats Per Group",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "learnerCount",
          label: "Learner Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "availableSeats",
          label: "Available Seats",
          valueType: { type: "integer" },
        },
        {
          id: "excessSeats",
          label: "Excess Seats",
          valueType: { type: "integer" },
        },
        {
          id: "shortfallSeats",
          label: "Shortfall Seats",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = classroomGroupExcessSeatCountTool.execute;
export default classroomGroupExcessSeatCountTool;
