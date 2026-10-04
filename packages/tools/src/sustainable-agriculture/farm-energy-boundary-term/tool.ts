import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly energy: readonly number[];
  readonly included: readonly boolean[];
  readonly signs: readonly number[];
};
export type Output = { readonly netEnergy: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    energy: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    included: { type: "array", maxItems: 256, items: { type: "boolean" } },
    signs: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["energy", "included", "signs"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netEnergy: { type: "number" } },
  required: ["netEnergy"],
} as const;
/** Sum supplied energy ledger terms under explicit boundaries and signed flow conventions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { energy, included, signs } = request;
  const compute = (): Output => {
    H.sameLength(energy, included);
    H.sameLength(energy, signs);
    H.domain(
      energy.every((x) => x >= 0) && signs.every((x) => x === 1 || x === -1),
    );
    return {
      netEnergy: energy.reduce(
        (s, x, i) => s + (included[i] ? x * signs[i] : 0),
        0,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    energy: [10, 4, 2],
    included: [true, true, false],
    signs: [1, -1, 1],
  },
  output: { netEnergy: 6 },
} satisfies ToolExample<Input, Output>;
export const farmEnergyBoundaryTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sustainable-agriculture/farm-energy-boundary-term",
    title: "Farm Energy Boundary Term Tool",
    description:
      "Sum supplied energy ledger terms under explicit boundaries and signed flow conventions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        energy: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        included: { type: "array", maxItems: 256, items: { type: "boolean" } },
        signs: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["energy", "included", "signs"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { netEnergy: { type: "number" } },
      required: ["netEnergy"],
    },
    ports: {
      inputs: [
        {
          id: "energy",
          label: "Energy",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "included",
          label: "Included",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "signs",
          label: "Signs",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        { id: "netEnergy", label: "Net Energy", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmEnergyBoundaryTermTool.execute;
export default farmEnergyBoundaryTermTool;
