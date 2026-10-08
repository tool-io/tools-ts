import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstAbsolutePressure: number;
  readonly secondAbsolutePressure: number;
};
export type Output = {
  readonly pressureRatio: number;
  readonly naturalLogRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAbsolutePressure: { type: "number", exclusiveMinimum: 0 },
    secondAbsolutePressure: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstAbsolutePressure", "secondAbsolutePressure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pressureRatio: { type: "number" },
    naturalLogRatio: { type: "number" },
  },
  required: ["pressureRatio", "naturalLogRatio"],
} as const;
/** Compare two explicitly positive absolute cryostat pressures by ratio and natural log ratio without converting gauge pressure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstAbsolutePressure, secondAbsolutePressure } = request;
  const compute = (): Output => {
    (H.domain(firstAbsolutePressure > 0, "firstAbsolutePressure"),
      firstAbsolutePressure);
    (H.domain(secondAbsolutePressure > 0, "secondAbsolutePressure"),
      secondAbsolutePressure);
    return {
      pressureRatio: secondAbsolutePressure / firstAbsolutePressure,
      naturalLogRatio:
        Math.log(secondAbsolutePressure) - Math.log(firstAbsolutePressure),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstAbsolutePressure: 10, secondAbsolutePressure: 100 },
  output: { pressureRatio: 10, naturalLogRatio: 2.302585092994046 },
} satisfies ToolExample<Input, Output>;
export const cryostatLogPressureRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cryogenics", "physics"],
      keywords: ["cryogenics", "physics"],
    },
    id: "cryogenics/cryostat-log-pressure-ratio",
    title: "Cryostat Log Pressure Ratio",
    description:
      "Compare two explicitly positive absolute cryostat pressures by ratio and natural log ratio without converting gauge pressure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstAbsolutePressure: { type: "number", exclusiveMinimum: 0 },
        secondAbsolutePressure: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstAbsolutePressure", "secondAbsolutePressure"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pressureRatio: { type: "number" },
        naturalLogRatio: { type: "number" },
      },
      required: ["pressureRatio", "naturalLogRatio"],
    },
    ports: {
      inputs: [
        {
          id: "firstAbsolutePressure",
          label: "First Absolute Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondAbsolutePressure",
          label: "Second Absolute Pressure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "pressureRatio",
          label: "Pressure Ratio",
          valueType: { type: "number" },
        },
        {
          id: "naturalLogRatio",
          label: "Natural Log Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cryostatLogPressureRatioTool.execute;
export default cryostatLogPressureRatioTool;
