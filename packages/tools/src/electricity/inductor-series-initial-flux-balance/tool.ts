import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inductances: readonly number[];
  readonly currents: readonly number[];
};
export type Output = {
  readonly commonCurrent: number;
  readonly totalFluxLinkage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inductances: { type: "array", maxItems: 256, items: { type: "number" } },
    currents: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["inductances", "currents"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    commonCurrent: { type: "number" },
    totalFluxLinkage: { type: "number" },
  },
  required: ["commonCurrent", "totalFluxLinkage"],
} as const;
/** Resolve an ideal constrained common current by conserved total flux linkage for uncoupled inductors. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inductances, currents } = request;
  const compute = (): Output => {
    H.sameLength(inductances, currents);
    H.domain(inductances.length > 0 && inductances.every((x) => x > 0));
    const totalFluxLinkage = H.dot(inductances, currents);
    return {
      commonCurrent: totalFluxLinkage / inductances.reduce((a, b) => a + b, 0),
      totalFluxLinkage,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inductances: [2, 3], currents: [4, 1] },
  output: { commonCurrent: 2.2, totalFluxLinkage: 11 },
} satisfies ToolExample<Input, Output>;
export const inductorSeriesInitialFluxBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electricity/inductor-series-initial-flux-balance",
    title: "Inductor Series Initial Flux Balance Tool",
    description:
      "Resolve an ideal constrained common current by conserved total flux linkage for uncoupled inductors.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inductances: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        currents: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["inductances", "currents"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        commonCurrent: { type: "number" },
        totalFluxLinkage: { type: "number" },
      },
      required: ["commonCurrent", "totalFluxLinkage"],
    },
    ports: {
      inputs: [
        {
          id: "inductances",
          label: "Inductances",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "currents",
          label: "Currents",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "commonCurrent",
          label: "Common Current",
          valueType: { type: "number" },
        },
        {
          id: "totalFluxLinkage",
          label: "Total Flux Linkage",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = inductorSeriesInitialFluxBalanceTool.execute;
export default inductorSeriesInitialFluxBalanceTool;
