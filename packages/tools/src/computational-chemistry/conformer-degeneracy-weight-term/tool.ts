import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly relativeEnergy: number;
  readonly thermalEnergy: number;
  readonly degeneracy: number;
};
export type Output = { readonly logWeight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativeEnergy: { type: "number" },
    thermalEnergy: { type: "number", exclusiveMinimum: 0 },
    degeneracy: { type: "integer", minimum: 1 },
  },
  required: ["relativeEnergy", "thermalEnergy", "degeneracy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { logWeight: { type: "number" } },
  required: ["logWeight"],
} as const;
/** Return a log Boltzmann weight from compatible supplied energy units and positive degeneracy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { relativeEnergy, thermalEnergy, degeneracy } = request;
  const compute = (): Output => {
    H.positive(thermalEnergy);
    H.integer(degeneracy, 1);
    return { logWeight: Math.log(degeneracy) - relativeEnergy / thermalEnergy };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { relativeEnergy: 0, thermalEnergy: 2, degeneracy: 2 },
  output: { logWeight: 0.6931471805599453 },
} satisfies ToolExample<Input, Output>;
export const conformerDegeneracyWeightTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-chemistry/conformer-degeneracy-weight-term",
    title: "Conformer Degeneracy Weight Term Tool",
    description:
      "Return a log Boltzmann weight from compatible supplied energy units and positive degeneracy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relativeEnergy: { type: "number" },
        thermalEnergy: { type: "number", exclusiveMinimum: 0 },
        degeneracy: { type: "integer", minimum: 1 },
      },
      required: ["relativeEnergy", "thermalEnergy", "degeneracy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { logWeight: { type: "number" } },
      required: ["logWeight"],
    },
    ports: {
      inputs: [
        {
          id: "relativeEnergy",
          label: "Relative Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "thermalEnergy",
          label: "Thermal Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "degeneracy",
          label: "Degeneracy",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "logWeight", label: "Log Weight", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = conformerDegeneracyWeightTermTool.execute;
export default conformerDegeneracyWeightTermTool;
