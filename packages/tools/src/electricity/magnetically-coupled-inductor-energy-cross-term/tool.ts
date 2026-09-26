import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mutual: number;
  readonly firstCurrent: number;
  readonly secondCurrent: number;
  readonly aiding: boolean;
};
export type Output = { readonly energyTerm: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mutual: { type: "number", minimum: 0 },
    firstCurrent: { type: "number" },
    secondCurrent: { type: "number" },
    aiding: { type: "boolean" },
  },
  required: ["mutual", "firstCurrent", "secondCurrent", "aiding"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { energyTerm: { type: "number" } },
  required: ["energyTerm"],
} as const;
/** Return only the signed mutual M*i1*i2 contribution to ideal coupled-inductor stored energy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mutual, firstCurrent, secondCurrent, aiding } = request;
  const compute = (): Output => {
    H.domain(mutual >= 0);
    return {
      energyTerm: (aiding ? 1 : -1) * mutual * firstCurrent * secondCurrent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mutual: 0.2, firstCurrent: 2, secondCurrent: 3, aiding: true },
  output: { energyTerm: 1.2000000000000002 },
} satisfies ToolExample<Input, Output>;
export const magneticallyCoupledInductorEnergyCrossTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electricity/magnetically-coupled-inductor-energy-cross-term",
      title: "Magnetically Coupled Inductor Energy Cross Term Tool",
      description:
        "Return only the signed mutual M*i1*i2 contribution to ideal coupled-inductor stored energy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mutual: { type: "number", minimum: 0 },
          firstCurrent: { type: "number" },
          secondCurrent: { type: "number" },
          aiding: { type: "boolean" },
        },
        required: ["mutual", "firstCurrent", "secondCurrent", "aiding"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { energyTerm: { type: "number" } },
        required: ["energyTerm"],
      },
      ports: {
        inputs: [
          {
            id: "mutual",
            label: "Mutual",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstCurrent",
            label: "First Current",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondCurrent",
            label: "Second Current",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "aiding",
            label: "Aiding",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "energyTerm",
            label: "Energy Term",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = magneticallyCoupledInductorEnergyCrossTermTool.execute;
export default magneticallyCoupledInductorEnergyCrossTermTool;
