import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly usableRespirationMinutes: number;
  readonly restObservationMinutes: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usableRespirationMinutes: { type: "number", minimum: 0 },
    restObservationMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["usableRespirationMinutes", "restObservationMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Calculate explicit usable respiration-observation share in a positive resting observation period without interpreting breathing or health. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { usableRespirationMinutes, restObservationMinutes } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(restObservationMinutes) && restObservationMinutes > 0,
      "restObservationMinutes",
    ),
      restObservationMinutes);
    H.domain(
      usableRespirationMinutes >= 0 &&
        usableRespirationMinutes <= restObservationMinutes,
      "usableRespirationMinutes",
    );
    return {
      fraction: usableRespirationMinutes / restObservationMinutes,
      remainder: restObservationMinutes - usableRespirationMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { usableRespirationMinutes: 30, restObservationMinutes: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const animalRestingRespirationObservationShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "zoology/animal-resting-respiration-observation-share",
      title: "Animal Resting Respiration Observation Share Tool",
      description:
        "Calculate explicit usable respiration-observation share in a positive resting observation period without interpreting breathing or health.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          usableRespirationMinutes: { type: "number", minimum: 0 },
          restObservationMinutes: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["usableRespirationMinutes", "restObservationMinutes"],
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
            id: "usableRespirationMinutes",
            label: "Usable Respiration Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "restObservationMinutes",
            label: "Rest Observation Minutes",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "fraction", label: "Fraction", valueType: { type: "number" } },
          {
            id: "remainder",
            label: "Remainder",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = animalRestingRespirationObservationShareTool.execute;
export default animalRestingRespirationObservationShareTool;
