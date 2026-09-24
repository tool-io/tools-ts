import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly presentDensity: number;
  readonly redshift: number;
};
export type Output = {
  readonly densityFactor: number;
  readonly density: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    presentDensity: { type: "number", minimum: 0 },
    redshift: { type: "number", exclusiveMinimum: -1 },
  },
  required: ["presentDensity", "redshift"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    densityFactor: { type: "number" },
    density: { type: "number" },
  },
  required: ["densityFactor", "density"],
} as const;
/** Freely redshifting radiation density scales as (1+z)^4. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { presentDensity, redshift } = request;
  const compute = (): Output => {
    H.domain(presentDensity >= 0 && redshift > -1);
    return {
      densityFactor: (1 + redshift) ** 4,
      density: presentDensity * (1 + redshift) ** 4,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { presentDensity: 2, redshift: 1 },
  output: { densityFactor: 16, density: 32 },
} satisfies ToolExample<Input, Output>;
export const radiationDensityRedshiftQuarticTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "cosmology/radiation-density-redshift-quartic-term",
      title: "Radiation Density Redshift Quartic Term Tool",
      description: "Freely redshifting radiation density scales as (1+z)^4.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          presentDensity: { type: "number", minimum: 0 },
          redshift: { type: "number", exclusiveMinimum: -1 },
        },
        required: ["presentDensity", "redshift"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          densityFactor: { type: "number" },
          density: { type: "number" },
        },
        required: ["densityFactor", "density"],
      },
      ports: {
        inputs: [
          {
            id: "presentDensity",
            label: "Present Density",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "redshift",
            label: "Redshift",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "densityFactor",
            label: "Density Factor",
            valueType: { type: "number" },
          },
          { id: "density", label: "Density", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = radiationDensityRedshiftQuarticTermTool.execute;
export default radiationDensityRedshiftQuarticTermTool;
