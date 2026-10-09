import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedReferenceTempo: number;
  readonly measuredTempo: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedReferenceTempo: { type: "number" },
    measuredTempo: { type: "number" },
  },
  required: ["suppliedReferenceTempo", "measuredTempo"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate supplied measured-minus-local-reference tempo in a shared explicit beat basis without converting rhythmic traditions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedReferenceTempo, measuredTempo } = request;
  const compute = (): Output => {
    return { signedGap: measuredTempo - suppliedReferenceTempo };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedReferenceTempo: 12, measuredTempo: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const performanceTempoLocalReferenceOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ethnomusicology/performance-tempo-local-reference-offset",
      title: "Performance Tempo Local Reference Offset Tool",
      description:
        "Calculate supplied measured-minus-local-reference tempo in a shared explicit beat basis without converting rhythmic traditions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          suppliedReferenceTempo: { type: "number" },
          measuredTempo: { type: "number" },
        },
        required: ["suppliedReferenceTempo", "measuredTempo"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { signedGap: { type: "number" } },
        required: ["signedGap"],
      },
      ports: {
        inputs: [
          {
            id: "suppliedReferenceTempo",
            label: "Supplied Reference Tempo",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "measuredTempo",
            label: "Measured Tempo",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "signedGap",
            label: "Signed Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = performanceTempoLocalReferenceOffsetTool.execute;
export default performanceTempoLocalReferenceOffsetTool;
