import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly flowUnit: string;
  readonly volumeUnit: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    flowUnit: { type: "string", maxLength: 8192, minLength: 1 },
    volumeUnit: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "flowUnit", "volumeUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Record explicit spirometry flow and volume unit labels without converting or interpreting a curve. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, flowUnit, volumeUnit } = request;
  const compute = (): Output => {
    H.domain(
      recordId.length > 0 && flowUnit.length > 0 && volumeUnit.length > 0,
      "recordId",
    );
    return {
      label: recordId + "; flow=" + flowUnit + "; volume=" + volumeUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", flowUnit: "L/s", volumeUnit: "L" },
  output: { label: "R17; flow=L/s; volume=L" },
} satisfies ToolExample<Input, Output>;
export const spirometryFlowVolumeUnitPairTool = H.defineSchemaCalculation<
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
    id: "pulmonology/spirometry-flow-volume-unit-pair",
    title: "Spirometry Flow Volume Unit Pair",
    description:
      "Record explicit spirometry flow and volume unit labels without converting or interpreting a curve.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        flowUnit: { type: "string", maxLength: 8192, minLength: 1 },
        volumeUnit: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "flowUnit", "volumeUnit"],
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
          id: "flowUnit",
          label: "Flow Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "volumeUnit",
          label: "Volume Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = spirometryFlowVolumeUnitPairTool.execute;
export default spirometryFlowVolumeUnitPairTool;
