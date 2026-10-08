import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startPotentialVolts: number;
  readonly endPotentialVolts: number;
  readonly scanRateVoltsPerSecond: number;
};
export type Output = { readonly sweepSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startPotentialVolts: { type: "number" },
    endPotentialVolts: { type: "number" },
    scanRateVoltsPerSecond: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "startPotentialVolts",
    "endPotentialVolts",
    "scanRateVoltsPerSecond",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sweepSeconds: { type: "number" } },
  required: ["sweepSeconds"],
} as const;
/** Compute the duration of one linear potential sweep from explicit endpoints and a positive scan-rate magnitude, excluding holds and return sweeps. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startPotentialVolts, endPotentialVolts, scanRateVoltsPerSecond } =
    request;
  const compute = (): Output => {
    (H.domain(scanRateVoltsPerSecond > 0, "scanRateVoltsPerSecond"),
      scanRateVoltsPerSecond);
    return {
      sweepSeconds:
        Math.abs(endPotentialVolts - startPotentialVolts) /
        scanRateVoltsPerSecond,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    startPotentialVolts: -0.2,
    endPotentialVolts: 0.8,
    scanRateVoltsPerSecond: 0.1,
  },
  output: { sweepSeconds: 10 },
} satisfies ToolExample<Input, Output>;
export const cvPotentialSweepTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["electrochemistry", "chemistry"],
      keywords: ["electrochemistry", "chemistry"],
    },
    id: "electrochemistry/cv-potential-sweep-time",
    title: "CV Potential Sweep Time",
    description:
      "Compute the duration of one linear potential sweep from explicit endpoints and a positive scan-rate magnitude, excluding holds and return sweeps.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startPotentialVolts: { type: "number" },
        endPotentialVolts: { type: "number" },
        scanRateVoltsPerSecond: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "startPotentialVolts",
        "endPotentialVolts",
        "scanRateVoltsPerSecond",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sweepSeconds: { type: "number" } },
      required: ["sweepSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "startPotentialVolts",
          label: "Start Potential Volts",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endPotentialVolts",
          label: "End Potential Volts",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scanRateVoltsPerSecond",
          label: "Scan Rate Volts Per Second",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sweepSeconds",
          label: "Sweep Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cvPotentialSweepTimeTool.execute;
export default cvPotentialSweepTimeTool;
