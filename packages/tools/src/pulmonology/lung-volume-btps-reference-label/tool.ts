import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly volume: number;
  readonly unitText: string;
  readonly statedBasis: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    volume: { type: "number", minimum: 0 },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
    statedBasis: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "volume", "unitText", "statedBasis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a supplied lung-volume reference basis without converting gas conditions or certifying BTPS correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, volume, unitText, statedBasis } = request;
  const compute = (): Output => {
    H.domain(
      recordId.length > 0 && unitText.length > 0 && statedBasis.length > 0,
      "recordId",
    );
    H.domain(volume >= 0, "volume");
    return {
      label:
        recordId + "; " + volume + " " + unitText + " [" + statedBasis + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", volume: 3.5, unitText: "L", statedBasis: "BTPS" },
  output: { label: "R17; 3.5 L [BTPS]" },
} satisfies ToolExample<Input, Output>;
export const lungVolumeBtpsReferenceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pulmonology", "health and medicine"],
      keywords: ["pulmonology", "health and medicine"],
    },
    id: "pulmonology/lung-volume-btps-reference-label",
    title: "Lung Volume BTPS Reference Label",
    description:
      "Label a supplied lung-volume reference basis without converting gas conditions or certifying BTPS correction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        volume: { type: "number", minimum: 0 },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
        statedBasis: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "volume", "unitText", "statedBasis"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "volume",
          label: "Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitText",
          label: "Unit Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "statedBasis",
          label: "Stated Basis",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = lungVolumeBtpsReferenceLabelTool.execute;
export default lungVolumeBtpsReferenceLabelTool;
