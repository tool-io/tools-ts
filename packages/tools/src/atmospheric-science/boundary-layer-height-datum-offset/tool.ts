import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedGroundDatumHeight: number;
  readonly reportedLayerHeight: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedGroundDatumHeight: { type: "number" },
    reportedLayerHeight: { type: "number" },
  },
  required: ["suppliedGroundDatumHeight", "reportedLayerHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract an explicit ground datum height from a reported boundary-layer height on compatible vertical units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedGroundDatumHeight, reportedLayerHeight } = request;
  const compute = (): Output => {
    return { signedGap: reportedLayerHeight - suppliedGroundDatumHeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedGroundDatumHeight: 12, reportedLayerHeight: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const boundaryLayerHeightDatumOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "atmospheric-science",
        "atmospheric science",
        "earth and environmental sciences",
      ],
      keywords: ["atmospheric science", "earth and environmental sciences"],
    },
    id: "atmospheric-science/boundary-layer-height-datum-offset",
    title: "Boundary Layer Height Datum Offset",
    description:
      "Subtract an explicit ground datum height from a reported boundary-layer height on compatible vertical units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedGroundDatumHeight: { type: "number" },
        reportedLayerHeight: { type: "number" },
      },
      required: ["suppliedGroundDatumHeight", "reportedLayerHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedGroundDatumHeight",
          label: "Supplied Ground Datum Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reportedLayerHeight",
          label: "Reported Layer Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = boundaryLayerHeightDatumOffsetTool.execute;
export default boundaryLayerHeightDatumOffsetTool;
