import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectedVolume: number;
  readonly elapsedSeconds: number;
  readonly containerResidual: number;
  readonly referenceFlow: number;
};
export type Output = {
  readonly netVolume: number;
  readonly flowPerSecond: number;
  readonly flowGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectedVolume: { type: "number" },
    elapsedSeconds: { type: "number", exclusiveMinimum: 0 },
    containerResidual: { type: "number", minimum: 0 },
    referenceFlow: { type: "number" },
  },
  required: [
    "collectedVolume",
    "elapsedSeconds",
    "containerResidual",
    "referenceFlow",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netVolume: { type: "number" },
    flowPerSecond: { type: "number" },
    flowGap: { type: "number" },
  },
  required: ["netVolume", "flowPerSecond", "flowGap"],
} as const;
/** Measured model/phantom flow from net collected volume, with no patient flow estimate or acquisition recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collectedVolume, elapsedSeconds, containerResidual, referenceFlow } =
    request;
  const compute = (): Output => {
    H.domain(containerResidual >= 0 && collectedVolume >= containerResidual);
    H.positive(elapsedSeconds);
    return {
      netVolume: collectedVolume - containerResidual,
      flowPerSecond: (collectedVolume - containerResidual) / elapsedSeconds,
      flowGap:
        (collectedVolume - containerResidual) / elapsedSeconds - referenceFlow,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    collectedVolume: 110,
    elapsedSeconds: 10,
    containerResidual: 10,
    referenceFlow: 8,
  },
  output: { netVolume: 100, flowPerSecond: 10, flowGap: 2 },
} satisfies ToolExample<Input, Output>;
export const cardiologyPhantomFlowVolumeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cardiology/cardiology-phantom-flow-volume-factor",
    title: "Cardiology Phantom Flow Volume Factor Tool",
    description:
      "Measured model/phantom flow from net collected volume, with no patient flow estimate or acquisition recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collectedVolume: { type: "number" },
        elapsedSeconds: { type: "number", exclusiveMinimum: 0 },
        containerResidual: { type: "number", minimum: 0 },
        referenceFlow: { type: "number" },
      },
      required: [
        "collectedVolume",
        "elapsedSeconds",
        "containerResidual",
        "referenceFlow",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netVolume: { type: "number" },
        flowPerSecond: { type: "number" },
        flowGap: { type: "number" },
      },
      required: ["netVolume", "flowPerSecond", "flowGap"],
    },
    ports: {
      inputs: [
        {
          id: "collectedVolume",
          label: "Collected Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedSeconds",
          label: "Elapsed Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "containerResidual",
          label: "Container Residual",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceFlow",
          label: "Reference Flow",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netVolume", label: "Net Volume", valueType: { type: "number" } },
        {
          id: "flowPerSecond",
          label: "Flow Per Second",
          valueType: { type: "number" },
        },
        { id: "flowGap", label: "Flow Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cardiologyPhantomFlowVolumeFactorTool.execute;
export default cardiologyPhantomFlowVolumeFactorTool;
