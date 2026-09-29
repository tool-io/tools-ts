import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signal: number;
  readonly background: number;
  readonly referenceSignal: number;
};
export type Output = {
  readonly correctedSignal: number;
  readonly correctedReference: number;
  readonly fold: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signal: { type: "number" },
    background: { type: "number" },
    referenceSignal: { type: "number" },
  },
  required: ["signal", "background", "referenceSignal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedSignal: { type: "number" },
    correctedReference: { type: "number" },
    fold: { type: "number" },
  },
  required: ["correctedSignal", "correctedReference", "fold"],
} as const;
/** Calculate assay background fold reference from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signal, background, referenceSignal } = request;
  const compute = (): Output => {
    H.domain(referenceSignal !== background);
    return {
      correctedSignal: signal - background,
      correctedReference: referenceSignal - background,
      fold: (signal - background) / (referenceSignal - background),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signal: 12, background: 2, referenceSignal: 7 },
  output: { correctedSignal: 10, correctedReference: 5, fold: 2 },
} satisfies ToolExample<Input, Output>;
export const assayBackgroundFoldReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "immunology/assay-background-fold-reference",
    title: "Assay Background Fold Reference Tool",
    description:
      "Calculate assay background fold reference from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signal: { type: "number" },
        background: { type: "number" },
        referenceSignal: { type: "number" },
      },
      required: ["signal", "background", "referenceSignal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedSignal: { type: "number" },
        correctedReference: { type: "number" },
        fold: { type: "number" },
      },
      required: ["correctedSignal", "correctedReference", "fold"],
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
          id: "background",
          label: "Background",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceSignal",
          label: "Reference Signal",
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
          id: "correctedReference",
          label: "Corrected Reference",
          valueType: { type: "number" },
        },
        { id: "fold", label: "Fold", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = assayBackgroundFoldReferenceTool.execute;
export default assayBackgroundFoldReferenceTool;
