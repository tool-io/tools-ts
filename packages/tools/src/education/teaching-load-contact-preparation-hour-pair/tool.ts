import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contactHours: number;
  readonly preparationPerContact: number;
  readonly fixedPreparation: number;
};
export type Output = {
  readonly preparationHours: number;
  readonly totalHours: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactHours: { type: "number", minimum: 0 },
    preparationPerContact: { type: "number", minimum: 0 },
    fixedPreparation: { type: "number", minimum: 0 },
  },
  required: ["contactHours", "preparationPerContact", "fixedPreparation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preparationHours: { type: "number" },
    totalHours: { type: "number" },
  },
  required: ["preparationHours", "totalHours"],
} as const;
/** Calculate teaching load contact preparation hour pair from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contactHours, preparationPerContact, fixedPreparation } = request;
  const compute = (): Output => {
    H.domain(
      contactHours >= 0 && preparationPerContact >= 0 && fixedPreparation >= 0,
    );
    return {
      preparationHours: contactHours * preparationPerContact + fixedPreparation,
      totalHours: contactHours * (1 + preparationPerContact) + fixedPreparation,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { contactHours: 10, preparationPerContact: 1.5, fixedPreparation: 2 },
  output: { preparationHours: 17, totalHours: 27 },
} satisfies ToolExample<Input, Output>;
export const teachingLoadContactPreparationHourPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "education/teaching-load-contact-preparation-hour-pair",
      title: "Teaching Load Contact Preparation Hour Pair Tool",
      description:
        "Calculate teaching load contact preparation hour pair from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          contactHours: { type: "number", minimum: 0 },
          preparationPerContact: { type: "number", minimum: 0 },
          fixedPreparation: { type: "number", minimum: 0 },
        },
        required: ["contactHours", "preparationPerContact", "fixedPreparation"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          preparationHours: { type: "number" },
          totalHours: { type: "number" },
        },
        required: ["preparationHours", "totalHours"],
      },
      ports: {
        inputs: [
          {
            id: "contactHours",
            label: "Contact Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "preparationPerContact",
            label: "Preparation Per Contact",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "fixedPreparation",
            label: "Fixed Preparation",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "preparationHours",
            label: "Preparation Hours",
            valueType: { type: "number" },
          },
          {
            id: "totalHours",
            label: "Total Hours",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = teachingLoadContactPreparationHourPairTool.execute;
export default teachingLoadContactPreparationHourPairTool;
