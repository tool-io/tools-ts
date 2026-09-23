import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly takeoffSpeed: number;
  readonly gravity: number;
  readonly landingBelowTakeoff: number;
};
export type Output = {
  readonly ascentTime: number;
  readonly descentTime: number;
  readonly totalFlight: number;
  readonly timeGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    takeoffSpeed: { type: "number", minimum: 0 },
    gravity: { type: "number", exclusiveMinimum: 0 },
    landingBelowTakeoff: { type: "number" },
  },
  required: ["takeoffSpeed", "gravity", "landingBelowTakeoff"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ascentTime: { type: "number" },
    descentTime: { type: "number" },
    totalFlight: { type: "number" },
    timeGap: { type: "number" },
  },
  required: ["ascentTime", "descentTime", "totalFlight", "timeGap"],
} as const;
/** Ballistic point-mass flight without air drag; landingBelowTakeoff is a signed vertical drop, and the descending intersection is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { takeoffSpeed, gravity, landingBelowTakeoff } = request;
  const compute = (): Output => {
    H.domain(
      takeoffSpeed >= 0 &&
        takeoffSpeed ** 2 + 2 * gravity * landingBelowTakeoff >= 0,
    );
    H.positive(gravity);
    return {
      ascentTime: takeoffSpeed / gravity,
      descentTime:
        Math.sqrt(takeoffSpeed ** 2 + 2 * gravity * landingBelowTakeoff) /
        gravity,
      totalFlight:
        (takeoffSpeed +
          Math.sqrt(takeoffSpeed ** 2 + 2 * gravity * landingBelowTakeoff)) /
        gravity,
      timeGap:
        (Math.sqrt(takeoffSpeed ** 2 + 2 * gravity * landingBelowTakeoff) -
          takeoffSpeed) /
        gravity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { takeoffSpeed: 4, gravity: 2, landingBelowTakeoff: 0 },
  output: { ascentTime: 2, descentTime: 2, totalFlight: 4, timeGap: 0 },
} satisfies ToolExample<Input, Output>;
export const jumpApexFlightAsymmetryTimeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomechanics/jump-apex-flight-asymmetry-time-gap",
    title: "Jump Apex Flight Asymmetry Time Gap Tool",
    description:
      "Ballistic point-mass flight without air drag; landingBelowTakeoff is a signed vertical drop, and the descending intersection is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        takeoffSpeed: { type: "number", minimum: 0 },
        gravity: { type: "number", exclusiveMinimum: 0 },
        landingBelowTakeoff: { type: "number" },
      },
      required: ["takeoffSpeed", "gravity", "landingBelowTakeoff"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ascentTime: { type: "number" },
        descentTime: { type: "number" },
        totalFlight: { type: "number" },
        timeGap: { type: "number" },
      },
      required: ["ascentTime", "descentTime", "totalFlight", "timeGap"],
    },
    ports: {
      inputs: [
        {
          id: "takeoffSpeed",
          label: "Takeoff Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gravity",
          label: "Gravity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "landingBelowTakeoff",
          label: "Landing Below Takeoff",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "ascentTime",
          label: "Ascent Time",
          valueType: { type: "number" },
        },
        {
          id: "descentTime",
          label: "Descent Time",
          valueType: { type: "number" },
        },
        {
          id: "totalFlight",
          label: "Total Flight",
          valueType: { type: "number" },
        },
        { id: "timeGap", label: "Time Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = jumpApexFlightAsymmetryTimeGapTool.execute;
export default jumpApexFlightAsymmetryTimeGapTool;
