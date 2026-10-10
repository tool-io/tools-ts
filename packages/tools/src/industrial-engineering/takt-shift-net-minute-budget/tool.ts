import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly shiftMinutes: number;
  readonly breaksMinutes: number;
  readonly plannedStopsMinutes: number;
  readonly demandUnits: number;
};
export type Output = {
  readonly netMinutes: number;
  readonly taktMinutesPerUnit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shiftMinutes: { type: "number", minimum: 0 },
    breaksMinutes: { type: "number", minimum: 0 },
    plannedStopsMinutes: { type: "number", minimum: 0 },
    demandUnits: { type: "integer", minimum: 1 },
  },
  required: [
    "shiftMinutes",
    "breaksMinutes",
    "plannedStopsMinutes",
    "demandUnits",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netMinutes: { type: "number" },
    taktMinutesPerUnit: { type: "number" },
  },
  required: ["netMinutes", "taktMinutesPerUnit"],
} as const;
/** Divide an explicit net production-time budget by positive demand, treating supplied breaks and stops as nonoverlapping. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shiftMinutes, breaksMinutes, plannedStopsMinutes, demandUnits } =
    request;
  const compute = (): Output => {
    H.domain(
      shiftMinutes >= 0 &&
        breaksMinutes >= 0 &&
        plannedStopsMinutes >= 0 &&
        breaksMinutes + plannedStopsMinutes <= shiftMinutes,
      "shiftMinutes",
    );
    (H.domain(
      Number.isSafeInteger(demandUnits) &&
        demandUnits >= 1 &&
        demandUnits <= Number.MAX_SAFE_INTEGER,
      "demandUnits",
    ),
      demandUnits);
    return {
      netMinutes: shiftMinutes - breaksMinutes - plannedStopsMinutes,
      taktMinutesPerUnit:
        (shiftMinutes - breaksMinutes - plannedStopsMinutes) / demandUnits,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    shiftMinutes: 480,
    breaksMinutes: 30,
    plannedStopsMinutes: 50,
    demandUnits: 200,
  },
  output: { netMinutes: 400, taktMinutesPerUnit: 2 },
} satisfies ToolExample<Input, Output>;
export const taktShiftNetMinuteBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "industrial-engineering",
        "industrial engineering",
        "engineering",
      ],
      keywords: ["industrial engineering", "engineering"],
    },
    id: "industrial-engineering/takt-shift-net-minute-budget",
    title: "Takt Shift Net Minute Budget",
    description:
      "Divide an explicit net production-time budget by positive demand, treating supplied breaks and stops as nonoverlapping.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shiftMinutes: { type: "number", minimum: 0 },
        breaksMinutes: { type: "number", minimum: 0 },
        plannedStopsMinutes: { type: "number", minimum: 0 },
        demandUnits: { type: "integer", minimum: 1 },
      },
      required: [
        "shiftMinutes",
        "breaksMinutes",
        "plannedStopsMinutes",
        "demandUnits",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netMinutes: { type: "number" },
        taktMinutesPerUnit: { type: "number" },
      },
      required: ["netMinutes", "taktMinutesPerUnit"],
    },
    ports: {
      inputs: [
        {
          id: "shiftMinutes",
          label: "Shift Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "breaksMinutes",
          label: "Breaks Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plannedStopsMinutes",
          label: "Planned Stops Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "demandUnits",
          label: "Demand Units",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "netMinutes",
          label: "Net Minutes",
          valueType: { type: "number" },
        },
        {
          id: "taktMinutesPerUnit",
          label: "Takt Minutes Per Unit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = taktShiftNetMinuteBudgetTool.execute;
export default taktShiftNetMinuteBudgetTool;
