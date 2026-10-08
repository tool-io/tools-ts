import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceUnit: string;
  readonly measurementUnit: string;
  readonly referenceDimension: string;
  readonly measurementDimension: string;
};
export type Output = {
  readonly sameUnitToken: boolean;
  readonly sameDimensionToken: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceUnit: { type: "string", maxLength: 8192, minLength: 1 },
    measurementUnit: { type: "string", maxLength: 8192, minLength: 1 },
    referenceDimension: { type: "string", maxLength: 8192, minLength: 1 },
    measurementDimension: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: [
    "referenceUnit",
    "measurementUnit",
    "referenceDimension",
    "measurementDimension",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameUnitToken: { type: "boolean" },
    sameDimensionToken: { type: "boolean" },
  },
  required: ["sameUnitToken", "sameDimensionToken"],
} as const;
/** Compare literal control-reference unit and dimension labels without performing dimensional analysis or unit conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    referenceUnit,
    measurementUnit,
    referenceDimension,
    measurementDimension,
  } = request;
  const compute = (): Output => {
    H.domain(
      referenceUnit.length > 0 &&
        measurementUnit.length > 0 &&
        referenceDimension.length > 0 &&
        measurementDimension.length > 0,
      "referenceUnit",
    );
    return {
      sameUnitToken: referenceUnit === measurementUnit,
      sameDimensionToken: referenceDimension === measurementDimension,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referenceUnit: "m",
    measurementUnit: "cm",
    referenceDimension: "length",
    measurementDimension: "length",
  },
  output: { sameUnitToken: false, sameDimensionToken: true },
} satisfies ToolExample<Input, Output>;
export const controlReferenceUnitDimensionPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cybernetics", "engineering"],
      keywords: ["cybernetics", "engineering"],
    },
    id: "cybernetics/control-reference-unit-dimension-pair",
    title: "Control Reference Unit Dimension Pair",
    description:
      "Compare literal control-reference unit and dimension labels without performing dimensional analysis or unit conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceUnit: { type: "string", maxLength: 8192, minLength: 1 },
        measurementUnit: { type: "string", maxLength: 8192, minLength: 1 },
        referenceDimension: { type: "string", maxLength: 8192, minLength: 1 },
        measurementDimension: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: [
        "referenceUnit",
        "measurementUnit",
        "referenceDimension",
        "measurementDimension",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sameUnitToken: { type: "boolean" },
        sameDimensionToken: { type: "boolean" },
      },
      required: ["sameUnitToken", "sameDimensionToken"],
    },
    ports: {
      inputs: [
        {
          id: "referenceUnit",
          label: "Reference Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "measurementUnit",
          label: "Measurement Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceDimension",
          label: "Reference Dimension",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "measurementDimension",
          label: "Measurement Dimension",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "sameUnitToken",
          label: "Same Unit Token",
          valueType: { type: "boolean" },
        },
        {
          id: "sameDimensionToken",
          label: "Same Dimension Token",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = controlReferenceUnitDimensionPairTool.execute;
export default controlReferenceUnitDimensionPairTool;
