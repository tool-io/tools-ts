import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly normal: readonly number[];
  readonly signedDistance: number;
};
export type Output = {
  readonly normal: readonly number[];
  readonly signedDistance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normal: { type: "array", maxItems: 256, items: { type: "number" } },
    signedDistance: { type: "number" },
  },
  required: ["normal", "signedDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normal: { type: "array", maxItems: 256, items: { type: "number" } },
    signedDistance: { type: "number" },
  },
  required: ["normal", "signedDistance"],
} as const;
/** Calculate vector unit normal reference reversal from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { normal, signedDistance } = input;
  const compute = (): Output => {
    H.domain(normal.length > 0 && Math.abs(Math.hypot(...normal) - 1) <= 1e-12);
    return { normal: normal.map((x) => -x), signedDistance: -signedDistance };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { normal: [0, 1], signedDistance: 3 },
  output: { normal: [0, -1], signedDistance: -3 },
} satisfies ToolExample<Input, Output>;
export const vectorUnitNormalReferenceReversalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/vector-unit-normal-reference-reversal",
    title: "Vector Unit Normal Reference Reversal Tool",
    description:
      "Calculate vector unit normal reference reversal from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normal: { type: "array", maxItems: 256, items: { type: "number" } },
        signedDistance: { type: "number" },
      },
      required: ["normal", "signedDistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normal: { type: "array", maxItems: 256, items: { type: "number" } },
        signedDistance: { type: "number" },
      },
      required: ["normal", "signedDistance"],
    },
    ports: {
      inputs: [
        {
          id: "normal",
          label: "Normal",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "signedDistance",
          label: "Signed Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "normal",
          label: "Normal",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "signedDistance",
          label: "Signed Distance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = vectorUnitNormalReferenceReversalTool.execute;
export default vectorUnitNormalReferenceReversalTool;
