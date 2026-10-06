import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startMass: number;
  readonly endMass: number;
  readonly elapsedDays: number;
};
export type Output = {
  readonly massChange: number;
  readonly massChangePerDay: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startMass: { type: "number", minimum: 0 },
    endMass: { type: "number", minimum: 0 },
    elapsedDays: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["startMass", "endMass", "elapsedDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    massChange: { type: "number" },
    massChangePerDay: { type: "number" },
  },
  required: ["massChange", "massChangePerDay"],
} as const;
/** Report signed livestock mass change and change per day from two supplied live weights and positive elapsed time. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startMass, endMass, elapsedDays } = request;
  const compute = (): Output => {
    H.domain(startMass >= 0, "startMass");
    H.domain(endMass >= 0, "endMass");
    (H.domain(Number.isFinite(elapsedDays) && elapsedDays > 0, "elapsedDays"),
      elapsedDays);
    return {
      massChange: endMass - startMass,
      massChangePerDay: (endMass - startMass) / elapsedDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startMass: 200, endMass: 224, elapsedDays: 12 },
  output: { massChange: 24, massChangePerDay: 2 },
} satisfies ToolExample<Input, Output>;
export const livestockLiveWeightGainIntervalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["animal-science", "animal science", "agriculture"],
      keywords: ["animal science", "agriculture"],
    },
    id: "animal-science/livestock-live-weight-gain-interval",
    title: "Livestock Live Weight Gain Interval",
    description:
      "Report signed livestock mass change and change per day from two supplied live weights and positive elapsed time.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startMass: { type: "number", minimum: 0 },
        endMass: { type: "number", minimum: 0 },
        elapsedDays: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["startMass", "endMass", "elapsedDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        massChange: { type: "number" },
        massChangePerDay: { type: "number" },
      },
      required: ["massChange", "massChangePerDay"],
    },
    ports: {
      inputs: [
        {
          id: "startMass",
          label: "Start Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endMass",
          label: "End Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedDays",
          label: "Elapsed Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "massChange",
          label: "Mass Change",
          valueType: { type: "number" },
        },
        {
          id: "massChangePerDay",
          label: "Mass Change Per Day",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = livestockLiveWeightGainIntervalTool.execute;
export default livestockLiveWeightGainIntervalTool;
