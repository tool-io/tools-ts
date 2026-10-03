import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: readonly string[];
  readonly second: readonly string[];
  readonly witness: string;
};
export type Output = { readonly counterexample: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    second: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    witness: { type: "string", maxLength: 8192 },
  },
  required: ["first", "second", "witness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { counterexample: { type: "boolean" } },
  required: ["counterexample"],
} as const;
/** Calculate subset counterexample single witness from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, witness } = request;
  const compute = (): Output => {
    return {
      counterexample: first.includes(witness) && !second.includes(witness),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: ["a", "b"], second: ["a"], witness: "b" },
  output: { counterexample: true },
} satisfies ToolExample<Input, Output>;
export const subsetCounterexampleSingleWitnessTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/subset-counterexample-single-witness",
    title: "Subset Counterexample Single Witness Tool",
    description:
      "Calculate subset counterexample single witness from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        second: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        witness: { type: "string", maxLength: 8192 },
      },
      required: ["first", "second", "witness"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { counterexample: { type: "boolean" } },
      required: ["counterexample"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "witness",
          label: "Witness",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "counterexample",
          label: "Counterexample",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = subsetCounterexampleSingleWitnessTool.execute;
export default subsetCounterexampleSingleWitnessTool;
