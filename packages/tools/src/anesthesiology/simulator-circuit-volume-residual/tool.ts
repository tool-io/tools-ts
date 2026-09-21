import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialVolume: number;
  readonly addedVolume: number;
  readonly removedVolume: number;
  readonly measuredFinal: number;
};
export type Output = {
  readonly expectedFinal: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialVolume: { type: "number", minimum: 0 },
    addedVolume: { type: "number", minimum: 0 },
    removedVolume: { type: "number", minimum: 0 },
    measuredFinal: { type: "number", minimum: 0 },
  },
  required: ["initialVolume", "addedVolume", "removedVolume", "measuredFinal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedFinal: { type: "number" },
    residual: { type: "number" },
  },
  required: ["expectedFinal", "residual"],
} as const;
/** Closed volume ledger for supplied simulator data without estimating patient circuit requirements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialVolume, addedVolume, removedVolume, measuredFinal } = request;
  const compute = (): Output => {
    H.domain(
      initialVolume >= 0 &&
        addedVolume >= 0 &&
        removedVolume >= 0 &&
        removedVolume <= initialVolume + addedVolume &&
        measuredFinal >= 0,
    );
    return {
      expectedFinal: initialVolume + addedVolume - removedVolume,
      residual: measuredFinal - (initialVolume + addedVolume - removedVolume),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialVolume: 100,
    addedVolume: 20,
    removedVolume: 30,
    measuredFinal: 95,
  },
  output: { expectedFinal: 90, residual: 5 },
} satisfies ToolExample<Input, Output>;
export const simulatorCircuitVolumeResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anesthesiology/simulator-circuit-volume-residual",
    title: "Simulator Circuit Volume Residual Tool",
    description:
      "Closed volume ledger for supplied simulator data without estimating patient circuit requirements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialVolume: { type: "number", minimum: 0 },
        addedVolume: { type: "number", minimum: 0 },
        removedVolume: { type: "number", minimum: 0 },
        measuredFinal: { type: "number", minimum: 0 },
      },
      required: [
        "initialVolume",
        "addedVolume",
        "removedVolume",
        "measuredFinal",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedFinal: { type: "number" },
        residual: { type: "number" },
      },
      required: ["expectedFinal", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "initialVolume",
          label: "Initial Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "addedVolume",
          label: "Added Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "removedVolume",
          label: "Removed Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredFinal",
          label: "Measured Final",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedFinal",
          label: "Expected Final",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = simulatorCircuitVolumeResidualTool.execute;
export default simulatorCircuitVolumeResidualTool;
