import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly masses: readonly number[] };
export type Output = {
  readonly sum: number;
  readonly residual: number;
  readonly exceedsUnit: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    masses: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["masses"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sum: { type: "number" },
    residual: { type: "number" },
    exceedsUnit: { type: "boolean" },
  },
  required: ["sum", "residual", "exceedsUnit"],
} as const;
/** Audit supplied candidate finite-support masses without silently normalizing an invalid total. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { masses } = request;
  const compute = (): Output => {
    H.domain(masses.every((x) => x >= 0 && x <= 1));
    return {
      sum: masses.reduce((a, b) => a + b, 0),
      residual: 1 - masses.reduce((a, b) => a + b, 0),
      exceedsUnit: masses.reduce((a, b) => a + b, 0) > 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { masses: [0.2, 0.3] },
  output: { sum: 0.5, residual: 0.5, exceedsUnit: false },
} satisfies ToolExample<Input, Output>;
export const finiteSupportMassResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "probability/finite-support-mass-residual",
    title: "Finite Support Mass Residual Tool",
    description:
      "Audit supplied candidate finite-support masses without silently normalizing an invalid total.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        masses: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["masses"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sum: { type: "number" },
        residual: { type: "number" },
        exceedsUnit: { type: "boolean" },
      },
      required: ["sum", "residual", "exceedsUnit"],
    },
    ports: {
      inputs: [
        {
          id: "masses",
          label: "Masses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "sum", label: "Sum", valueType: { type: "number" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
        {
          id: "exceedsUnit",
          label: "Exceeds Unit",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = finiteSupportMassResidualTool.execute;
export default finiteSupportMassResidualTool;
