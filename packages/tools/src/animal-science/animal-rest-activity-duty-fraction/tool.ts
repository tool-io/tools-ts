import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activeMinutes: number;
  readonly observedMinutes: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeMinutes: { type: "number", minimum: 0 },
    observedMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["activeMinutes", "observedMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Calculate supplied active-time fraction and non-active minutes over one positive observation window without classifying welfare. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activeMinutes, observedMinutes } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(observedMinutes) && observedMinutes > 0,
      "observedMinutes",
    ),
      observedMinutes);
    H.domain(
      activeMinutes >= 0 && activeMinutes <= observedMinutes,
      "activeMinutes",
    );
    return {
      fraction: activeMinutes / observedMinutes,
      remainder: observedMinutes - activeMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { activeMinutes: 30, observedMinutes: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const animalRestActivityDutyFractionTool = H.defineSchemaCalculation<
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
    id: "animal-science/animal-rest-activity-duty-fraction",
    title: "Animal Rest Activity Duty Fraction",
    description:
      "Calculate supplied active-time fraction and non-active minutes over one positive observation window without classifying welfare.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activeMinutes: { type: "number", minimum: 0 },
        observedMinutes: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["activeMinutes", "observedMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "activeMinutes",
          label: "Active Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedMinutes",
          label: "Observed Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = animalRestActivityDutyFractionTool.execute;
export default animalRestActivityDutyFractionTool;
