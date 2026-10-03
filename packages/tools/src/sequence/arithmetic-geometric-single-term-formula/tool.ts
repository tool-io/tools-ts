import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initial: number;
  readonly difference: number;
  readonly ratio: number;
  readonly index: number;
};
export type Output = { readonly term: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initial: { type: "number" },
    difference: { type: "number" },
    ratio: { type: "number" },
    index: { type: "integer", minimum: 0, maximum: 1000 },
  },
  required: ["initial", "difference", "ratio", "index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { term: { type: "number" } },
  required: ["term"],
} as const;
/** Calculate arithmetic geometric single term formula from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initial, difference, ratio, index } = request;
  const compute = (): Output => {
    H.integer(index, 0, 1000);
    return { term: (initial + index * difference) * ratio ** index };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initial: 2, difference: 3, ratio: 2, index: 3 },
  output: { term: 88 },
} satisfies ToolExample<Input, Output>;
export const arithmeticGeometricSingleTermFormulaTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "sequence/arithmetic-geometric-single-term-formula",
      title: "Arithmetic Geometric Single Term Formula Tool",
      description:
        "Calculate arithmetic geometric single term formula from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          initial: { type: "number" },
          difference: { type: "number" },
          ratio: { type: "number" },
          index: { type: "integer", minimum: 0, maximum: 1000 },
        },
        required: ["initial", "difference", "ratio", "index"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { term: { type: "number" } },
        required: ["term"],
      },
      ports: {
        inputs: [
          {
            id: "initial",
            label: "Initial",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "difference",
            label: "Difference",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "ratio",
            label: "Ratio",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "index",
            label: "Index",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [{ id: "term", label: "Term", valueType: { type: "number" } }],
      },
    },
    calculate,
  });
export const run = arithmeticGeometricSingleTermFormulaTool.execute;
export default arithmeticGeometricSingleTermFormulaTool;
