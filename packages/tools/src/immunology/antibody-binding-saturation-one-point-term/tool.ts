import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly freeLigand: number;
  readonly dissociationConstant: number;
  readonly bindingCapacity: number;
  readonly nonspecificSlope: number;
};
export type Output = {
  readonly occupancy: number;
  readonly specificBound: number;
  readonly totalSignal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    freeLigand: { type: "number", minimum: 0 },
    dissociationConstant: { type: "number", exclusiveMinimum: 0 },
    bindingCapacity: { type: "number", minimum: 0 },
    nonspecificSlope: { type: "number", minimum: 0 },
  },
  required: [
    "freeLigand",
    "dissociationConstant",
    "bindingCapacity",
    "nonspecificSlope",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occupancy: { type: "number" },
    specificBound: { type: "number" },
    totalSignal: { type: "number" },
  },
  required: ["occupancy", "specificBound", "totalSignal"],
} as const;
/** One-site equilibrium occupancy using free ligand and supplied Kd, plus an explicit linear nonspecific signal term; no parameters are fitted. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    freeLigand,
    dissociationConstant,
    bindingCapacity,
    nonspecificSlope,
  } = request;
  const compute = (): Output => {
    H.domain(freeLigand >= 0 && bindingCapacity >= 0 && nonspecificSlope >= 0);
    H.positive(dissociationConstant);
    return {
      occupancy: freeLigand / (dissociationConstant + freeLigand),
      specificBound:
        (bindingCapacity * freeLigand) / (dissociationConstant + freeLigand),
      totalSignal:
        (bindingCapacity * freeLigand) / (dissociationConstant + freeLigand) +
        nonspecificSlope * freeLigand,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    freeLigand: 10,
    dissociationConstant: 10,
    bindingCapacity: 100,
    nonspecificSlope: 0.5,
  },
  output: { occupancy: 0.5, specificBound: 50, totalSignal: 55 },
} satisfies ToolExample<Input, Output>;
export const antibodyBindingSaturationOnePointTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "immunology/antibody-binding-saturation-one-point-term",
      title: "Antibody Binding Saturation One Point Term Tool",
      description:
        "One-site equilibrium occupancy using free ligand and supplied Kd, plus an explicit linear nonspecific signal term; no parameters are fitted.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          freeLigand: { type: "number", minimum: 0 },
          dissociationConstant: { type: "number", exclusiveMinimum: 0 },
          bindingCapacity: { type: "number", minimum: 0 },
          nonspecificSlope: { type: "number", minimum: 0 },
        },
        required: [
          "freeLigand",
          "dissociationConstant",
          "bindingCapacity",
          "nonspecificSlope",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          occupancy: { type: "number" },
          specificBound: { type: "number" },
          totalSignal: { type: "number" },
        },
        required: ["occupancy", "specificBound", "totalSignal"],
      },
      ports: {
        inputs: [
          {
            id: "freeLigand",
            label: "Free Ligand",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "dissociationConstant",
            label: "Dissociation Constant",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "bindingCapacity",
            label: "Binding Capacity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "nonspecificSlope",
            label: "Nonspecific Slope",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "occupancy",
            label: "Occupancy",
            valueType: { type: "number" },
          },
          {
            id: "specificBound",
            label: "Specific Bound",
            valueType: { type: "number" },
          },
          {
            id: "totalSignal",
            label: "Total Signal",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = antibodyBindingSaturationOnePointTermTool.execute;
export default antibodyBindingSaturationOnePointTermTool;
