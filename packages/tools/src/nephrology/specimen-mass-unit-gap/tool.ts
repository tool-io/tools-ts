import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedMass: number;
  readonly unitFactor: number;
  readonly referenceMass: number;
};
export type Output = { readonly convertedMass: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedMass: { type: "number", minimum: 0 },
    unitFactor: { type: "number", exclusiveMinimum: 0 },
    referenceMass: { type: "number", minimum: 0 },
  },
  required: ["recordedMass", "unitFactor", "referenceMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { convertedMass: { type: "number" }, gap: { type: "number" } },
  required: ["convertedMass", "gap"],
} as const;
/** Calculate specimen mass unit gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedMass, unitFactor, referenceMass } = request;
  const compute = (): Output => {
    H.domain(recordedMass >= 0 && referenceMass >= 0);
    H.positive(unitFactor);
    return {
      convertedMass: recordedMass * unitFactor,
      gap: recordedMass * unitFactor - referenceMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedMass: 120, unitFactor: 0.001, referenceMass: 0.1 },
  output: { convertedMass: 0.12, gap: 0.01999999999999999 },
} satisfies ToolExample<Input, Output>;
export const specimenMassUnitGapTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "nephrology/specimen-mass-unit-gap",
      title: "Specimen Mass Unit Gap Tool",
      description:
        "Calculate specimen mass unit gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordedMass: { type: "number", minimum: 0 },
          unitFactor: { type: "number", exclusiveMinimum: 0 },
          referenceMass: { type: "number", minimum: 0 },
        },
        required: ["recordedMass", "unitFactor", "referenceMass"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          convertedMass: { type: "number" },
          gap: { type: "number" },
        },
        required: ["convertedMass", "gap"],
      },
      ports: {
        inputs: [
          {
            id: "recordedMass",
            label: "Recorded Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "unitFactor",
            label: "Unit Factor",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceMass",
            label: "Reference Mass",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "convertedMass",
            label: "Converted Mass",
            valueType: { type: "number" },
          },
          { id: "gap", label: "Gap", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  },
);
export const run = specimenMassUnitGapTool.execute;
export default specimenMassUnitGapTool;
