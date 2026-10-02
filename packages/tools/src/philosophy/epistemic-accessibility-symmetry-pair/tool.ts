import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly forward: boolean; readonly reverse: boolean };
export type Output = {
  readonly symmetricOnPair: boolean;
  readonly witness: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { forward: { type: "boolean" }, reverse: { type: "boolean" } },
  required: ["forward", "reverse"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    symmetricOnPair: { type: "boolean" },
    witness: { type: "boolean" },
  },
  required: ["symmetricOnPair", "witness"],
} as const;
/** Calculate epistemic accessibility symmetry pair from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { forward, reverse } = request;
  const compute = (): Output => {
    return {
      symmetricOnPair: forward === reverse,
      witness: forward !== reverse,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { forward: true, reverse: false },
  output: { symmetricOnPair: false, witness: true },
} satisfies ToolExample<Input, Output>;
export const epistemicAccessibilitySymmetryPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "philosophy/epistemic-accessibility-symmetry-pair",
    title: "Epistemic Accessibility Symmetry Pair Tool",
    description:
      "Calculate epistemic accessibility symmetry pair from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        forward: { type: "boolean" },
        reverse: { type: "boolean" },
      },
      required: ["forward", "reverse"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        symmetricOnPair: { type: "boolean" },
        witness: { type: "boolean" },
      },
      required: ["symmetricOnPair", "witness"],
    },
    ports: {
      inputs: [
        {
          id: "forward",
          label: "Forward",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "reverse",
          label: "Reverse",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "symmetricOnPair",
          label: "Symmetric On Pair",
          valueType: { type: "boolean" },
        },
        { id: "witness", label: "Witness", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = epistemicAccessibilitySymmetryPairTool.execute;
export default epistemicAccessibilitySymmetryPairTool;
