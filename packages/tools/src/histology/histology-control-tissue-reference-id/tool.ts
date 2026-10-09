import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly slideId: string;
  readonly controlTissueId: string;
  readonly controlSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slideId: { type: "string", maxLength: 8192, minLength: 1 },
    controlTissueId: { type: "string", maxLength: 8192, minLength: 1 },
    controlSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["slideId", "controlTissueId", "controlSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Link explicit histology control tissue and source identifiers without establishing control adequacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { slideId, controlTissueId, controlSource } = request;
  const compute = (): Output => {
    H.domain(slideId.length > 0, "slideId");
    H.domain(controlTissueId.length > 0, "controlTissueId");
    H.domain(controlSource.length > 0, "controlSource");
    return { token: JSON.stringify([slideId, controlTissueId, controlSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { slideId: "S17", controlTissueId: "CT4", controlSource: "source R2" },
  output: { token: '["S17","CT4","source R2"]' },
} satisfies ToolExample<Input, Output>;
export const histologyControlTissueReferenceIdTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/histology-control-tissue-reference-id",
    title: "Histology Control Tissue Reference ID Tool",
    description:
      "Link explicit histology control tissue and source identifiers without establishing control adequacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slideId: { type: "string", maxLength: 8192, minLength: 1 },
        controlTissueId: { type: "string", maxLength: 8192, minLength: 1 },
        controlSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["slideId", "controlTissueId", "controlSource"],
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
          id: "slideId",
          label: "Slide Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "controlTissueId",
          label: "Control Tissue Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "controlSource",
          label: "Control Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = histologyControlTissueReferenceIdTool.execute;
export default histologyControlTissueReferenceIdTool;
