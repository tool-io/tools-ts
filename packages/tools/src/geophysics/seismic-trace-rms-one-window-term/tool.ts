import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly samples: readonly number[];
  readonly removeMean: boolean;
};
export type Output = { readonly mean: number; readonly rms: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    samples: { type: "array", maxItems: 256, items: { type: "number" } },
    removeMean: { type: "boolean" },
  },
  required: ["samples", "removeMean"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { mean: { type: "number" }, rms: { type: "number" } },
  required: ["mean", "rms"],
} as const;
/** Window RMS optionally after demeaning; denominator is N, not a sample-variance degrees-of-freedom correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { samples, removeMean } = request;
  const compute = (): Output => {
    H.domain(samples.length > 0, "samples");
    const scale = Math.max(...samples.map((x) => Math.abs(x)));
    if (scale === 0) return { mean: 0, rms: 0 };
    const normalized = samples.map((x) => x / scale),
      meanNormalized = normalized.reduce(
        (a, b) => a + b / normalized.length,
        0,
      );
    return {
      mean: meanNormalized * scale,
      rms:
        scale *
        (Math.hypot(
          ...normalized.map((x) => (removeMean ? x - meanNormalized : x)),
        ) /
          Math.sqrt(samples.length)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { samples: [3, 4], removeMean: false },
  output: { mean: 3.5, rms: 3.5355339059327373 },
} satisfies ToolExample<Input, Output>;
export const seismicTraceRmsOneWindowTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geophysics/seismic-trace-rms-one-window-term",
    title: "Seismic Trace RMS One Window Term Tool",
    description:
      "Window RMS optionally after demeaning; denominator is N, not a sample-variance degrees-of-freedom correction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        samples: { type: "array", maxItems: 256, items: { type: "number" } },
        removeMean: { type: "boolean" },
      },
      required: ["samples", "removeMean"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { mean: { type: "number" }, rms: { type: "number" } },
      required: ["mean", "rms"],
    },
    ports: {
      inputs: [
        {
          id: "samples",
          label: "Samples",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "removeMean",
          label: "Remove Mean",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "mean", label: "Mean", valueType: { type: "number" } },
        { id: "rms", label: "Rms", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = seismicTraceRmsOneWindowTermTool.execute;
export default seismicTraceRmsOneWindowTermTool;
