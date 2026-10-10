import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredPosition: number;
  readonly cejReferencePosition: number;
  readonly positiveIsApical: boolean;
};
export type Output = { readonly apicalPositiveOffset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredPosition: { type: "number" },
    cejReferencePosition: { type: "number" },
    positiveIsApical: { type: "boolean" },
  },
  required: ["measuredPosition", "cejReferencePosition", "positiveIsApical"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { apicalPositiveOffset: { type: "number" } },
  required: ["apicalPositiveOffset"],
} as const;
/** Reference an explicit site position to a supplied cementoenamel-junction coordinate and apical sign convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredPosition, cejReferencePosition, positiveIsApical } = request;
  const compute = (): Output => {
    return {
      apicalPositiveOffset:
        (measuredPosition - cejReferencePosition) * (positiveIsApical ? 1 : -1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredPosition: 5,
    cejReferencePosition: 2,
    positiveIsApical: true,
  },
  output: { apicalPositiveOffset: 3 },
} satisfies ToolExample<Input, Output>;
export const periodontalCejReferenceOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["periodontology", "health and medicine"],
      keywords: ["periodontology", "health and medicine"],
    },
    id: "periodontology/periodontal-cej-reference-offset",
    title: "Periodontal CEJ Reference Offset",
    description:
      "Reference an explicit site position to a supplied cementoenamel-junction coordinate and apical sign convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredPosition: { type: "number" },
        cejReferencePosition: { type: "number" },
        positiveIsApical: { type: "boolean" },
      },
      required: [
        "measuredPosition",
        "cejReferencePosition",
        "positiveIsApical",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { apicalPositiveOffset: { type: "number" } },
      required: ["apicalPositiveOffset"],
    },
    ports: {
      inputs: [
        {
          id: "measuredPosition",
          label: "Measured Position",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cejReferencePosition",
          label: "Cej Reference Position",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveIsApical",
          label: "Positive Is Apical",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "apicalPositiveOffset",
          label: "Apical Positive Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = periodontalCejReferenceOffsetTool.execute;
export default periodontalCejReferenceOffsetTool;
