import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstSymbol: string;
  readonly secondSymbol: string;
  readonly samePosition: boolean;
};
export type Output = { readonly orbitSize: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstSymbol: { type: "string", maxLength: 8192 },
    secondSymbol: { type: "string", maxLength: 8192 },
    samePosition: { type: "boolean" },
  },
  required: ["firstSymbol", "secondSymbol", "samePosition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { orbitSize: { type: "integer" } },
  required: ["orbitSize"],
} as const;
/** Count the orbit of one explicit pair under a single swap, including equal symbols and identical-position swaps. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstSymbol, secondSymbol, samePosition } = request;
  const compute = (): Output => {
    H.domain(!samePosition || firstSymbol === secondSymbol);
    return { orbitSize: samePosition || firstSymbol === secondSymbol ? 1 : 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstSymbol: "A", secondSymbol: "B", samePosition: false },
  output: { orbitSize: 2 },
} satisfies ToolExample<Input, Output>;
export const multisetSwapOrbitSizeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "combinatorics/multiset-swap-orbit-size",
    title: "Multiset Swap Orbit Size Tool",
    description:
      "Count the orbit of one explicit pair under a single swap, including equal symbols and identical-position swaps.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstSymbol: { type: "string", maxLength: 8192 },
        secondSymbol: { type: "string", maxLength: 8192 },
        samePosition: { type: "boolean" },
      },
      required: ["firstSymbol", "secondSymbol", "samePosition"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { orbitSize: { type: "integer" } },
      required: ["orbitSize"],
    },
    ports: {
      inputs: [
        {
          id: "firstSymbol",
          label: "First Symbol",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondSymbol",
          label: "Second Symbol",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "samePosition",
          label: "Same Position",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "orbitSize",
          label: "Orbit Size",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = multisetSwapOrbitSizeTool.execute;
export default multisetSwapOrbitSizeTool;
