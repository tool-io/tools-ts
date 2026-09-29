import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly first: number; readonly second: number };
export type Output = {
  readonly affinity: number;
  readonly squaredDistanceTerm: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number", minimum: 0, maximum: 1 },
    second: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    affinity: { type: "number" },
    squaredDistanceTerm: { type: "number" },
  },
  required: ["affinity", "squaredDistanceTerm"],
} as const;
/** Calculate hellinger affinity symbol term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    H.probability(first);
    H.probability(second);
    const a = Math.sqrt(first),
      b = Math.sqrt(second);
    return { affinity: a * b, squaredDistanceTerm: 0.5 * (a - b) ** 2 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 0.25, second: 1 },
  output: { affinity: 0.5, squaredDistanceTerm: 0.125 },
} satisfies ToolExample<Input, Output>;
export const hellingerAffinitySymbolTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information/hellinger-affinity-symbol-term",
    title: "Hellinger Affinity Symbol Term Tool",
    description:
      "Calculate hellinger affinity symbol term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "number", minimum: 0, maximum: 1 },
        second: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        affinity: { type: "number" },
        squaredDistanceTerm: { type: "number" },
      },
      required: ["affinity", "squaredDistanceTerm"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "affinity", label: "Affinity", valueType: { type: "number" } },
        {
          id: "squaredDistanceTerm",
          label: "Squared Distance Term",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hellingerAffinitySymbolTermTool.execute;
export default hellingerAffinitySymbolTermTool;
