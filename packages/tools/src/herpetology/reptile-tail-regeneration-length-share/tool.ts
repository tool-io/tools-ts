import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalTail: number;
  readonly remainingOriginal: number;
  readonly regeneratedLength: number;
};
export type Output = {
  readonly presentTail: number;
  readonly regeneratedShare: number;
  readonly originalLengthRecovery: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalTail: { type: "number", exclusiveMinimum: 0 },
    remainingOriginal: { type: "number", minimum: 0 },
    regeneratedLength: { type: "number", minimum: 0 },
  },
  required: ["originalTail", "remainingOriginal", "regeneratedLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    presentTail: { type: "number" },
    regeneratedShare: { type: "number" },
    originalLengthRecovery: { type: "number" },
  },
  required: ["presentTail", "regeneratedShare", "originalLengthRecovery"],
} as const;
/** Calculate reptile tail regeneration length share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalTail, remainingOriginal, regeneratedLength } = request;
  const compute = (): Output => {
    H.positive(originalTail);
    H.domain(
      remainingOriginal >= 0 &&
        remainingOriginal <= originalTail &&
        regeneratedLength >= 0 &&
        remainingOriginal + regeneratedLength > 0,
    );
    return {
      presentTail: remainingOriginal + regeneratedLength,
      regeneratedShare:
        regeneratedLength / (remainingOriginal + regeneratedLength),
      originalLengthRecovery:
        (remainingOriginal + regeneratedLength) / originalTail,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { originalTail: 100, remainingOriginal: 40, regeneratedLength: 30 },
  output: {
    presentTail: 70,
    regeneratedShare: 0.42857142857142855,
    originalLengthRecovery: 0.7,
  },
} satisfies ToolExample<Input, Output>;
export const reptileTailRegenerationLengthShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "herpetology/reptile-tail-regeneration-length-share",
    title: "Reptile Tail Regeneration Length Share Tool",
    description:
      "Calculate reptile tail regeneration length share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalTail: { type: "number", exclusiveMinimum: 0 },
        remainingOriginal: { type: "number", minimum: 0 },
        regeneratedLength: { type: "number", minimum: 0 },
      },
      required: ["originalTail", "remainingOriginal", "regeneratedLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        presentTail: { type: "number" },
        regeneratedShare: { type: "number" },
        originalLengthRecovery: { type: "number" },
      },
      required: ["presentTail", "regeneratedShare", "originalLengthRecovery"],
    },
    ports: {
      inputs: [
        {
          id: "originalTail",
          label: "Original Tail",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "remainingOriginal",
          label: "Remaining Original",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "regeneratedLength",
          label: "Regenerated Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "presentTail",
          label: "Present Tail",
          valueType: { type: "number" },
        },
        {
          id: "regeneratedShare",
          label: "Regenerated Share",
          valueType: { type: "number" },
        },
        {
          id: "originalLengthRecovery",
          label: "Original Length Recovery",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = reptileTailRegenerationLengthShareTool.execute;
export default reptileTailRegenerationLengthShareTool;
