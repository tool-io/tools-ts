import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly minuteOfDay: number;
  readonly bandStart: number;
  readonly bandEnd: number;
};
export type Output = { readonly withinBand: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minuteOfDay: { type: "integer", minimum: 0, maximum: 1439 },
    bandStart: { type: "integer", minimum: 0, maximum: 1439 },
    bandEnd: { type: "integer", minimum: 0, maximum: 1439 },
  },
  required: ["minuteOfDay", "bandStart", "bandEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { withinBand: { type: "boolean" } },
  required: ["withinBand"],
} as const;
/** Check a supplied half-open daily tariff time band, including midnight wrapping and an empty equal-endpoint band, without selecting tariffs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { minuteOfDay, bandStart, bandEnd } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(minuteOfDay) &&
        minuteOfDay >= 0 &&
        minuteOfDay <= 1439,
      "minuteOfDay",
    ),
      minuteOfDay);
    (H.domain(
      Number.isSafeInteger(bandStart) && bandStart >= 0 && bandStart <= 1439,
      "bandStart",
    ),
      bandStart);
    (H.domain(
      Number.isSafeInteger(bandEnd) && bandEnd >= 0 && bandEnd <= 1439,
      "bandEnd",
    ),
      bandEnd);
    return {
      withinBand:
        bandStart === bandEnd
          ? false
          : bandStart < bandEnd
            ? minuteOfDay >= bandStart && minuteOfDay < bandEnd
            : minuteOfDay >= bandStart || minuteOfDay < bandEnd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { minuteOfDay: 30, bandStart: 1320, bandEnd: 120 },
  output: { withinBand: true },
} satisfies ToolExample<Input, Output>;
export const energyTariffTimeBandBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/energy-tariff-time-band-boundary",
    title: "Energy Tariff Time Band Boundary Tool",
    description:
      "Check a supplied half-open daily tariff time band, including midnight wrapping and an empty equal-endpoint band, without selecting tariffs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minuteOfDay: { type: "integer", minimum: 0, maximum: 1439 },
        bandStart: { type: "integer", minimum: 0, maximum: 1439 },
        bandEnd: { type: "integer", minimum: 0, maximum: 1439 },
      },
      required: ["minuteOfDay", "bandStart", "bandEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { withinBand: { type: "boolean" } },
      required: ["withinBand"],
    },
    ports: {
      inputs: [
        {
          id: "minuteOfDay",
          label: "Minute Of Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "bandStart",
          label: "Band Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "bandEnd",
          label: "Band End",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "withinBand",
          label: "Within Band",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = energyTariffTimeBandBoundaryTool.execute;
export default energyTariffTimeBandBoundaryTool;
