import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly index: number;
  readonly origin: number;
  readonly length: number;
};
export type Output = { readonly phase: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    index: { type: "integer" },
    origin: { type: "integer" },
    length: { type: "integer", minimum: 1 },
  },
  required: ["index", "origin", "length"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { phase: { type: "integer" } },
  required: ["phase"],
} as const;
/** Calculate cyclic list phase remainder from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { index, origin, length } = request;
  const compute = (): Output => {
    H.integer(length, 1);
    return {
      phase: (() => {
        const n = BigInt(length),
          d = BigInt(index) - BigInt(origin);
        return Number(((d % n) + n) % n);
      })(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { index: 12, origin: 3, length: 5 },
  output: { phase: 4 },
} satisfies ToolExample<Input, Output>;
export const cyclicListPhaseRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/cyclic-list-phase-remainder",
    title: "Cyclic List Phase Remainder Tool",
    description:
      "Calculate cyclic list phase remainder from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        index: { type: "integer" },
        origin: { type: "integer" },
        length: { type: "integer", minimum: 1 },
      },
      required: ["index", "origin", "length"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { phase: { type: "integer" } },
      required: ["phase"],
    },
    ports: {
      inputs: [
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "phase", label: "Phase", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = cyclicListPhaseRemainderTool.execute;
export default cyclicListPhaseRemainderTool;
