import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceId: string;
  readonly populationDescription: string;
  readonly sourceVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceId: { type: "string", maxLength: 8192, minLength: 1 },
    populationDescription: { type: "string", maxLength: 8192, minLength: 1 },
    sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["referenceId", "populationDescription", "sourceVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicitly supplied hormone reference-population description and source version without choosing reference intervals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceId, populationDescription, sourceVersion } = request;
  const compute = (): Output => {
    H.domain(referenceId.length > 0, "referenceId");
    H.domain(populationDescription.length > 0, "populationDescription");
    H.domain(sourceVersion.length > 0, "sourceVersion");
    return {
      token: JSON.stringify([
        referenceId,
        populationDescription,
        sourceVersion,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referenceId: "R17",
    populationDescription: "study cohort A",
    sourceVersion: "v2",
  },
  output: { token: '["R17","study cohort A","v2"]' },
} satisfies ToolExample<Input, Output>;
export const hormoneReferencePopulationSourceTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "endocrinology/hormone-reference-population-source-token",
      title: "Hormone Reference Population Source Token Tool",
      description:
        "Preserve an explicitly supplied hormone reference-population description and source version without choosing reference intervals.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          referenceId: { type: "string", maxLength: 8192, minLength: 1 },
          populationDescription: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["referenceId", "populationDescription", "sourceVersion"],
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
            id: "referenceId",
            label: "Reference Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "populationDescription",
            label: "Population Description",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "sourceVersion",
            label: "Source Version",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = hormoneReferencePopulationSourceTokenTool.execute;
export default hormoneReferencePopulationSourceTokenTool;
