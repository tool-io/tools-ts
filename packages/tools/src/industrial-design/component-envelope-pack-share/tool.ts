import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly componentVolumes: readonly number[];
  readonly envelopeVolume: number;
  readonly suppliedPackingFraction: number;
};
export type Output = {
  readonly componentVolume: number;
  readonly occupiedShare: number;
  readonly budgetGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    componentVolumes: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    envelopeVolume: { type: "number", exclusiveMinimum: 0 },
    suppliedPackingFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["componentVolumes", "envelopeVolume", "suppliedPackingFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    componentVolume: { type: "number" },
    occupiedShare: { type: "number" },
    budgetGap: { type: "number" },
  },
  required: ["componentVolume", "occupiedShare", "budgetGap"],
} as const;
/** Compare supplied component volumes with an explicit packing budget; no geometric fit is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { componentVolumes, envelopeVolume, suppliedPackingFraction } = request;
  const compute = (): Output => {
    H.domain(componentVolumes.every((x) => x >= 0));
    H.positive(envelopeVolume);
    H.probability(suppliedPackingFraction);
    return (() => {
      const componentVolume = componentVolumes.reduce((a, b) => a + b, 0);
      return {
        componentVolume,
        occupiedShare: componentVolume / envelopeVolume,
        budgetGap: envelopeVolume * suppliedPackingFraction - componentVolume,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    componentVolumes: [2, 3],
    envelopeVolume: 10,
    suppliedPackingFraction: 0.6,
  },
  output: { componentVolume: 5, occupiedShare: 0.5, budgetGap: 1 },
} satisfies ToolExample<Input, Output>;
export const componentEnvelopePackShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/component-envelope-pack-share",
    title: "Component Envelope Pack Share Tool",
    description:
      "Compare supplied component volumes with an explicit packing budget; no geometric fit is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        componentVolumes: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        envelopeVolume: { type: "number", exclusiveMinimum: 0 },
        suppliedPackingFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "componentVolumes",
        "envelopeVolume",
        "suppliedPackingFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        componentVolume: { type: "number" },
        occupiedShare: { type: "number" },
        budgetGap: { type: "number" },
      },
      required: ["componentVolume", "occupiedShare", "budgetGap"],
    },
    ports: {
      inputs: [
        {
          id: "componentVolumes",
          label: "Component Volumes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "envelopeVolume",
          label: "Envelope Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedPackingFraction",
          label: "Supplied Packing Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "componentVolume",
          label: "Component Volume",
          valueType: { type: "number" },
        },
        {
          id: "occupiedShare",
          label: "Occupied Share",
          valueType: { type: "number" },
        },
        { id: "budgetGap", label: "Budget Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = componentEnvelopePackShareTool.execute;
export default componentEnvelopePackShareTool;
