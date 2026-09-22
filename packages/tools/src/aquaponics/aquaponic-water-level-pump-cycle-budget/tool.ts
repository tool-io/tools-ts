import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cycleCount: number;
  readonly pumpedPerCycle: number;
  readonly returnFraction: number;
  readonly openingVolume: number;
};
export type Output = {
  readonly grossPumped: number;
  readonly netVolumeLoss: number;
  readonly closingVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cycleCount: { type: "integer", minimum: 0 },
    pumpedPerCycle: { type: "number", minimum: 0 },
    returnFraction: { type: "number", minimum: 0, maximum: 1 },
    openingVolume: { type: "number", minimum: 0 },
  },
  required: ["cycleCount", "pumpedPerCycle", "returnFraction", "openingVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossPumped: { type: "number" },
    netVolumeLoss: { type: "number" },
    closingVolume: { type: "number" },
  },
  required: ["grossPumped", "netVolumeLoss", "closingVolume"],
} as const;
/** Calculate aquaponic water level pump cycle budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cycleCount, pumpedPerCycle, returnFraction, openingVolume } = request;
  const compute = (): Output => {
    H.integer(cycleCount, 0);
    H.domain(pumpedPerCycle >= 0 && openingVolume >= 0);
    H.probability(returnFraction);
    return {
      grossPumped: cycleCount * pumpedPerCycle,
      netVolumeLoss: cycleCount * pumpedPerCycle * (1 - returnFraction),
      closingVolume:
        openingVolume - cycleCount * pumpedPerCycle * (1 - returnFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cycleCount: 10,
    pumpedPerCycle: 5,
    returnFraction: 0.9,
    openingVolume: 100,
  },
  output: {
    grossPumped: 50,
    netVolumeLoss: 4.999999999999999,
    closingVolume: 95,
  },
} satisfies ToolExample<Input, Output>;
export const aquaponicWaterLevelPumpCycleBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaponics/aquaponic-water-level-pump-cycle-budget",
    title: "Aquaponic Water Level Pump Cycle Budget Tool",
    description:
      "Calculate aquaponic water level pump cycle budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cycleCount: { type: "integer", minimum: 0 },
        pumpedPerCycle: { type: "number", minimum: 0 },
        returnFraction: { type: "number", minimum: 0, maximum: 1 },
        openingVolume: { type: "number", minimum: 0 },
      },
      required: [
        "cycleCount",
        "pumpedPerCycle",
        "returnFraction",
        "openingVolume",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossPumped: { type: "number" },
        netVolumeLoss: { type: "number" },
        closingVolume: { type: "number" },
      },
      required: ["grossPumped", "netVolumeLoss", "closingVolume"],
    },
    ports: {
      inputs: [
        {
          id: "cycleCount",
          label: "Cycle Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "pumpedPerCycle",
          label: "Pumped Per Cycle",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "returnFraction",
          label: "Return Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "openingVolume",
          label: "Opening Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossPumped",
          label: "Gross Pumped",
          valueType: { type: "number" },
        },
        {
          id: "netVolumeLoss",
          label: "Net Volume Loss",
          valueType: { type: "number" },
        },
        {
          id: "closingVolume",
          label: "Closing Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = aquaponicWaterLevelPumpCycleBudgetTool.execute;
export default aquaponicWaterLevelPumpCycleBudgetTool;
