import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalMass: number;
  readonly componentMasses: readonly number[];
};
export type Output = {
  readonly carrierMass: number;
  readonly carrierShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalMass: { type: "number", exclusiveMinimum: 0 },
    componentMasses: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["totalMass", "componentMasses"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    carrierMass: { type: "number" },
    carrierShare: { type: "number" },
  },
  required: ["carrierMass", "carrierShare"],
} as const;
/** Calculate fertilizer blend inert carrier share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalMass, componentMasses } = request;
  const compute = (): Output => {
    H.positive(totalMass);
    H.domain(
      componentMasses.every((x) => x >= 0) &&
        componentMasses.reduce((a, b) => a + b, 0) <= totalMass,
    );
    return {
      carrierMass: totalMass - componentMasses.reduce((a, b) => a + b, 0),
      carrierShare: 1 - componentMasses.reduce((a, b) => a + b, 0) / totalMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalMass: 100, componentMasses: [20, 30] },
  output: { carrierMass: 50, carrierShare: 0.5 },
} satisfies ToolExample<Input, Output>;
export const fertilizerBlendInertCarrierShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrochemistry/fertilizer-blend-inert-carrier-share",
    title: "Fertilizer Blend Inert Carrier Share Tool",
    description:
      "Calculate fertilizer blend inert carrier share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalMass: { type: "number", exclusiveMinimum: 0 },
        componentMasses: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["totalMass", "componentMasses"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        carrierMass: { type: "number" },
        carrierShare: { type: "number" },
      },
      required: ["carrierMass", "carrierShare"],
    },
    ports: {
      inputs: [
        {
          id: "totalMass",
          label: "Total Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "componentMasses",
          label: "Component Masses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "carrierMass",
          label: "Carrier Mass",
          valueType: { type: "number" },
        },
        {
          id: "carrierShare",
          label: "Carrier Share",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = fertilizerBlendInertCarrierShareTool.execute;
export default fertilizerBlendInertCarrierShareTool;
