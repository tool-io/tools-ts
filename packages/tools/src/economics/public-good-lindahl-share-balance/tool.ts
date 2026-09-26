import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly marginalBenefits: readonly number[];
  readonly marginalCost: number;
};
export type Output = {
  readonly sumBenefits: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    marginalBenefits: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    marginalCost: { type: "number", minimum: 0 },
  },
  required: ["marginalBenefits", "marginalCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sumBenefits: { type: "number" }, residual: { type: "number" } },
  required: ["sumBenefits", "residual"],
} as const;
/** Calculate public good lindahl share balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { marginalBenefits, marginalCost } = request;
  const compute = (): Output => {
    H.domain(marginalBenefits.every((x) => x >= 0) && marginalCost >= 0);
    return {
      sumBenefits: marginalBenefits.reduce((a, b) => a + b, 0),
      residual: marginalBenefits.reduce((a, b) => a + b, 0) - marginalCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { marginalBenefits: [3, 5, 4], marginalCost: 10 },
  output: { sumBenefits: 12, residual: 2 },
} satisfies ToolExample<Input, Output>;
export const publicGoodLindahlShareBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/public-good-lindahl-share-balance",
    title: "Public Good Lindahl Share Balance Tool",
    description:
      "Calculate public good lindahl share balance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        marginalBenefits: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        marginalCost: { type: "number", minimum: 0 },
      },
      required: ["marginalBenefits", "marginalCost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sumBenefits: { type: "number" },
        residual: { type: "number" },
      },
      required: ["sumBenefits", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "marginalBenefits",
          label: "Marginal Benefits",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "marginalCost",
          label: "Marginal Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sumBenefits",
          label: "Sum Benefits",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = publicGoodLindahlShareBalanceTool.execute;
export default publicGoodLindahlShareBalanceTool;
