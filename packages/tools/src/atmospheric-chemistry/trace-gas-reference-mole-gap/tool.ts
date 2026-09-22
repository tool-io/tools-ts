import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleMoles: number;
  readonly dryAirMoles: number;
  readonly suppliedReferenceFraction: number;
};
export type Output = {
  readonly moleFraction: number;
  readonly referenceEquivalentMoles: number;
  readonly moleGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleMoles: { type: "number", minimum: 0 },
    dryAirMoles: { type: "number", exclusiveMinimum: 0 },
    suppliedReferenceFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["sampleMoles", "dryAirMoles", "suppliedReferenceFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    moleFraction: { type: "number" },
    referenceEquivalentMoles: { type: "number" },
    moleGap: { type: "number" },
  },
  required: ["moleFraction", "referenceEquivalentMoles", "moleGap"],
} as const;
/** Calculate trace gas reference mole gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleMoles, dryAirMoles, suppliedReferenceFraction } = request;
  const compute = (): Output => {
    H.domain(sampleMoles >= 0 && sampleMoles <= dryAirMoles);
    H.positive(dryAirMoles);
    H.probability(suppliedReferenceFraction);
    return {
      moleFraction: sampleMoles / dryAirMoles,
      referenceEquivalentMoles: dryAirMoles * suppliedReferenceFraction,
      moleGap: sampleMoles - dryAirMoles * suppliedReferenceFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleMoles: 2, dryAirMoles: 100, suppliedReferenceFraction: 0.01 },
  output: { moleFraction: 0.02, referenceEquivalentMoles: 1, moleGap: 1 },
} satisfies ToolExample<Input, Output>;
export const traceGasReferenceMoleGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-chemistry/trace-gas-reference-mole-gap",
    title: "Trace Gas Reference Mole Gap Tool",
    description:
      "Calculate trace gas reference mole gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleMoles: { type: "number", minimum: 0 },
        dryAirMoles: { type: "number", exclusiveMinimum: 0 },
        suppliedReferenceFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["sampleMoles", "dryAirMoles", "suppliedReferenceFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        moleFraction: { type: "number" },
        referenceEquivalentMoles: { type: "number" },
        moleGap: { type: "number" },
      },
      required: ["moleFraction", "referenceEquivalentMoles", "moleGap"],
    },
    ports: {
      inputs: [
        {
          id: "sampleMoles",
          label: "Sample Moles",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dryAirMoles",
          label: "Dry Air Moles",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReferenceFraction",
          label: "Supplied Reference Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "moleFraction",
          label: "Mole Fraction",
          valueType: { type: "number" },
        },
        {
          id: "referenceEquivalentMoles",
          label: "Reference Equivalent Moles",
          valueType: { type: "number" },
        },
        { id: "moleGap", label: "Mole Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = traceGasReferenceMoleGapTool.execute;
export default traceGasReferenceMoleGapTool;
