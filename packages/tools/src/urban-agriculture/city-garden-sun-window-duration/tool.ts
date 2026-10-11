import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sunWindowStartMinutes: number;
  readonly sunWindowEndMinutes: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sunWindowStartMinutes: { type: "number" },
    sunWindowEndMinutes: { type: "number" },
  },
  required: ["sunWindowStartMinutes", "sunWindowEndMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit same-timeline sun-window endpoints in minutes without predicting sunlight. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sunWindowStartMinutes, sunWindowEndMinutes } = request;
  const compute = (): Output => {
    return { signedGap: sunWindowEndMinutes - sunWindowStartMinutes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sunWindowStartMinutes: 12, sunWindowEndMinutes: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const cityGardenSunWindowDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["urban-agriculture", "urban agriculture", "agriculture"],
      keywords: ["urban agriculture", "agriculture"],
    },
    id: "urban-agriculture/city-garden-sun-window-duration",
    title: "City Garden Sun Window Duration",
    description:
      "Subtract explicit same-timeline sun-window endpoints in minutes without predicting sunlight.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sunWindowStartMinutes: { type: "number" },
        sunWindowEndMinutes: { type: "number" },
      },
      required: ["sunWindowStartMinutes", "sunWindowEndMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "sunWindowStartMinutes",
          label: "Sun Window Start Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sunWindowEndMinutes",
          label: "Sun Window End Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cityGardenSunWindowDurationTool.execute;
export default cityGardenSunWindowDurationTool;
