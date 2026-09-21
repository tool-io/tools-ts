import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredMass: number;
  readonly dilution: number;
  readonly sampledDryMass: number;
  readonly referenceDryMass: number;
};
export type Output = {
  readonly massPerDryMass: number;
  readonly referenceMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredMass: { type: "number", minimum: 0 },
    dilution: { type: "number", exclusiveMinimum: 0 },
    sampledDryMass: { type: "number", exclusiveMinimum: 0 },
    referenceDryMass: { type: "number", minimum: 0 },
  },
  required: ["measuredMass", "dilution", "sampledDryMass", "referenceDryMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    massPerDryMass: { type: "number" },
    referenceMass: { type: "number" },
  },
  required: ["massPerDryMass", "referenceMass"],
} as const;
/** Calculate foliar assay reference leaf dry basis from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredMass, dilution, sampledDryMass, referenceDryMass } = request;
  const compute = (): Output => {
    H.domain(measuredMass >= 0 && referenceDryMass >= 0);
    H.positive(dilution);
    H.positive(sampledDryMass);
    return {
      massPerDryMass: (measuredMass * dilution) / sampledDryMass,
      referenceMass:
        (measuredMass * dilution * referenceDryMass) / sampledDryMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredMass: 2,
    dilution: 5,
    sampledDryMass: 10,
    referenceDryMass: 100,
  },
  output: { massPerDryMass: 1, referenceMass: 100 },
} satisfies ToolExample<Input, Output>;
export const foliarAssayReferenceLeafDryBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrochemistry/foliar-assay-reference-leaf-dry-basis",
    title: "Foliar Assay Reference Leaf Dry Basis Tool",
    description:
      "Calculate foliar assay reference leaf dry basis from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredMass: { type: "number", minimum: 0 },
        dilution: { type: "number", exclusiveMinimum: 0 },
        sampledDryMass: { type: "number", exclusiveMinimum: 0 },
        referenceDryMass: { type: "number", minimum: 0 },
      },
      required: [
        "measuredMass",
        "dilution",
        "sampledDryMass",
        "referenceDryMass",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        massPerDryMass: { type: "number" },
        referenceMass: { type: "number" },
      },
      required: ["massPerDryMass", "referenceMass"],
    },
    ports: {
      inputs: [
        {
          id: "measuredMass",
          label: "Measured Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dilution",
          label: "Dilution",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampledDryMass",
          label: "Sampled Dry Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceDryMass",
          label: "Reference Dry Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "massPerDryMass",
          label: "Mass Per Dry Mass",
          valueType: { type: "number" },
        },
        {
          id: "referenceMass",
          label: "Reference Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foliarAssayReferenceLeafDryBasisTool.execute;
export default foliarAssayReferenceLeafDryBasisTool;
