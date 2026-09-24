import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stoichiometry: readonly number[];
  readonly fluxes: readonly number[];
  readonly accumulation: number;
};
export type Output = {
  readonly netProduction: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stoichiometry: { type: "array", maxItems: 256, items: { type: "number" } },
    fluxes: { type: "array", maxItems: 256, items: { type: "number" } },
    accumulation: { type: "number" },
  },
  required: ["stoichiometry", "fluxes", "accumulation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netProduction: { type: "number" },
    residual: { type: "number" },
  },
  required: ["netProduction", "residual"],
} as const;
/** One stoichiometric row constraint S*v=accumulation; signed reaction fluxes are permitted. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stoichiometry, fluxes, accumulation } = request;
  const compute = (): Output => {
    H.sameLength(stoichiometry, fluxes);
    return {
      netProduction: H.dot(stoichiometry, fluxes),
      residual: H.dot(stoichiometry, fluxes) - accumulation,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stoichiometry: [-1, 2], fluxes: [4, 3], accumulation: 1 },
  output: { netProduction: 2, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const metabolicFluxOneConstraintResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-biology/metabolic-flux-one-constraint-residual",
    title: "Metabolic Flux One Constraint Residual Tool",
    description:
      "One stoichiometric row constraint S*v=accumulation; signed reaction fluxes are permitted.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stoichiometry: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        fluxes: { type: "array", maxItems: 256, items: { type: "number" } },
        accumulation: { type: "number" },
      },
      required: ["stoichiometry", "fluxes", "accumulation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netProduction: { type: "number" },
        residual: { type: "number" },
      },
      required: ["netProduction", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "stoichiometry",
          label: "Stoichiometry",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "fluxes",
          label: "Fluxes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "accumulation",
          label: "Accumulation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netProduction",
          label: "Net Production",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = metabolicFluxOneConstraintResidualTool.execute;
export default metabolicFluxOneConstraintResidualTool;
