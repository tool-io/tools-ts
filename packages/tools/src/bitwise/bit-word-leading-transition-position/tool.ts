import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly bits: string };
export type Output = {
  readonly hasTransition: boolean;
  readonly transitionIndex: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bits: { type: "string", maxLength: 8192 } },
  required: ["bits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hasTransition: { type: "boolean" },
    transitionIndex: { type: "integer" },
  },
  required: ["hasTransition", "transitionIndex"],
} as const;
/** Index of the first bit differing from its predecessor, counting from the supplied most-significant end. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bits } = request;
  const compute = (): Output => {
    H.domain(/^[01]+(?![\s\S])/.test(bits));
    let transitionIndex = -1;
    for (let i = 1; i < bits.length; i++)
      if (bits[i] !== bits[i - 1]) {
        transitionIndex = i;
        break;
      }
    return { hasTransition: transitionIndex !== -1, transitionIndex };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bits: "000110" },
  output: { hasTransition: true, transitionIndex: 3 },
} satisfies ToolExample<Input, Output>;
export const bitWordLeadingTransitionPositionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bitwise/bit-word-leading-transition-position",
    title: "Bit Word Leading Transition Position Tool",
    description:
      "Index of the first bit differing from its predecessor, counting from the supplied most-significant end.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { bits: { type: "string", maxLength: 8192 } },
      required: ["bits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hasTransition: { type: "boolean" },
        transitionIndex: { type: "integer" },
      },
      required: ["hasTransition", "transitionIndex"],
    },
    ports: {
      inputs: [
        {
          id: "bits",
          label: "Bits",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "hasTransition",
          label: "Has Transition",
          valueType: { type: "boolean" },
        },
        {
          id: "transitionIndex",
          label: "Transition Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = bitWordLeadingTransitionPositionTool.execute;
export default bitWordLeadingTransitionPositionTool;
