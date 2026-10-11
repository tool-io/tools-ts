import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly residualId: string;
  readonly scaleDefinition: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residualId: { type: "string", maxLength: 8192, minLength: 1 },
    scaleDefinition: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["residualId", "scaleDefinition", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit residual studentization scale wording without estimating residual variance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { residualId, scaleDefinition, source } = request;
  const compute = (): Output => {
    H.domain(residualId.length > 0, "residualId");
    H.domain(scaleDefinition.length > 0, "scaleDefinition");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([residualId, scaleDefinition, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    residualId: "R17",
    scaleDefinition: "external deleted scale",
    source: "Model A",
  },
  output: { token: '["R17","external deleted scale","Model A"]' },
} satisfies ToolExample<Input, Output>;
export const residualStudentizationScaleLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["statistics", "mathematics"],
      keywords: ["statistics", "mathematics"],
    },
    id: "statistics/residual-studentization-scale-label",
    title: "Residual Studentization Scale Label",
    description:
      "Preserve explicit residual studentization scale wording without estimating residual variance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        residualId: { type: "string", maxLength: 8192, minLength: 1 },
        scaleDefinition: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["residualId", "scaleDefinition", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "residualId",
          label: "Residual Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "scaleDefinition",
          label: "Scale Definition",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = residualStudentizationScaleLabelTool.execute;
export default residualStudentizationScaleLabelTool;
