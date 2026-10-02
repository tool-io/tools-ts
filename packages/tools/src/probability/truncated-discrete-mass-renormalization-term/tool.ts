import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly mass: number; readonly retainedMass: number };
export type Output = { readonly conditionalMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mass: { type: "number", minimum: 0, maximum: 1 },
    retainedMass: {
      type: "number",
      exclusiveMinimum: 0,
      minimum: 0,
      maximum: 1,
    },
  },
  required: ["mass", "retainedMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { conditionalMass: { type: "number" } },
  required: ["conditionalMass"],
} as const;
/** Calculate truncated discrete mass renormalization term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mass, retainedMass } = request;
  const compute = (): Output => {
    H.probability(mass);
    H.probability(retainedMass);
    H.positive(retainedMass);
    H.domain(mass <= retainedMass);
    return { conditionalMass: mass / retainedMass };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mass: 0.2, retainedMass: 0.5 },
  output: { conditionalMass: 0.4 },
} satisfies ToolExample<Input, Output>;
export const truncatedDiscreteMassRenormalizationTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "probability/truncated-discrete-mass-renormalization-term",
      title: "Truncated Discrete Mass Renormalization Term Tool",
      description:
        "Calculate truncated discrete mass renormalization term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mass: { type: "number", minimum: 0, maximum: 1 },
          retainedMass: {
            type: "number",
            exclusiveMinimum: 0,
            minimum: 0,
            maximum: 1,
          },
        },
        required: ["mass", "retainedMass"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { conditionalMass: { type: "number" } },
        required: ["conditionalMass"],
      },
      ports: {
        inputs: [
          {
            id: "mass",
            label: "Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "retainedMass",
            label: "Retained Mass",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "conditionalMass",
            label: "Conditional Mass",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = truncatedDiscreteMassRenormalizationTermTool.execute;
export default truncatedDiscreteMassRenormalizationTermTool;
