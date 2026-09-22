import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalLigand: number;
  readonly freeLigand: number;
  readonly totalSites: number;
  readonly occupancy: number;
};
export type Output = {
  readonly boundLigand: number;
  readonly accountedLigand: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalLigand: { type: "number", minimum: 0 },
    freeLigand: { type: "number", minimum: 0 },
    totalSites: { type: "number", minimum: 0 },
    occupancy: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["totalLigand", "freeLigand", "totalSites", "occupancy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    boundLigand: { type: "number" },
    accountedLigand: { type: "number" },
    residual: { type: "number" },
  },
  required: ["boundLigand", "accountedLigand", "residual"],
} as const;
/** Calculate ligand depletion mass balance residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalLigand, freeLigand, totalSites, occupancy } = request;
  const compute = (): Output => {
    H.domain(totalLigand >= 0 && freeLigand >= 0 && totalSites >= 0);
    H.probability(occupancy);
    return {
      boundLigand: totalSites * occupancy,
      accountedLigand: freeLigand + totalSites * occupancy,
      residual: totalLigand - freeLigand - totalSites * occupancy,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalLigand: 10, freeLigand: 4, totalSites: 8, occupancy: 0.75 },
  output: { boundLigand: 6, accountedLigand: 10, residual: 0 },
} satisfies ToolExample<Input, Output>;
export const ligandDepletionMassBalanceResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biochemistry/ligand-depletion-mass-balance-residual",
    title: "Ligand Depletion Mass Balance Residual Tool",
    description:
      "Calculate ligand depletion mass balance residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalLigand: { type: "number", minimum: 0 },
        freeLigand: { type: "number", minimum: 0 },
        totalSites: { type: "number", minimum: 0 },
        occupancy: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["totalLigand", "freeLigand", "totalSites", "occupancy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        boundLigand: { type: "number" },
        accountedLigand: { type: "number" },
        residual: { type: "number" },
      },
      required: ["boundLigand", "accountedLigand", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "totalLigand",
          label: "Total Ligand",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "freeLigand",
          label: "Free Ligand",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalSites",
          label: "Total Sites",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "occupancy",
          label: "Occupancy",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "boundLigand",
          label: "Bound Ligand",
          valueType: { type: "number" },
        },
        {
          id: "accountedLigand",
          label: "Accounted Ligand",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = ligandDepletionMassBalanceResidualTool.execute;
export default ligandDepletionMassBalanceResidualTool;
