import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly treatedArea: number;
  readonly suppliedWaterPerArea: number;
};
export type Output = { readonly waterUse: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    treatedArea: { type: "number", minimum: 0 },
    suppliedWaterPerArea: { type: "number", minimum: 0 },
  },
  required: ["treatedArea", "suppliedWaterPerArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { waterUse: { type: "number" } },
  required: ["waterUse"],
} as const;
/** Multiply supplied treated area by explicit water-use intensity without prescribing dust-control application rates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { treatedArea, suppliedWaterPerArea } = request;
  const compute = (): Output => {
    H.domain(treatedArea >= 0, "treatedArea");
    H.domain(suppliedWaterPerArea >= 0, "suppliedWaterPerArea");
    return { waterUse: treatedArea * suppliedWaterPerArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { treatedArea: 200, suppliedWaterPerArea: 0.5 },
  output: { waterUse: 100 },
} satisfies ToolExample<Input, Output>;
export const dustControlWaterUseAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-engineering/dust-control-water-use-area-term",
    title: "Dust Control Water Use Area Term Tool",
    description:
      "Multiply supplied treated area by explicit water-use intensity without prescribing dust-control application rates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        treatedArea: { type: "number", minimum: 0 },
        suppliedWaterPerArea: { type: "number", minimum: 0 },
      },
      required: ["treatedArea", "suppliedWaterPerArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { waterUse: { type: "number" } },
      required: ["waterUse"],
    },
    ports: {
      inputs: [
        {
          id: "treatedArea",
          label: "Treated Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedWaterPerArea",
          label: "Supplied Water Per Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "waterUse", label: "Water Use", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = dustControlWaterUseAreaTermTool.execute;
export default dustControlWaterUseAreaTermTool;
