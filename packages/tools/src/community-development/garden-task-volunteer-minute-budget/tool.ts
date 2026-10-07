import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volunteerCount: number;
  readonly minutesEach: number;
  readonly requiredTaskMinutes: number;
};
export type Output = {
  readonly availablePersonMinutes: number;
  readonly marginPersonMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volunteerCount: { type: "integer", minimum: 0 },
    minutesEach: { type: "number", minimum: 0 },
    requiredTaskMinutes: { type: "number", minimum: 0 },
  },
  required: ["volunteerCount", "minutesEach", "requiredTaskMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availablePersonMinutes: { type: "number" },
    marginPersonMinutes: { type: "number" },
  },
  required: ["availablePersonMinutes", "marginPersonMinutes"],
} as const;
/** Compare an explicit garden-task person-minute requirement with uniformly available volunteer time, assuming independent divisible work. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volunteerCount, minutesEach, requiredTaskMinutes } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(volunteerCount) &&
        volunteerCount >= 0 &&
        volunteerCount <= Number.MAX_SAFE_INTEGER,
      "volunteerCount",
    ),
      volunteerCount);
    H.domain(minutesEach >= 0 && requiredTaskMinutes >= 0, "minutesEach");
    return {
      availablePersonMinutes: volunteerCount * minutesEach,
      marginPersonMinutes: volunteerCount * minutesEach - requiredTaskMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { volunteerCount: 6, minutesEach: 30, requiredTaskMinutes: 150 },
  output: { availablePersonMinutes: 180, marginPersonMinutes: 30 },
} satisfies ToolExample<Input, Output>;
export const gardenTaskVolunteerMinuteBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "community-development",
        "community development",
        "social sciences",
      ],
      keywords: ["community development", "social sciences"],
    },
    id: "community-development/garden-task-volunteer-minute-budget",
    title: "Garden Task Volunteer Minute Budget",
    description:
      "Compare an explicit garden-task person-minute requirement with uniformly available volunteer time, assuming independent divisible work.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volunteerCount: { type: "integer", minimum: 0 },
        minutesEach: { type: "number", minimum: 0 },
        requiredTaskMinutes: { type: "number", minimum: 0 },
      },
      required: ["volunteerCount", "minutesEach", "requiredTaskMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availablePersonMinutes: { type: "number" },
        marginPersonMinutes: { type: "number" },
      },
      required: ["availablePersonMinutes", "marginPersonMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "volunteerCount",
          label: "Volunteer Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "minutesEach",
          label: "Minutes Each",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredTaskMinutes",
          label: "Required Task Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "availablePersonMinutes",
          label: "Available Person Minutes",
          valueType: { type: "number" },
        },
        {
          id: "marginPersonMinutes",
          label: "Margin Person Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gardenTaskVolunteerMinuteBudgetTool.execute;
export default gardenTaskVolunteerMinuteBudgetTool;
