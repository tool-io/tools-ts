import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ratedInputKilowatts: number;
  readonly runtimeHours: number;
  readonly dutyFraction: number;
};
export type Output = {
  readonly energyKilowattHours: number;
  readonly operatingHours: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ratedInputKilowatts: { type: "number", minimum: 0 },
    runtimeHours: { type: "number", minimum: 0 },
    dutyFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["ratedInputKilowatts", "runtimeHours", "dutyFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    energyKilowattHours: { type: "number" },
    operatingHours: { type: "number" },
  },
  required: ["energyKilowattHours", "operatingHours"],
} as const;
/** Estimate recorded aerator input energy under a supplied constant power and operating duty fraction, without inferring oxygen transfer. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ratedInputKilowatts, runtimeHours, dutyFraction } = request;
  const compute = (): Output => {
    H.domain(
      ratedInputKilowatts >= 0 && runtimeHours >= 0,
      "ratedInputKilowatts",
    );
    (H.domain(dutyFraction >= 0 && dutyFraction <= 1, "dutyFraction"),
      dutyFraction);
    return {
      energyKilowattHours: ratedInputKilowatts * runtimeHours * dutyFraction,
      operatingHours: runtimeHours * dutyFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ratedInputKilowatts: 1.5, runtimeHours: 8, dutyFraction: 0.75 },
  output: { energyKilowattHours: 9, operatingHours: 6 },
} satisfies ToolExample<Input, Output>;
export const aeratorRuntimeEnergyLogTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["aquaculture", "agriculture"],
      keywords: ["aquaculture", "agriculture"],
    },
    id: "aquaculture/aerator-runtime-energy-log",
    title: "Aerator Runtime Energy Log",
    description:
      "Estimate recorded aerator input energy under a supplied constant power and operating duty fraction, without inferring oxygen transfer.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ratedInputKilowatts: { type: "number", minimum: 0 },
        runtimeHours: { type: "number", minimum: 0 },
        dutyFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["ratedInputKilowatts", "runtimeHours", "dutyFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        energyKilowattHours: { type: "number" },
        operatingHours: { type: "number" },
      },
      required: ["energyKilowattHours", "operatingHours"],
    },
    ports: {
      inputs: [
        {
          id: "ratedInputKilowatts",
          label: "Rated Input Kilowatts",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "runtimeHours",
          label: "Runtime Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dutyFraction",
          label: "Duty Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "energyKilowattHours",
          label: "Energy Kilowatt Hours",
          valueType: { type: "number" },
        },
        {
          id: "operatingHours",
          label: "Operating Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = aeratorRuntimeEnergyLogTool.execute;
export default aeratorRuntimeEnergyLogTool;
