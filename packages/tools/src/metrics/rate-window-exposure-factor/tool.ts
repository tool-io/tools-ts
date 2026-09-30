import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedDuration: number;
  readonly windowDuration: number;
};
export type Output = { readonly exposureFactor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedDuration: { type: "number", minimum: 0 },
    windowDuration: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observedDuration", "windowDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { exposureFactor: { type: "number" } },
  required: ["exposureFactor"],
} as const;
/** Calculate rate window exposure factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedDuration, windowDuration } = request;
  const compute = (): Output => {
    H.domain(observedDuration >= 0);
    H.positive(windowDuration);
    return { exposureFactor: observedDuration / windowDuration };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedDuration: 30, windowDuration: 60 },
  output: { exposureFactor: 0.5 },
} satisfies ToolExample<Input, Output>;
export const rateWindowExposureFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/rate-window-exposure-factor",
    title: "Rate Window Exposure Factor Tool",
    description:
      "Calculate rate window exposure factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedDuration: { type: "number", minimum: 0 },
        windowDuration: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["observedDuration", "windowDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { exposureFactor: { type: "number" } },
      required: ["exposureFactor"],
    },
    ports: {
      inputs: [
        {
          id: "observedDuration",
          label: "Observed Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "windowDuration",
          label: "Window Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "exposureFactor",
          label: "Exposure Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rateWindowExposureFactorTool.execute;
export default rateWindowExposureFactorTool;
