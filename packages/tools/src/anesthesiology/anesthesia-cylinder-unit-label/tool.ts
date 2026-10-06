import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cylinderId: string;
  readonly recordedQuantity: number;
  readonly unitText: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cylinderId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedQuantity: { type: "number", minimum: 0 },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["cylinderId", "recordedQuantity", "unitText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly recorded cylinder quantity and unit without estimating gas supply or recommending cylinder use. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cylinderId, recordedQuantity, unitText } = request;
  const compute = (): Output => {
    H.domain(cylinderId.length > 0 && unitText.length > 0, "cylinderId");
    H.domain(recordedQuantity >= 0, "recordedQuantity");
    return { label: cylinderId + "; " + recordedQuantity + " " + unitText };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cylinderId: "CYL17", recordedQuantity: 200, unitText: "bar" },
  output: { label: "CYL17; 200 bar" },
} satisfies ToolExample<Input, Output>;
export const anesthesiaCylinderUnitLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["anesthesiology", "health and medicine"],
      keywords: ["anesthesiology", "health and medicine"],
    },
    id: "anesthesiology/anesthesia-cylinder-unit-label",
    title: "Anesthesia Cylinder Unit Label",
    description:
      "Label an explicitly recorded cylinder quantity and unit without estimating gas supply or recommending cylinder use.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cylinderId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedQuantity: { type: "number", minimum: 0 },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["cylinderId", "recordedQuantity", "unitText"],
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
          id: "cylinderId",
          label: "Cylinder Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedQuantity",
          label: "Recorded Quantity",
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
export const run = anesthesiaCylinderUnitLabelTool.execute;
export default anesthesiaCylinderUnitLabelTool;
