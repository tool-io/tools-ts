import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialBaseline: number;
  readonly driftPerSecond: number;
  readonly durationSeconds: number;
};
export type Output = { readonly baselineCharge: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialBaseline: { type: "number" },
    driftPerSecond: { type: "number" },
    durationSeconds: { type: "number", minimum: 0 },
  },
  required: ["initialBaseline", "driftPerSecond", "durationSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { baselineCharge: { type: "number" } },
  required: ["baselineCharge"],
} as const;
/** Integrate a supplied linearly drifting baseline current over an explicit elapsed interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialBaseline, driftPerSecond, durationSeconds } = request;
  const compute = (): Output => {
    H.domain(durationSeconds >= 0);
    return {
      baselineCharge:
        initialBaseline * durationSeconds +
        (driftPerSecond * durationSeconds ** 2) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialBaseline: 2, driftPerSecond: 1, durationSeconds: 4 },
  output: { baselineCharge: 16 },
} satisfies ToolExample<Input, Output>;
export const coulometricBaselineDriftTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electrochemistry/coulometric-baseline-drift-term",
    title: "Coulometric Baseline Drift Term Tool",
    description:
      "Integrate a supplied linearly drifting baseline current over an explicit elapsed interval.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialBaseline: { type: "number" },
        driftPerSecond: { type: "number" },
        durationSeconds: { type: "number", minimum: 0 },
      },
      required: ["initialBaseline", "driftPerSecond", "durationSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { baselineCharge: { type: "number" } },
      required: ["baselineCharge"],
    },
    ports: {
      inputs: [
        {
          id: "initialBaseline",
          label: "Initial Baseline",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "driftPerSecond",
          label: "Drift Per Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "durationSeconds",
          label: "Duration Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "baselineCharge",
          label: "Baseline Charge",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = coulometricBaselineDriftTermTool.execute;
export default coulometricBaselineDriftTermTool;
