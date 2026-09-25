import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gaugePressure: number;
  readonly ambientPressure: number;
  readonly measuredAbsolute: number;
};
export type Output = {
  readonly expectedAbsolute: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gaugePressure: { type: "number" },
    ambientPressure: { type: "number", minimum: 0 },
    measuredAbsolute: { type: "number", minimum: 0 },
  },
  required: ["gaugePressure", "ambientPressure", "measuredAbsolute"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedAbsolute: { type: "number" },
    residual: { type: "number" },
  },
  required: ["expectedAbsolute", "residual"],
} as const;
/** Calculate vacuum absolute gauge gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gaugePressure, ambientPressure, measuredAbsolute } = request;
  const compute = (): Output => {
    H.domain(
      ambientPressure >= 0 &&
        measuredAbsolute >= 0 &&
        gaugePressure + ambientPressure >= 0,
    );
    return {
      expectedAbsolute: gaugePressure + ambientPressure,
      residual: measuredAbsolute - gaugePressure - ambientPressure,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { gaugePressure: -90, ambientPressure: 100, measuredAbsolute: 12 },
  output: { expectedAbsolute: 10, residual: 2 },
} satisfies ToolExample<Input, Output>;
export const vacuumAbsoluteGaugeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cryogenics/vacuum-absolute-gauge-gap",
    title: "Vacuum Absolute Gauge Gap Tool",
    description:
      "Calculate vacuum absolute gauge gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gaugePressure: { type: "number" },
        ambientPressure: { type: "number", minimum: 0 },
        measuredAbsolute: { type: "number", minimum: 0 },
      },
      required: ["gaugePressure", "ambientPressure", "measuredAbsolute"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedAbsolute: { type: "number" },
        residual: { type: "number" },
      },
      required: ["expectedAbsolute", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "gaugePressure",
          label: "Gauge Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ambientPressure",
          label: "Ambient Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredAbsolute",
          label: "Measured Absolute",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedAbsolute",
          label: "Expected Absolute",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = vacuumAbsoluteGaugeGapTool.execute;
export default vacuumAbsoluteGaugeGapTool;
