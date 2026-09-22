import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentration: number;
  readonly volume: number;
  readonly equivalentPerConcentrationVolume: number;
};
export type Output = { readonly equivalentInventory: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentration: { type: "number", minimum: 0 },
    volume: { type: "number", minimum: 0 },
    equivalentPerConcentrationVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["concentration", "volume", "equivalentPerConcentrationVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { equivalentInventory: { type: "number" } },
  required: ["equivalentInventory"],
} as const;
/** Convert a supplied alkalinity inventory with an explicit equivalent-unit factor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentration, volume, equivalentPerConcentrationVolume } = request;
  const compute = (): Output => {
    H.domain(concentration >= 0 && volume >= 0);
    H.positive(equivalentPerConcentrationVolume);
    return {
      equivalentInventory:
        concentration * volume * equivalentPerConcentrationVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    concentration: 100,
    volume: 50,
    equivalentPerConcentrationVolume: 0.001,
  },
  output: { equivalentInventory: 5 },
} satisfies ToolExample<Input, Output>;
export const aquaponicAlkalinitySuppliedEquivalentTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "aquaponics/aquaponic-alkalinity-supplied-equivalent-term",
      title: "Aquaponic Alkalinity Supplied Equivalent Term Tool",
      description:
        "Convert a supplied alkalinity inventory with an explicit equivalent-unit factor.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          concentration: { type: "number", minimum: 0 },
          volume: { type: "number", minimum: 0 },
          equivalentPerConcentrationVolume: {
            type: "number",
            exclusiveMinimum: 0,
          },
        },
        required: [
          "concentration",
          "volume",
          "equivalentPerConcentrationVolume",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { equivalentInventory: { type: "number" } },
        required: ["equivalentInventory"],
      },
      ports: {
        inputs: [
          {
            id: "concentration",
            label: "Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "volume",
            label: "Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "equivalentPerConcentrationVolume",
            label: "Equivalent Per Concentration Volume",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "equivalentInventory",
            label: "Equivalent Inventory",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = aquaponicAlkalinitySuppliedEquivalentTermTool.execute;
export default aquaponicAlkalinitySuppliedEquivalentTermTool;
