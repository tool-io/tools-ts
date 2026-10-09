import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedSeconds: number;
  readonly referenceSeconds: number;
};
export type Output = { readonly residualSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedSeconds: { type: "number" },
    referenceSeconds: { type: "number" },
  },
  required: ["observedSeconds", "referenceSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residualSeconds: { type: "number" } },
  required: ["residualSeconds"],
} as const;
/** Compare one supplied musical onset with an explicit pulse reference on the same clock. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedSeconds, referenceSeconds } = request;
  const compute = (): Output => {
    return { residualSeconds: observedSeconds - referenceSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedSeconds: 2.55, referenceSeconds: 2.5 },
  output: { residualSeconds: 0.04999999999999982 },
} satisfies ToolExample<Input, Output>;
export const musicalPulseTimingResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["ethnomusicology", "arts and design"],
      keywords: ["ethnomusicology", "arts and design"],
    },
    id: "ethnomusicology/musical-pulse-timing-residual",
    title: "Musical Pulse Timing Residual",
    description:
      "Compare one supplied musical onset with an explicit pulse reference on the same clock.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedSeconds: { type: "number" },
        referenceSeconds: { type: "number" },
      },
      required: ["observedSeconds", "referenceSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { residualSeconds: { type: "number" } },
      required: ["residualSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "observedSeconds",
          label: "Observed Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceSeconds",
          label: "Reference Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "residualSeconds",
          label: "Residual Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = musicalPulseTimingResidualTool.execute;
export default musicalPulseTimingResidualTool;
