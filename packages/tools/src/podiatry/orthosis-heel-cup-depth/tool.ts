import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deviceId: string;
  readonly recordedDepth: number;
  readonly unitText: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deviceId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedDepth: { type: "number", minimum: 0 },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["deviceId", "recordedDepth", "unitText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied heel-cup depth without choosing an orthosis or assessing fit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deviceId, recordedDepth, unitText } = request;
  const compute = (): Output => {
    H.domain(deviceId.length > 0 && unitText.length > 0, "deviceId");
    H.domain(recordedDepth >= 0, "recordedDepth");
    return {
      label: deviceId + "; heel-cup depth=" + recordedDepth + " " + unitText,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { deviceId: "D17", recordedDepth: 12, unitText: "mm" },
  output: { label: "D17; heel-cup depth=12 mm" },
} satisfies ToolExample<Input, Output>;
export const orthosisHeelCupDepthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["podiatry", "health and medicine"],
      keywords: ["podiatry", "health and medicine"],
    },
    id: "podiatry/orthosis-heel-cup-depth",
    title: "Orthosis Heel Cup Depth",
    description:
      "Label an explicitly supplied heel-cup depth without choosing an orthosis or assessing fit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deviceId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedDepth: { type: "number", minimum: 0 },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["deviceId", "recordedDepth", "unitText"],
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
          id: "deviceId",
          label: "Device Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedDepth",
          label: "Recorded Depth",
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
export const run = orthosisHeelCupDepthTool.execute;
export default orthosisHeelCupDepthTool;
