import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bottomPressurePascals: number;
  readonly topPressurePascals: number;
  readonly suppliedGravity: number;
  readonly waterMassFraction: number;
};
export type Output = { readonly dryMassKilogramsPerSquareMeter: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bottomPressurePascals: { type: "number" },
    topPressurePascals: { type: "number", minimum: 0 },
    suppliedGravity: { type: "number", exclusiveMinimum: 0 },
    waterMassFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "bottomPressurePascals",
    "topPressurePascals",
    "suppliedGravity",
    "waterMassFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dryMassKilogramsPerSquareMeter: { type: "number" } },
  required: ["dryMassKilogramsPerSquareMeter"],
} as const;
/** Apply hydrostatic pressure-thickness mass per area and an explicit layer-average water mass fraction to obtain dry-air mass. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    bottomPressurePascals,
    topPressurePascals,
    suppliedGravity,
    waterMassFraction,
  } = request;
  const compute = (): Output => {
    H.domain(
      bottomPressurePascals >= topPressurePascals && topPressurePascals >= 0,
      "bottomPressurePascals",
    );
    (H.domain(
      Number.isFinite(suppliedGravity) && suppliedGravity > 0,
      "suppliedGravity",
    ),
      suppliedGravity);
    (H.domain(
      waterMassFraction >= 0 && waterMassFraction <= 1,
      "waterMassFraction",
    ),
      waterMassFraction);
    return {
      dryMassKilogramsPerSquareMeter:
        ((bottomPressurePascals - topPressurePascals) / suppliedGravity) *
        (1 - waterMassFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    bottomPressurePascals: 100000,
    topPressurePascals: 90000,
    suppliedGravity: 10,
    waterMassFraction: 0.01,
  },
  output: { dryMassKilogramsPerSquareMeter: 990 },
} satisfies ToolExample<Input, Output>;
export const atmosphericColumnLayerDryMassTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "atmospheric-science",
        "atmospheric science",
        "earth and environmental sciences",
      ],
      keywords: ["atmospheric science", "earth and environmental sciences"],
    },
    id: "atmospheric-science/atmospheric-column-layer-dry-mass",
    title: "Atmospheric Column Layer Dry Mass",
    description:
      "Apply hydrostatic pressure-thickness mass per area and an explicit layer-average water mass fraction to obtain dry-air mass.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bottomPressurePascals: { type: "number" },
        topPressurePascals: { type: "number", minimum: 0 },
        suppliedGravity: { type: "number", exclusiveMinimum: 0 },
        waterMassFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "bottomPressurePascals",
        "topPressurePascals",
        "suppliedGravity",
        "waterMassFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { dryMassKilogramsPerSquareMeter: { type: "number" } },
      required: ["dryMassKilogramsPerSquareMeter"],
    },
    ports: {
      inputs: [
        {
          id: "bottomPressurePascals",
          label: "Bottom Pressure Pascals",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "topPressurePascals",
          label: "Top Pressure Pascals",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedGravity",
          label: "Supplied Gravity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterMassFraction",
          label: "Water Mass Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "dryMassKilogramsPerSquareMeter",
          label: "Dry Mass Kilograms Per Square Meter",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = atmosphericColumnLayerDryMassTool.execute;
export default atmosphericColumnLayerDryMassTool;
