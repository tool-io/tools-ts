import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contaminantMass: number;
  readonly grossMass: number;
  readonly tareMass: number;
};
export type Output = {
  readonly netMass: number;
  readonly contaminationFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contaminantMass: { type: "number", minimum: 0 },
    grossMass: { type: "number" },
    tareMass: { type: "number", minimum: 0 },
  },
  required: ["contaminantMass", "grossMass", "tareMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netMass: { type: "number" },
    contaminationFraction: { type: "number" },
  },
  required: ["netMass", "contaminationFraction"],
} as const;
/** Calculate waste sort contamination mass share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contaminantMass, grossMass, tareMass } = request;
  const compute = (): Output => {
    H.domain(
      tareMass >= 0 &&
        grossMass > tareMass &&
        contaminantMass >= 0 &&
        contaminantMass <= grossMass - tareMass,
    );
    return {
      netMass: grossMass - tareMass,
      contaminationFraction: contaminantMass / (grossMass - tareMass),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { contaminantMass: 5, grossMass: 60, tareMass: 10 },
  output: { netMass: 50, contaminationFraction: 0.1 },
} satisfies ToolExample<Input, Output>;
export const wasteSortContaminationMassShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/waste-sort-contamination-mass-share",
    title: "Waste Sort Contamination Mass Share Tool",
    description:
      "Calculate waste sort contamination mass share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contaminantMass: { type: "number", minimum: 0 },
        grossMass: { type: "number" },
        tareMass: { type: "number", minimum: 0 },
      },
      required: ["contaminantMass", "grossMass", "tareMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netMass: { type: "number" },
        contaminationFraction: { type: "number" },
      },
      required: ["netMass", "contaminationFraction"],
    },
    ports: {
      inputs: [
        {
          id: "contaminantMass",
          label: "Contaminant Mass",
          required: true,
          valueType: { type: "number" },
        },
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
        {
          id: "contaminationFraction",
          label: "Contamination Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = wasteSortContaminationMassShareTool.execute;
export default wasteSortContaminationMassShareTool;
