import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly arrivalMinutes: number;
  readonly slotEndMinutes: number;
  readonly suppliedGraceMinutes: number;
};
export type Output = {
  readonly latestMinutes: number;
  readonly arrivalMarginMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arrivalMinutes: { type: "number" },
    slotEndMinutes: { type: "number" },
    suppliedGraceMinutes: { type: "number", minimum: 0 },
  },
  required: ["arrivalMinutes", "slotEndMinutes", "suppliedGraceMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    latestMinutes: { type: "number" },
    arrivalMarginMinutes: { type: "number" },
  },
  required: ["latestMinutes", "arrivalMarginMinutes"],
} as const;
/** Compare explicit arrival and slot-end markers with a supplied grace allowance without deciding admission. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { arrivalMinutes, slotEndMinutes, suppliedGraceMinutes } = request;
  const compute = (): Output => {
    H.domain(suppliedGraceMinutes >= 0, "suppliedGraceMinutes");
    return {
      latestMinutes: slotEndMinutes + suppliedGraceMinutes,
      arrivalMarginMinutes:
        slotEndMinutes + suppliedGraceMinutes - arrivalMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { arrivalMinutes: 100, slotEndMinutes: 90, suppliedGraceMinutes: 15 },
  output: { latestMinutes: 105, arrivalMarginMinutes: 5 },
} satisfies ToolExample<Input, Output>;
export const museumTimeSlotGraceMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["tourism", "business and finance"],
      keywords: ["tourism", "business and finance"],
    },
    id: "tourism/museum-time-slot-grace-margin",
    title: "Museum Time Slot Grace Margin",
    description:
      "Compare explicit arrival and slot-end markers with a supplied grace allowance without deciding admission.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arrivalMinutes: { type: "number" },
        slotEndMinutes: { type: "number" },
        suppliedGraceMinutes: { type: "number", minimum: 0 },
      },
      required: ["arrivalMinutes", "slotEndMinutes", "suppliedGraceMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        latestMinutes: { type: "number" },
        arrivalMarginMinutes: { type: "number" },
      },
      required: ["latestMinutes", "arrivalMarginMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "arrivalMinutes",
          label: "Arrival Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "slotEndMinutes",
          label: "Slot End Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedGraceMinutes",
          label: "Supplied Grace Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "latestMinutes",
          label: "Latest Minutes",
          valueType: { type: "number" },
        },
        {
          id: "arrivalMarginMinutes",
          label: "Arrival Margin Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = museumTimeSlotGraceMarginTool.execute;
export default museumTimeSlotGraceMarginTool;
