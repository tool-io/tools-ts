import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sectionId: string;
  readonly thickness: number;
  readonly unitText: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sectionId: { type: "string", maxLength: 8192, minLength: 1 },
    thickness: { type: "number", minimum: 0 },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sectionId", "thickness", "unitText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a supplied section thickness and literal unit without converting or recommending section thickness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sectionId, thickness, unitText } = request;
  const compute = (): Output => {
    H.domain(sectionId.length > 0 && unitText.length > 0, "sectionId");
    H.domain(thickness >= 0, "thickness");
    return { label: sectionId + "; thickness=" + thickness + " " + unitText };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sectionId: "S17", thickness: 5, unitText: "um" },
  output: { label: "S17; thickness=5 um" },
} satisfies ToolExample<Input, Output>;
export const sectionThicknessUnitLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["histology", "biology"],
      keywords: ["histology", "biology"],
    },
    id: "histology/section-thickness-unit-label",
    title: "Section Thickness Unit Label",
    description:
      "Label a supplied section thickness and literal unit without converting or recommending section thickness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sectionId: { type: "string", maxLength: 8192, minLength: 1 },
        thickness: { type: "number", minimum: 0 },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sectionId", "thickness", "unitText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "sectionId",
          label: "Section Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "thickness",
          label: "Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitText",
          label: "Unit Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = sectionThicknessUnitLabelTool.execute;
export default sectionThicknessUnitLabelTool;
