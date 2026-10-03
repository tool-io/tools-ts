import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligibleWaitlist: number;
  readonly capacity: number;
  readonly reservedPlaces: number;
};
export type Output = {
  readonly available: number;
  readonly pressureRatio: number;
  readonly excess: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleWaitlist: { type: "integer", minimum: 0 },
    capacity: { type: "integer", minimum: 1 },
    reservedPlaces: { type: "integer", minimum: 0 },
  },
  required: ["eligibleWaitlist", "capacity", "reservedPlaces"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    available: { type: "integer" },
    pressureRatio: { type: "number" },
    excess: { type: "integer" },
  },
  required: ["available", "pressureRatio", "excess"],
} as const;
/** Calculate program waitlist eligible capacity ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligibleWaitlist, capacity, reservedPlaces } = request;
  const compute = (): Output => {
    H.integer(capacity, 1);
    H.integer(reservedPlaces, 0, capacity - 1);
    H.integer(eligibleWaitlist, 0);
    return {
      available: capacity - reservedPlaces,
      pressureRatio: eligibleWaitlist / (capacity - reservedPlaces),
      excess: Math.max(0, eligibleWaitlist - capacity + reservedPlaces),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eligibleWaitlist: 100, capacity: 80, reservedPlaces: 30 },
  output: { available: 50, pressureRatio: 2, excess: 50 },
} satisfies ToolExample<Input, Output>;
export const programWaitlistEligibleCapacityRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "public-policy/program-waitlist-eligible-capacity-ratio",
      title: "Program Waitlist Eligible Capacity Ratio Tool",
      description:
        "Calculate program waitlist eligible capacity ratio from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eligibleWaitlist: { type: "integer", minimum: 0 },
          capacity: { type: "integer", minimum: 1 },
          reservedPlaces: { type: "integer", minimum: 0 },
        },
        required: ["eligibleWaitlist", "capacity", "reservedPlaces"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          available: { type: "integer" },
          pressureRatio: { type: "number" },
          excess: { type: "integer" },
        },
        required: ["available", "pressureRatio", "excess"],
      },
      ports: {
        inputs: [
          {
            id: "eligibleWaitlist",
            label: "Eligible Waitlist",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "capacity",
            label: "Capacity",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "reservedPlaces",
            label: "Reserved Places",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "available",
            label: "Available",
            valueType: { type: "integer" },
          },
          {
            id: "pressureRatio",
            label: "Pressure Ratio",
            valueType: { type: "number" },
          },
          { id: "excess", label: "Excess", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = programWaitlistEligibleCapacityRatioTool.execute;
export default programWaitlistEligibleCapacityRatioTool;
