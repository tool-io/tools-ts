import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reading: number;
  readonly suppliedMassUnitFactor: number;
  readonly extractVolume: number;
  readonly sampleMass: number;
};
export type Output = { readonly coherentMassPerMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reading: { type: "number" },
    suppliedMassUnitFactor: { type: "number", exclusiveMinimum: 0 },
    extractVolume: { type: "number", minimum: 0 },
    sampleMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "reading",
    "suppliedMassUnitFactor",
    "extractVolume",
    "sampleMass",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { coherentMassPerMass: { type: "number" } },
  required: ["coherentMassPerMass"],
} as const;
/** Calculate soil phosphorus extract unit crosswalk from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reading, suppliedMassUnitFactor, extractVolume, sampleMass } =
    request;
  const compute = (): Output => {
    H.positive(suppliedMassUnitFactor);
    H.domain(extractVolume >= 0);
    H.positive(sampleMass);
    return {
      coherentMassPerMass:
        (reading * suppliedMassUnitFactor * extractVolume) / sampleMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reading: 4,
    suppliedMassUnitFactor: 0.001,
    extractVolume: 50,
    sampleMass: 10,
  },
  output: { coherentMassPerMass: 0.02 },
} satisfies ToolExample<Input, Output>;
export const soilPhosphorusExtractUnitCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrochemistry/soil-phosphorus-extract-unit-crosswalk",
    title: "Soil Phosphorus Extract Unit Crosswalk Tool",
    description:
      "Calculate soil phosphorus extract unit crosswalk from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reading: { type: "number" },
        suppliedMassUnitFactor: { type: "number", exclusiveMinimum: 0 },
        extractVolume: { type: "number", minimum: 0 },
        sampleMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "reading",
        "suppliedMassUnitFactor",
        "extractVolume",
        "sampleMass",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { coherentMassPerMass: { type: "number" } },
      required: ["coherentMassPerMass"],
    },
    ports: {
      inputs: [
        {
          id: "reading",
          label: "Reading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedMassUnitFactor",
          label: "Supplied Mass Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "extractVolume",
          label: "Extract Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleMass",
          label: "Sample Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "coherentMassPerMass",
          label: "Coherent Mass Per Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = soilPhosphorusExtractUnitCrosswalkTool.execute;
export default soilPhosphorusExtractUnitCrosswalkTool;
