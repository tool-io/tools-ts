import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly before: number;
  readonly after: number;
  readonly modulus: number;
  readonly resetOccurred: boolean;
};
export type Output = { readonly increment: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    before: { type: "integer", minimum: 0 },
    after: { type: "integer", minimum: 0 },
    modulus: { type: "integer", minimum: 1 },
    resetOccurred: { type: "boolean" },
  },
  required: ["before", "after", "modulus", "resetOccurred"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { increment: { type: "integer" } },
  required: ["increment"],
} as const;
/** Compute an exact supplied counter difference with zero or one explicitly known modular rollover. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { before, after, modulus, resetOccurred } = request;
  const compute = (): Output => {
    H.integer(modulus, 1);
    H.integer(before, 0, modulus - 1);
    H.integer(after, 0, modulus - 1);
    if (!resetOccurred) H.domain(after >= before);
    return {
      increment: resetOccurred
        ? Number(BigInt(modulus) - BigInt(before) + BigInt(after))
        : after - before,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { before: 98, after: 3, modulus: 100, resetOccurred: true },
  output: { increment: 5 },
} satisfies ToolExample<Input, Output>;
export const grainCounterResetBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/grain-counter-reset-boundary",
    title: "Grain Counter Reset Boundary Tool",
    description:
      "Compute an exact supplied counter difference with zero or one explicitly known modular rollover.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        before: { type: "integer", minimum: 0 },
        after: { type: "integer", minimum: 0 },
        modulus: { type: "integer", minimum: 1 },
        resetOccurred: { type: "boolean" },
      },
      required: ["before", "after", "modulus", "resetOccurred"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { increment: { type: "integer" } },
      required: ["increment"],
    },
    ports: {
      inputs: [
        {
          id: "before",
          label: "Before",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "after",
          label: "After",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "modulus",
          label: "Modulus",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "resetOccurred",
          label: "Reset Occurred",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "increment", label: "Increment", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = grainCounterResetBoundaryTool.execute;
export default grainCounterResetBoundaryTool;
