import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialMass: number;
  readonly inflowMass: number;
  readonly outflowMass: number;
  readonly measuredFinal: number;
};
export type Output = {
  readonly expectedFinal: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialMass: { type: "number", minimum: 0 },
    inflowMass: { type: "number", minimum: 0 },
    outflowMass: { type: "number", minimum: 0 },
    measuredFinal: { type: "number", minimum: 0 },
  },
  required: ["initialMass", "inflowMass", "outflowMass", "measuredFinal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedFinal: { type: "number" },
    residual: { type: "number" },
  },
  required: ["expectedFinal", "residual"],
} as const;
/** Supplied contaminant-mass ledger residual without a remediation efficacy model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialMass, inflowMass, outflowMass, measuredFinal } = request;
  const compute = (): Output => {
    H.domain(
      initialMass >= 0 &&
        inflowMass >= 0 &&
        outflowMass >= 0 &&
        outflowMass <= initialMass + inflowMass &&
        measuredFinal >= 0,
    );
    return {
      expectedFinal: initialMass + inflowMass - outflowMass,
      residual: measuredFinal - initialMass - inflowMass + outflowMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialMass: 100,
    inflowMass: 10,
    outflowMass: 30,
    measuredFinal: 75,
  },
  output: { expectedFinal: 80, residual: -5 },
} satisfies ToolExample<Input, Output>;
export const contaminantMassClosureGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioremediation/contaminant-mass-closure-gap",
    title: "Contaminant Mass Closure Gap Tool",
    description:
      "Supplied contaminant-mass ledger residual without a remediation efficacy model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialMass: { type: "number", minimum: 0 },
        inflowMass: { type: "number", minimum: 0 },
        outflowMass: { type: "number", minimum: 0 },
        measuredFinal: { type: "number", minimum: 0 },
      },
      required: ["initialMass", "inflowMass", "outflowMass", "measuredFinal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedFinal: { type: "number" },
        residual: { type: "number" },
      },
      required: ["expectedFinal", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "initialMass",
          label: "Initial Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inflowMass",
          label: "Inflow Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outflowMass",
          label: "Outflow Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredFinal",
          label: "Measured Final",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedFinal",
          label: "Expected Final",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = contaminantMassClosureGapTool.execute;
export default contaminantMassClosureGapTool;
