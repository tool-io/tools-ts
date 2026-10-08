import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly localClockMinutes: number;
  readonly suppliedSolarMinusLocalMinutes: number;
};
export type Output = {
  readonly solarClockMinutes: number;
  readonly dayOffset: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    localClockMinutes: { type: "number", minimum: 0, exclusiveMaximum: 1440 },
    suppliedSolarMinusLocalMinutes: { type: "number" },
  },
  required: ["localClockMinutes", "suppliedSolarMinusLocalMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    solarClockMinutes: { type: "number" },
    dayOffset: { type: "integer" },
  },
  required: ["solarClockMinutes", "dayOffset"],
} as const;
/** Apply an explicit solar-minus-local clock offset and wrap the day without estimating longitude, time zones or equation of time. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { localClockMinutes, suppliedSolarMinusLocalMinutes } = request;
  const compute = (): Output => {
    H.domain(
      localClockMinutes >= 0 && localClockMinutes < 1440,
      "localClockMinutes",
    );
    return (() => {
      const time = localClockMinutes + suppliedSolarMinusLocalMinutes;
      H.domain(Number.isFinite(time), "suppliedSolarMinusLocalMinutes");
      const remainder = time % 1440;
      return {
        solarClockMinutes: remainder < 0 ? remainder + 1440 : remainder,
        dayOffset: Math.floor(time / 1440),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { localClockMinutes: 720, suppliedSolarMinusLocalMinutes: 15 },
  output: { solarClockMinutes: 735, dayOffset: 0 },
} satisfies ToolExample<Input, Output>;
export const insectCollectionLocalTimeSolarOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "entomology/insect-collection-local-time-solar-offset",
      title: "Insect Collection Local Time Solar Offset Tool",
      description:
        "Apply an explicit solar-minus-local clock offset and wrap the day without estimating longitude, time zones or equation of time.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          localClockMinutes: {
            type: "number",
            minimum: 0,
            exclusiveMaximum: 1440,
          },
          suppliedSolarMinusLocalMinutes: { type: "number" },
        },
        required: ["localClockMinutes", "suppliedSolarMinusLocalMinutes"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          solarClockMinutes: { type: "number" },
          dayOffset: { type: "integer" },
        },
        required: ["solarClockMinutes", "dayOffset"],
      },
      ports: {
        inputs: [
          {
            id: "localClockMinutes",
            label: "Local Clock Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedSolarMinusLocalMinutes",
            label: "Supplied Solar Minus Local Minutes",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "solarClockMinutes",
            label: "Solar Clock Minutes",
            valueType: { type: "number" },
          },
          {
            id: "dayOffset",
            label: "Day Offset",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = insectCollectionLocalTimeSolarOffsetTool.execute;
export default insectCollectionLocalTimeSolarOffsetTool;
