import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly values: readonly number[] };
export type Output = {
  readonly l1Mass: number;
  readonly reciprocalMass: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    values: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["values"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    l1Mass: { type: "number" },
    reciprocalMass: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["l1Mass", "reciprocalMass", "defined"],
} as const;
/** Calculate signed l1 mass factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { values } = request;
  const compute = (): Output => {
    return {
      l1Mass: values.reduce((a, b) => a + Math.abs(b), 0),
      reciprocalMass: values.some((x) => x !== 0)
        ? 1 / values.reduce((a, b) => a + Math.abs(b), 0)
        : 0,
      defined: values.some((x) => x !== 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { values: [2, -3, 0] },
  output: { l1Mass: 5, reciprocalMass: 0.2, defined: true },
} satisfies ToolExample<Input, Output>;
export const signedL1MassFactorTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "normalize/signed-l1-mass-factor",
    title: "Signed L1 Mass Factor Tool",
    description:
      "Calculate signed l1 mass factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        values: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["values"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        l1Mass: { type: "number" },
        reciprocalMass: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["l1Mass", "reciprocalMass", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "values",
          label: "Values",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "l1Mass", label: "L1Mass", valueType: { type: "number" } },
        {
          id: "reciprocalMass",
          label: "Reciprocal Mass",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = signedL1MassFactorTool.execute;
export default signedL1MassFactorTool;
