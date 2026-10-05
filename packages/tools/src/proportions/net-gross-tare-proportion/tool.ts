import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly grossMass: number; readonly tareMass: number };
export type Output = {
  readonly netMass: number;
  readonly netShare: number;
  readonly tareShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossMass: { type: "number", exclusiveMinimum: 0 },
    tareMass: { type: "number", minimum: 0 },
  },
  required: ["grossMass", "tareMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netMass: { type: "number" },
    netShare: { type: "number" },
    tareShare: { type: "number" },
  },
  required: ["netMass", "netShare", "tareShare"],
} as const;
/** Split gross mass into net and tare shares using a positive gross reference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossMass, tareMass } = request;
  const compute = (): Output => {
    (H.domain(grossMass > 0, "grossMass"), grossMass);
    H.domain(tareMass >= 0 && tareMass <= grossMass, "tareMass");
    return {
      netMass: grossMass - tareMass,
      netShare: (grossMass - tareMass) / grossMass,
      tareShare: tareMass / grossMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossMass: 25, tareMass: 5 },
  output: { netMass: 20, netShare: 0.8, tareShare: 0.2 },
} satisfies ToolExample<Input, Output>;
export const netGrossTareProportionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/net-gross-tare-proportion",
    title: "Net Gross Tare Proportion Tool",
    description:
      "Split gross mass into net and tare shares using a positive gross reference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossMass: { type: "number", exclusiveMinimum: 0 },
        tareMass: { type: "number", minimum: 0 },
      },
      required: ["grossMass", "tareMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netMass: { type: "number" },
        netShare: { type: "number" },
        tareShare: { type: "number" },
      },
      required: ["netMass", "netShare", "tareShare"],
    },
    ports: {
      inputs: [
        {
          id: "grossMass",
          label: "Gross Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tareMass",
          label: "Tare Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netMass", label: "Net Mass", valueType: { type: "number" } },
        { id: "netShare", label: "Net Share", valueType: { type: "number" } },
        { id: "tareShare", label: "Tare Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = netGrossTareProportionTool.execute;
export default netGrossTareProportionTool;
