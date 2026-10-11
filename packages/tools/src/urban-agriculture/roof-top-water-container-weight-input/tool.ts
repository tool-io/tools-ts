import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly waterVolumeLiters: number;
  readonly suppliedDensityKilogramsPerLiter: number;
  readonly emptyContainerMassKilograms: number;
};
export type Output = { readonly totalMassKilograms: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waterVolumeLiters: { type: "number", minimum: 0 },
    suppliedDensityKilogramsPerLiter: { type: "number", exclusiveMinimum: 0 },
    emptyContainerMassKilograms: { type: "number", minimum: 0 },
  },
  required: [
    "waterVolumeLiters",
    "suppliedDensityKilogramsPerLiter",
    "emptyContainerMassKilograms",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { totalMassKilograms: { type: "number" } },
  required: ["totalMassKilograms"],
} as const;
/** Add an explicit container tare to water mass from supplied volume and density without assessing structural roof capacity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    waterVolumeLiters,
    suppliedDensityKilogramsPerLiter,
    emptyContainerMassKilograms,
  } = request;
  const compute = (): Output => {
    H.domain(
      waterVolumeLiters >= 0 && emptyContainerMassKilograms >= 0,
      "waterVolumeLiters",
    );
    (H.domain(
      suppliedDensityKilogramsPerLiter > 0,
      "suppliedDensityKilogramsPerLiter",
    ),
      suppliedDensityKilogramsPerLiter);
    return {
      totalMassKilograms:
        waterVolumeLiters * suppliedDensityKilogramsPerLiter +
        emptyContainerMassKilograms,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    waterVolumeLiters: 100,
    suppliedDensityKilogramsPerLiter: 1,
    emptyContainerMassKilograms: 8,
  },
  output: { totalMassKilograms: 108 },
} satisfies ToolExample<Input, Output>;
export const roofTopWaterContainerWeightInputTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["urban-agriculture", "urban agriculture", "agriculture"],
      keywords: ["urban agriculture", "agriculture"],
    },
    id: "urban-agriculture/roof-top-water-container-weight-input",
    title: "Roof Top Water Container Weight Input",
    description:
      "Add an explicit container tare to water mass from supplied volume and density without assessing structural roof capacity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waterVolumeLiters: { type: "number", minimum: 0 },
        suppliedDensityKilogramsPerLiter: {
          type: "number",
          exclusiveMinimum: 0,
        },
        emptyContainerMassKilograms: { type: "number", minimum: 0 },
      },
      required: [
        "waterVolumeLiters",
        "suppliedDensityKilogramsPerLiter",
        "emptyContainerMassKilograms",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { totalMassKilograms: { type: "number" } },
      required: ["totalMassKilograms"],
    },
    ports: {
      inputs: [
        {
          id: "waterVolumeLiters",
          label: "Water Volume Liters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDensityKilogramsPerLiter",
          label: "Supplied Density Kilograms Per Liter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "emptyContainerMassKilograms",
          label: "Empty Container Mass Kilograms",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalMassKilograms",
          label: "Total Mass Kilograms",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = roofTopWaterContainerWeightInputTool.execute;
export default roofTopWaterContainerWeightInputTool;
