import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly manufacturerNamespace: string;
  readonly modelCode: string;
  readonly serialText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    manufacturerNamespace: { type: "string", maxLength: 8192, minLength: 1 },
    modelCode: { type: "string", maxLength: 8192, minLength: 1 },
    serialText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["manufacturerNamespace", "modelCode", "serialText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit farm-device serial string by manufacturer and model without identifying hardware. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { manufacturerNamespace, modelCode, serialText } = request;
  const compute = (): Output => {
    H.domain(manufacturerNamespace.length > 0, "manufacturerNamespace");
    H.domain(modelCode.length > 0, "modelCode");
    H.domain(serialText.length > 0, "serialText");
    return {
      token: JSON.stringify([manufacturerNamespace, modelCode, serialText]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    manufacturerNamespace: "Maker A",
    modelCode: "M2",
    serialText: "00042",
  },
  output: { token: '["Maker A","M2","00042"]' },
} satisfies ToolExample<Input, Output>;
export const farmDeviceSerialTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agrotechnology", "agriculture"],
      keywords: ["agrotechnology", "agriculture"],
    },
    id: "agrotechnology/farm-device-serial-token",
    title: "Farm Device Serial Token",
    description:
      "Qualify an explicit farm-device serial string by manufacturer and model without identifying hardware.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        manufacturerNamespace: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
        modelCode: { type: "string", maxLength: 8192, minLength: 1 },
        serialText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["manufacturerNamespace", "modelCode", "serialText"],
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
          id: "manufacturerNamespace",
          label: "Manufacturer Namespace",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "modelCode",
          label: "Model Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "serialText",
          label: "Serial Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = farmDeviceSerialTokenTool.execute;
export default farmDeviceSerialTokenTool;
