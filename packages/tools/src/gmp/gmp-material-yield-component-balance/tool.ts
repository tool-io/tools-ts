import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly charged: number;
  readonly added: number;
  readonly output: number;
  readonly recovered: number;
  readonly discarded: number;
};
export type Output = {
  readonly totalInput: number;
  readonly accountedOutput: number;
  readonly residual: number;
  readonly yieldFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    charged: { type: "number", minimum: 0 },
    added: { type: "number", minimum: 0 },
    output: { type: "number", minimum: 0 },
    recovered: { type: "number", minimum: 0 },
    discarded: { type: "number", minimum: 0 },
  },
  required: ["charged", "added", "output", "recovered", "discarded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalInput: { type: "number" },
    accountedOutput: { type: "number" },
    residual: { type: "number" },
    yieldFraction: { type: "number" },
  },
  required: ["totalInput", "accountedOutput", "residual", "yieldFraction"],
} as const;
/** Reconcile explicit material mass records without process compliance certification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { charged, added, output, recovered, discarded } = request;
  const compute = (): Output => {
    H.domain(
      charged >= 0 &&
        added >= 0 &&
        charged + added > 0 &&
        output >= 0 &&
        recovered >= 0 &&
        discarded >= 0,
    );
    return {
      totalInput: charged + added,
      accountedOutput: output + recovered + discarded,
      residual: charged + added - output - recovered - discarded,
      yieldFraction: output / (charged + added),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { charged: 100, added: 20, output: 100, recovered: 5, discarded: 10 },
  output: {
    totalInput: 120,
    accountedOutput: 115,
    residual: 5,
    yieldFraction: 0.8333333333333334,
  },
} satisfies ToolExample<Input, Output>;
export const gmpMaterialYieldComponentBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gmp/gmp-material-yield-component-balance",
    title: "GMP Material Yield Component Balance Tool",
    description:
      "Reconcile explicit material mass records without process compliance certification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        charged: { type: "number", minimum: 0 },
        added: { type: "number", minimum: 0 },
        output: { type: "number", minimum: 0 },
        recovered: { type: "number", minimum: 0 },
        discarded: { type: "number", minimum: 0 },
      },
      required: ["charged", "added", "output", "recovered", "discarded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalInput: { type: "number" },
        accountedOutput: { type: "number" },
        residual: { type: "number" },
        yieldFraction: { type: "number" },
      },
      required: ["totalInput", "accountedOutput", "residual", "yieldFraction"],
    },
    ports: {
      inputs: [
        {
          id: "charged",
          label: "Charged",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "added",
          label: "Added",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "output",
          label: "Output",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recovered",
          label: "Recovered",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "discarded",
          label: "Discarded",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalInput",
          label: "Total Input",
          valueType: { type: "number" },
        },
        {
          id: "accountedOutput",
          label: "Accounted Output",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
        {
          id: "yieldFraction",
          label: "Yield Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gmpMaterialYieldComponentBalanceTool.execute;
export default gmpMaterialYieldComponentBalanceTool;
