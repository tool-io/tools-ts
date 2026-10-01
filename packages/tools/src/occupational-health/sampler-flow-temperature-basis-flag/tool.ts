import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredFlow: number;
  readonly measuredKelvin: number;
  readonly referenceKelvin: number;
  readonly measuredPressure: number;
  readonly referencePressure: number;
  readonly useReference: boolean;
};
export type Output = { readonly reportedFlow: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredFlow: { type: "number", minimum: 0 },
    measuredKelvin: { type: "number", exclusiveMinimum: 0 },
    referenceKelvin: { type: "number", exclusiveMinimum: 0 },
    measuredPressure: { type: "number", exclusiveMinimum: 0 },
    referencePressure: { type: "number", exclusiveMinimum: 0 },
    useReference: { type: "boolean" },
  },
  required: [
    "measuredFlow",
    "measuredKelvin",
    "referenceKelvin",
    "measuredPressure",
    "referencePressure",
    "useReference",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reportedFlow: { type: "number" } },
  required: ["reportedFlow"],
} as const;
/** Ideal dry-gas flow conversion with supplied absolute states; does not infer sampling compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    measuredFlow,
    measuredKelvin,
    referenceKelvin,
    measuredPressure,
    referencePressure,
    useReference,
  } = request;
  const compute = (): Output => {
    H.domain(measuredFlow >= 0);
    H.positive(measuredKelvin);
    H.positive(referenceKelvin);
    H.positive(measuredPressure);
    H.positive(referencePressure);
    return {
      reportedFlow: useReference
        ? (((measuredFlow * measuredPressure) / referencePressure) *
            referenceKelvin) /
          measuredKelvin
        : measuredFlow,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredFlow: 2,
    measuredKelvin: 300,
    referenceKelvin: 300,
    measuredPressure: 100,
    referencePressure: 200,
    useReference: true,
  },
  output: { reportedFlow: 1 },
} satisfies ToolExample<Input, Output>;
export const samplerFlowTemperatureBasisFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-health/sampler-flow-temperature-basis-flag",
    title: "Sampler Flow Temperature Basis Flag Tool",
    description:
      "Ideal dry-gas flow conversion with supplied absolute states; does not infer sampling compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredFlow: { type: "number", minimum: 0 },
        measuredKelvin: { type: "number", exclusiveMinimum: 0 },
        referenceKelvin: { type: "number", exclusiveMinimum: 0 },
        measuredPressure: { type: "number", exclusiveMinimum: 0 },
        referencePressure: { type: "number", exclusiveMinimum: 0 },
        useReference: { type: "boolean" },
      },
      required: [
        "measuredFlow",
        "measuredKelvin",
        "referenceKelvin",
        "measuredPressure",
        "referencePressure",
        "useReference",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { reportedFlow: { type: "number" } },
      required: ["reportedFlow"],
    },
    ports: {
      inputs: [
        {
          id: "measuredFlow",
          label: "Measured Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredKelvin",
          label: "Measured Kelvin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceKelvin",
          label: "Reference Kelvin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredPressure",
          label: "Measured Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePressure",
          label: "Reference Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "useReference",
          label: "Use Reference",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "reportedFlow",
          label: "Reported Flow",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = samplerFlowTemperatureBasisFlagTool.execute;
export default samplerFlowTemperatureBasisFlagTool;
