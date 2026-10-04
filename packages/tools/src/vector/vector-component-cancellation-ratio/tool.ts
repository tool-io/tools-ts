import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly components: readonly number[] };
export type Output = {
  readonly signedSum: number;
  readonly absoluteMass: number;
  readonly retainedRatio: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    components: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["components"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedSum: { type: "number" },
    absoluteMass: { type: "number" },
    retainedRatio: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["signedSum", "absoluteMass", "retainedRatio", "defined"],
} as const;
/** Calculate vector component cancellation ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { components } = request;
  const compute = (): Output => {
    return {
      signedSum: components.reduce((a, b) => a + b, 0),
      absoluteMass: components.reduce((a, b) => a + Math.abs(b), 0),
      retainedRatio: components.some((x) => x !== 0)
        ? Math.abs(components.reduce((a, b) => a + b, 0)) /
          components.reduce((a, b) => a + Math.abs(b), 0)
        : 0,
      defined: components.some((x) => x !== 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { components: [3, -2] },
  output: { signedSum: 1, absoluteMass: 5, retainedRatio: 0.2, defined: true },
} satisfies ToolExample<Input, Output>;
export const vectorComponentCancellationRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/vector-component-cancellation-ratio",
    title: "Vector Component Cancellation Ratio Tool",
    description:
      "Calculate vector component cancellation ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        components: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["components"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedSum: { type: "number" },
        absoluteMass: { type: "number" },
        retainedRatio: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["signedSum", "absoluteMass", "retainedRatio", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "components",
          label: "Components",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "signedSum", label: "Signed Sum", valueType: { type: "number" } },
        {
          id: "absoluteMass",
          label: "Absolute Mass",
          valueType: { type: "number" },
        },
        {
          id: "retainedRatio",
          label: "Retained Ratio",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = vectorComponentCancellationRatioTool.execute;
export default vectorComponentCancellationRatioTool;
