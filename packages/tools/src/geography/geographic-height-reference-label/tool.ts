import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly heightMeters: number;
  readonly reference: string;
  readonly datumName: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heightMeters: { type: "number" },
    reference: {
      type: "string",
      maxLength: 8192,
      enum: ["ellipsoidal", "orthometric", "normal"],
    },
    datumName: { type: "string", maxLength: 8192 },
  },
  required: ["heightMeters", "reference", "datumName"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a geographic height with its explicitly supplied height type and named datum; no datum transformation is performed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { heightMeters, reference, datumName } = request;
  const compute = (): Output => {
    H.domain(
      ["ellipsoidal", "orthometric", "normal"].includes(reference),
      "reference",
    );
    H.domain(datumName.trim().length > 0, "datumName");
    return { label: heightMeters + " m " + reference + " (" + datumName + ")" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { heightMeters: 132.5, reference: "ellipsoidal", datumName: "WGS 84" },
  output: { label: "132.5 m ellipsoidal (WGS 84)" },
} satisfies ToolExample<Input, Output>;
export const geographicHeightReferenceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/geographic-height-reference-label",
    title: "Geographic Height Reference Label Tool",
    description:
      "Label a geographic height with its explicitly supplied height type and named datum; no datum transformation is performed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        heightMeters: { type: "number" },
        reference: {
          type: "string",
          maxLength: 8192,
          enum: ["ellipsoidal", "orthometric", "normal"],
        },
        datumName: { type: "string", maxLength: 8192 },
      },
      required: ["heightMeters", "reference", "datumName"],
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
          id: "heightMeters",
          label: "Height Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "datumName",
          label: "Datum Name",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = geographicHeightReferenceLabelTool.execute;
export default geographicHeightReferenceLabelTool;
