import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deliveredAt: number;
  readonly inspectionDuration: number;
  readonly installationAt: number;
  readonly suppliedBuffer: number;
};
export type Output = {
  readonly readyAt: number;
  readonly actualBuffer: number;
  readonly bufferGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deliveredAt: { type: "number" },
    inspectionDuration: { type: "number", minimum: 0 },
    installationAt: { type: "number" },
    suppliedBuffer: { type: "number", minimum: 0 },
  },
  required: [
    "deliveredAt",
    "inspectionDuration",
    "installationAt",
    "suppliedBuffer",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    readyAt: { type: "number" },
    actualBuffer: { type: "number" },
    bufferGap: { type: "number" },
  },
  required: ["readyAt", "actualBuffer", "bufferGap"],
} as const;
/** Calculate delivery installation buffer gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deliveredAt, inspectionDuration, installationAt, suppliedBuffer } =
    request;
  const compute = (): Output => {
    H.domain(inspectionDuration >= 0 && suppliedBuffer >= 0);
    return {
      readyAt: deliveredAt + inspectionDuration,
      actualBuffer: installationAt - deliveredAt - inspectionDuration,
      bufferGap:
        installationAt - deliveredAt - inspectionDuration - suppliedBuffer,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    deliveredAt: 10,
    inspectionDuration: 2,
    installationAt: 20,
    suppliedBuffer: 5,
  },
  output: { readyAt: 12, actualBuffer: 8, bufferGap: 3 },
} satisfies ToolExample<Input, Output>;
export const deliveryInstallationBufferGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "construction-management/delivery-installation-buffer-gap",
    title: "Delivery Installation Buffer Gap Tool",
    description:
      "Calculate delivery installation buffer gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deliveredAt: { type: "number" },
        inspectionDuration: { type: "number", minimum: 0 },
        installationAt: { type: "number" },
        suppliedBuffer: { type: "number", minimum: 0 },
      },
      required: [
        "deliveredAt",
        "inspectionDuration",
        "installationAt",
        "suppliedBuffer",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        readyAt: { type: "number" },
        actualBuffer: { type: "number" },
        bufferGap: { type: "number" },
      },
      required: ["readyAt", "actualBuffer", "bufferGap"],
    },
    ports: {
      inputs: [
        {
          id: "deliveredAt",
          label: "Delivered At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inspectionDuration",
          label: "Inspection Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "installationAt",
          label: "Installation At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedBuffer",
          label: "Supplied Buffer",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "readyAt", label: "Ready At", valueType: { type: "number" } },
        {
          id: "actualBuffer",
          label: "Actual Buffer",
          valueType: { type: "number" },
        },
        { id: "bufferGap", label: "Buffer Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = deliveryInstallationBufferGapTool.execute;
export default deliveryInstallationBufferGapTool;
