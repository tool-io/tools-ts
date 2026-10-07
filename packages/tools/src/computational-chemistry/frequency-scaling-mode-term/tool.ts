import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly computedFrequency: number;
  readonly suppliedScaleFactor: number;
};
export type Output = { readonly scaledFrequency: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    computedFrequency: { type: "number" },
    suppliedScaleFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["computedFrequency", "suppliedScaleFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { scaledFrequency: { type: "number" } },
  required: ["scaledFrequency"],
} as const;
/** Apply an explicit positive scale factor to a signed computed vibrational frequency, preserving imaginary-mode sign conventions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { computedFrequency, suppliedScaleFactor } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(suppliedScaleFactor) && suppliedScaleFactor > 0,
      "suppliedScaleFactor",
    ),
      suppliedScaleFactor);
    return { scaledFrequency: computedFrequency * suppliedScaleFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { computedFrequency: 1000, suppliedScaleFactor: 0.96 },
  output: { scaledFrequency: 960 },
} satisfies ToolExample<Input, Output>;
export const frequencyScalingModeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "computational-chemistry",
        "computational chemistry",
        "chemistry",
      ],
      keywords: ["computational chemistry", "chemistry"],
    },
    id: "computational-chemistry/frequency-scaling-mode-term",
    title: "Frequency Scaling Mode Term",
    description:
      "Apply an explicit positive scale factor to a signed computed vibrational frequency, preserving imaginary-mode sign conventions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        computedFrequency: { type: "number" },
        suppliedScaleFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["computedFrequency", "suppliedScaleFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { scaledFrequency: { type: "number" } },
      required: ["scaledFrequency"],
    },
    ports: {
      inputs: [
        {
          id: "computedFrequency",
          label: "Computed Frequency",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedScaleFactor",
          label: "Supplied Scale Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "scaledFrequency",
          label: "Scaled Frequency",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = frequencyScalingModeTermTool.execute;
export default frequencyScalingModeTermTool;
