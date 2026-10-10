import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly chartSpecimenId: string;
  readonly containerSpecimenId: string;
};
export type Output = { readonly literalMatch: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chartSpecimenId: { type: "string", maxLength: 8192, minLength: 1 },
    containerSpecimenId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["chartSpecimenId", "containerSpecimenId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { literalMatch: { type: "boolean" } },
  required: ["literalMatch"],
} as const;
/** Compare literal chart and container specimen identifiers without verifying specimen or patient identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { chartSpecimenId, containerSpecimenId } = request;
  const compute = (): Output => {
    H.domain(
      chartSpecimenId.length > 0 && containerSpecimenId.length > 0,
      "chartSpecimenId",
    );
    return { literalMatch: chartSpecimenId === containerSpecimenId };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { chartSpecimenId: "S17", containerSpecimenId: "S17" },
  output: { literalMatch: true },
} satisfies ToolExample<Input, Output>;
export const nursingSpecimenIdPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["nursing", "health and medicine"],
      keywords: ["nursing", "health and medicine"],
    },
    id: "nursing/nursing-specimen-id-pair",
    title: "Nursing Specimen ID Pair",
    description:
      "Compare literal chart and container specimen identifiers without verifying specimen or patient identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        chartSpecimenId: { type: "string", maxLength: 8192, minLength: 1 },
        containerSpecimenId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["chartSpecimenId", "containerSpecimenId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { literalMatch: { type: "boolean" } },
      required: ["literalMatch"],
    },
    ports: {
      inputs: [
        {
          id: "chartSpecimenId",
          label: "Chart Specimen Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "containerSpecimenId",
          label: "Container Specimen Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "literalMatch",
          label: "Literal Match",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = nursingSpecimenIdPairTool.execute;
export default nursingSpecimenIdPairTool;
