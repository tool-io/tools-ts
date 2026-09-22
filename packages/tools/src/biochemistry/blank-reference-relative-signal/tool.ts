import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signal: number;
  readonly blank: number;
  readonly reference: number;
};
export type Output = {
  readonly correctedSignal: number;
  readonly relativeSignal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signal: { type: "number" },
    blank: { type: "number" },
    reference: { type: "number" },
  },
  required: ["signal", "blank", "reference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedSignal: { type: "number" },
    relativeSignal: { type: "number" },
  },
  required: ["correctedSignal", "relativeSignal"],
} as const;
/** Calculate blank reference relative signal from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signal, blank, reference } = request;
  const compute = (): Output => {
    H.domain(reference !== blank);
    return {
      correctedSignal: signal - blank,
      relativeSignal: (signal - blank) / (reference - blank),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signal: 12, blank: 2, reference: 7 },
  output: { correctedSignal: 10, relativeSignal: 2 },
} satisfies ToolExample<Input, Output>;
export const blankReferenceRelativeSignalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biochemistry/blank-reference-relative-signal",
    title: "Blank Reference Relative Signal Tool",
    description:
      "Calculate blank reference relative signal from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signal: { type: "number" },
        blank: { type: "number" },
        reference: { type: "number" },
      },
      required: ["signal", "blank", "reference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedSignal: { type: "number" },
        relativeSignal: { type: "number" },
      },
      required: ["correctedSignal", "relativeSignal"],
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
          id: "blank",
          label: "Blank",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedSignal",
          label: "Corrected Signal",
          valueType: { type: "number" },
        },
        {
          id: "relativeSignal",
          label: "Relative Signal",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = blankReferenceRelativeSignalTool.execute;
export default blankReferenceRelativeSignalTool;
