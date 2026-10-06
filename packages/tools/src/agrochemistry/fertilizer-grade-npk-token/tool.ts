import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nitrogenPercent: number;
  readonly phosphateLabelPercent: number;
  readonly potashLabelPercent: number;
};
export type Output = { readonly gradeText: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nitrogenPercent: { type: "number", minimum: 0, maximum: 100 },
    phosphateLabelPercent: { type: "number", minimum: 0, maximum: 100 },
    potashLabelPercent: { type: "number", minimum: 0, maximum: 100 },
  },
  required: ["nitrogenPercent", "phosphateLabelPercent", "potashLabelPercent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gradeText: { type: "string", maxLength: 8192 } },
  required: ["gradeText"],
} as const;
/** Format explicit N-P2O5-K2O label percentages without converting nutrient bases or validating a product analysis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nitrogenPercent, phosphateLabelPercent, potashLabelPercent } =
    request;
  const compute = (): Output => {
    H.domain(nitrogenPercent >= 0 && nitrogenPercent <= 100, "nitrogenPercent");
    H.domain(
      phosphateLabelPercent >= 0 && phosphateLabelPercent <= 100,
      "phosphateLabelPercent",
    );
    H.domain(
      potashLabelPercent >= 0 && potashLabelPercent <= 100,
      "potashLabelPercent",
    );
    return {
      gradeText:
        nitrogenPercent +
        "-" +
        phosphateLabelPercent +
        "-" +
        potashLabelPercent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    nitrogenPercent: 10,
    phosphateLabelPercent: 20,
    potashLabelPercent: 15,
  },
  output: { gradeText: "10-20-15" },
} satisfies ToolExample<Input, Output>;
export const fertilizerGradeNpkTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agrochemistry", "agriculture"],
      keywords: ["agrochemistry", "agriculture"],
    },
    id: "agrochemistry/fertilizer-grade-npk-token",
    title: "Fertilizer Grade NPK Token",
    description:
      "Format explicit N-P2O5-K2O label percentages without converting nutrient bases or validating a product analysis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nitrogenPercent: { type: "number", minimum: 0, maximum: 100 },
        phosphateLabelPercent: { type: "number", minimum: 0, maximum: 100 },
        potashLabelPercent: { type: "number", minimum: 0, maximum: 100 },
      },
      required: [
        "nitrogenPercent",
        "phosphateLabelPercent",
        "potashLabelPercent",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gradeText: { type: "string", maxLength: 8192 } },
      required: ["gradeText"],
    },
    ports: {
      inputs: [
        {
          id: "nitrogenPercent",
          label: "Nitrogen Percent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "phosphateLabelPercent",
          label: "Phosphate Label Percent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "potashLabelPercent",
          label: "Potash Label Percent",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gradeText", label: "Grade Text", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = fertilizerGradeNpkTokenTool.execute;
export default fertilizerGradeNpkTokenTool;
