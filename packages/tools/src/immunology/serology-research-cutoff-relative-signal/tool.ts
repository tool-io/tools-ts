import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signal: number;
  readonly cutoff: number;
  readonly blank: number;
};
export type Output = {
  readonly relativeSignal: number;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signal: { type: "number" },
    cutoff: { type: "number" },
    blank: { type: "number" },
  },
  required: ["signal", "cutoff", "blank"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativeSignal: { type: "number" },
    margin: { type: "number" },
  },
  required: ["relativeSignal", "margin"],
} as const;
/** Signal relative to an explicitly supplied blank-corrected research cutoff; no diagnosis or assay-specific cutoff is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signal, cutoff, blank } = request;
  const compute = (): Output => {
    H.domain(cutoff > blank);
    return {
      relativeSignal: (signal - blank) / (cutoff - blank),
      margin: signal - cutoff,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signal: 120, cutoff: 100, blank: 20 },
  output: { relativeSignal: 1.25, margin: 20 },
} satisfies ToolExample<Input, Output>;
export const serologyResearchCutoffRelativeSignalTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "immunology/serology-research-cutoff-relative-signal",
      title: "Serology Research Cutoff Relative Signal Tool",
      description:
        "Signal relative to an explicitly supplied blank-corrected research cutoff; no diagnosis or assay-specific cutoff is inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          signal: { type: "number" },
          cutoff: { type: "number" },
          blank: { type: "number" },
        },
        required: ["signal", "cutoff", "blank"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          relativeSignal: { type: "number" },
          margin: { type: "number" },
        },
        required: ["relativeSignal", "margin"],
      },
      ports: {
        inputs: [
          {
            id: "signal",
            label: "Signal",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "cutoff",
            label: "Cutoff",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "blank",
            label: "Blank",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "relativeSignal",
            label: "Relative Signal",
            valueType: { type: "number" },
          },
          { id: "margin", label: "Margin", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = serologyResearchCutoffRelativeSignalTool.execute;
export default serologyResearchCutoffRelativeSignalTool;
