import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ligand: number;
  readonly halfSaturation: number;
  readonly hillCoefficient: number;
};
export type Output = {
  readonly logOdds: number;
  readonly occupancy: number;
  readonly logLigandSlope: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ligand: { type: "number", exclusiveMinimum: 0 },
    halfSaturation: { type: "number", exclusiveMinimum: 0 },
    hillCoefficient: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["ligand", "halfSaturation", "hillCoefficient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logOdds: { type: "number" },
    occupancy: { type: "number" },
    logLigandSlope: { type: "number" },
  },
  required: ["logOdds", "occupancy", "logLigandSlope"],
} as const;
/** Calculate hill occupancy logit slope term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ligand, halfSaturation, hillCoefficient } = request;
  const compute = (): Output => {
    H.positive(ligand);
    H.positive(halfSaturation);
    H.positive(hillCoefficient);
    return {
      logOdds: hillCoefficient * Math.log(ligand / halfSaturation),
      occupancy: 1 / (1 + (halfSaturation / ligand) ** hillCoefficient),
      logLigandSlope: hillCoefficient,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ligand: 2, halfSaturation: 2, hillCoefficient: 3 },
  output: { logOdds: 0, occupancy: 0.5, logLigandSlope: 3 },
} satisfies ToolExample<Input, Output>;
export const hillOccupancyLogitSlopeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biochemistry/hill-occupancy-logit-slope-term",
    title: "Hill Occupancy Logit Slope Term Tool",
    description:
      "Calculate hill occupancy logit slope term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ligand: { type: "number", exclusiveMinimum: 0 },
        halfSaturation: { type: "number", exclusiveMinimum: 0 },
        hillCoefficient: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["ligand", "halfSaturation", "hillCoefficient"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        logOdds: { type: "number" },
        occupancy: { type: "number" },
        logLigandSlope: { type: "number" },
      },
      required: ["logOdds", "occupancy", "logLigandSlope"],
    },
    ports: {
      inputs: [
        {
          id: "ligand",
          label: "Ligand",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "halfSaturation",
          label: "Half Saturation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hillCoefficient",
          label: "Hill Coefficient",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "logOdds", label: "Log Odds", valueType: { type: "number" } },
        { id: "occupancy", label: "Occupancy", valueType: { type: "number" } },
        {
          id: "logLigandSlope",
          label: "Log Ligand Slope",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hillOccupancyLogitSlopeTermTool.execute;
export default hillOccupancyLogitSlopeTermTool;
