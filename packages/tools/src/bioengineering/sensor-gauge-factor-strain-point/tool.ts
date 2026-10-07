import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly relativeResistanceChange: number;
  readonly gaugeFactor: number;
};
export type Output = { readonly strain: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativeResistanceChange: { type: "number" },
    gaugeFactor: { type: "number" },
  },
  required: ["relativeResistanceChange", "gaugeFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { strain: { type: "number" } },
  required: ["strain"],
} as const;
/** Divide a supplied relative resistance change by an explicit nonzero gauge factor under a linear strain-gauge relation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { relativeResistanceChange, gaugeFactor } = request;
  const compute = (): Output => {
    H.domain(gaugeFactor !== 0, "gaugeFactor");
    return { strain: relativeResistanceChange / gaugeFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { relativeResistanceChange: 0.004, gaugeFactor: 2 },
  output: { strain: 0.002 },
} satisfies ToolExample<Input, Output>;
export const sensorGaugeFactorStrainPointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioengineering", "engineering"],
      keywords: ["bioengineering", "engineering"],
    },
    id: "bioengineering/sensor-gauge-factor-strain-point",
    title: "Sensor Gauge Factor Strain Point",
    description:
      "Divide a supplied relative resistance change by an explicit nonzero gauge factor under a linear strain-gauge relation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relativeResistanceChange: { type: "number" },
        gaugeFactor: { type: "number" },
      },
      required: ["relativeResistanceChange", "gaugeFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { strain: { type: "number" } },
      required: ["strain"],
    },
    ports: {
      inputs: [
        {
          id: "relativeResistanceChange",
          label: "Relative Resistance Change",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gaugeFactor",
          label: "Gauge Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "strain", label: "Strain", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sensorGaugeFactorStrainPointTool.execute;
export default sensorGaugeFactorStrainPointTool;
