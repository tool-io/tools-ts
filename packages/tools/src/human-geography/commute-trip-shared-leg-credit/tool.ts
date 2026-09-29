import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDuration: number;
  readonly secondDuration: number;
  readonly sharedLeg: number;
  readonly allocateHalfShared: boolean;
};
export type Output = {
  readonly uniqueDuration: number;
  readonly firstAllocated: number;
  readonly secondAllocated: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDuration: { type: "number", minimum: 0 },
    secondDuration: { type: "number", minimum: 0 },
    sharedLeg: { type: "number", minimum: 0 },
    allocateHalfShared: { type: "boolean" },
  },
  required: [
    "firstDuration",
    "secondDuration",
    "sharedLeg",
    "allocateHalfShared",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uniqueDuration: { type: "number" },
    firstAllocated: { type: "number" },
    secondAllocated: { type: "number" },
  },
  required: ["uniqueDuration", "firstAllocated", "secondAllocated"],
} as const;
/** Calculate commute trip shared leg credit from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDuration, secondDuration, sharedLeg, allocateHalfShared } =
    request;
  const compute = (): Output => {
    H.domain(
      firstDuration >= 0 &&
        secondDuration >= 0 &&
        sharedLeg >= 0 &&
        sharedLeg <= Math.min(firstDuration, secondDuration),
    );
    return {
      uniqueDuration: firstDuration + secondDuration - sharedLeg,
      firstAllocated:
        firstDuration - (allocateHalfShared ? sharedLeg / 2 : sharedLeg),
      secondAllocated:
        secondDuration - (allocateHalfShared ? sharedLeg / 2 : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstDuration: 40,
    secondDuration: 30,
    sharedLeg: 10,
    allocateHalfShared: true,
  },
  output: { uniqueDuration: 60, firstAllocated: 35, secondAllocated: 25 },
} satisfies ToolExample<Input, Output>;
export const commuteTripSharedLegCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/commute-trip-shared-leg-credit",
    title: "Commute Trip Shared Leg Credit Tool",
    description:
      "Calculate commute trip shared leg credit from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDuration: { type: "number", minimum: 0 },
        secondDuration: { type: "number", minimum: 0 },
        sharedLeg: { type: "number", minimum: 0 },
        allocateHalfShared: { type: "boolean" },
      },
      required: [
        "firstDuration",
        "secondDuration",
        "sharedLeg",
        "allocateHalfShared",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uniqueDuration: { type: "number" },
        firstAllocated: { type: "number" },
        secondAllocated: { type: "number" },
      },
      required: ["uniqueDuration", "firstAllocated", "secondAllocated"],
    },
    ports: {
      inputs: [
        {
          id: "firstDuration",
          label: "First Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDuration",
          label: "Second Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedLeg",
          label: "Shared Leg",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allocateHalfShared",
          label: "Allocate Half Shared",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "uniqueDuration",
          label: "Unique Duration",
          valueType: { type: "number" },
        },
        {
          id: "firstAllocated",
          label: "First Allocated",
          valueType: { type: "number" },
        },
        {
          id: "secondAllocated",
          label: "Second Allocated",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = commuteTripSharedLegCreditTool.execute;
export default commuteTripSharedLegCreditTool;
