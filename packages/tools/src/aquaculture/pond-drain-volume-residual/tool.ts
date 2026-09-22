import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly opening: number;
  readonly inflow: number;
  readonly pumpedOut: number;
  readonly evaporated: number;
  readonly measuredClosing: number;
};
export type Output = {
  readonly predictedClosing: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opening: { type: "number", minimum: 0 },
    inflow: { type: "number", minimum: 0 },
    pumpedOut: { type: "number", minimum: 0 },
    evaporated: { type: "number", minimum: 0 },
    measuredClosing: { type: "number", minimum: 0 },
  },
  required: ["opening", "inflow", "pumpedOut", "evaporated", "measuredClosing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predictedClosing: { type: "number" },
    residual: { type: "number" },
  },
  required: ["predictedClosing", "residual"],
} as const;
/** Calculate pond drain volume residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { opening, inflow, pumpedOut, evaporated, measuredClosing } = request;
  const compute = (): Output => {
    H.domain(
      opening >= 0 &&
        inflow >= 0 &&
        pumpedOut >= 0 &&
        evaporated >= 0 &&
        measuredClosing >= 0,
    );
    return {
      predictedClosing: opening + inflow - pumpedOut - evaporated,
      residual: measuredClosing - opening - inflow + pumpedOut + evaporated,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    opening: 100,
    inflow: 20,
    pumpedOut: 50,
    evaporated: 5,
    measuredClosing: 60,
  },
  output: { predictedClosing: 65, residual: -5 },
} satisfies ToolExample<Input, Output>;
export const pondDrainVolumeResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaculture/pond-drain-volume-residual",
    title: "Pond Drain Volume Residual Tool",
    description:
      "Calculate pond drain volume residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        opening: { type: "number", minimum: 0 },
        inflow: { type: "number", minimum: 0 },
        pumpedOut: { type: "number", minimum: 0 },
        evaporated: { type: "number", minimum: 0 },
        measuredClosing: { type: "number", minimum: 0 },
      },
      required: [
        "opening",
        "inflow",
        "pumpedOut",
        "evaporated",
        "measuredClosing",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        predictedClosing: { type: "number" },
        residual: { type: "number" },
      },
      required: ["predictedClosing", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "opening",
          label: "Opening",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inflow",
          label: "Inflow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pumpedOut",
          label: "Pumped Out",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "evaporated",
          label: "Evaporated",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredClosing",
          label: "Measured Closing",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "predictedClosing",
          label: "Predicted Closing",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pondDrainVolumeResidualTool.execute;
export default pondDrainVolumeResidualTool;
