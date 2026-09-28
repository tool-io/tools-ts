import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly typeSize: number;
  readonly measuredLeading: number;
  readonly typeUnitInPoints: number;
  readonly leadingUnitInPoints: number;
};
export type Output = {
  readonly typeSizePerLeading: number;
  readonly leadingPerTypeSize: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    typeSize: { type: "number", exclusiveMinimum: 0 },
    measuredLeading: { type: "number", exclusiveMinimum: 0 },
    typeUnitInPoints: { type: "number", exclusiveMinimum: 0 },
    leadingUnitInPoints: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "typeSize",
    "measuredLeading",
    "typeUnitInPoints",
    "leadingUnitInPoints",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    typeSizePerLeading: { type: "number" },
    leadingPerTypeSize: { type: "number" },
  },
  required: ["typeSizePerLeading", "leadingPerTypeSize"],
} as const;
/** Compare measured leading and type size in explicit common units, returning the reciprocal ratios without generating leading. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { typeSize, measuredLeading, typeUnitInPoints, leadingUnitInPoints } =
    request;
  const compute = (): Output => {
    H.positive(typeSize);
    H.positive(measuredLeading);
    H.positive(typeUnitInPoints);
    H.positive(leadingUnitInPoints);
    return {
      typeSizePerLeading:
        (typeSize * typeUnitInPoints) / (measuredLeading * leadingUnitInPoints),
      leadingPerTypeSize:
        (measuredLeading * leadingUnitInPoints) / (typeSize * typeUnitInPoints),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    typeSize: 12,
    measuredLeading: 18,
    typeUnitInPoints: 1,
    leadingUnitInPoints: 1,
  },
  output: { typeSizePerLeading: 0.6666666666666666, leadingPerTypeSize: 1.5 },
} satisfies ToolExample<Input, Output>;
export const typeSizeLeadingRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/type-size-leading-ratio",
    title: "Type Size Leading Ratio Tool",
    description:
      "Compare measured leading and type size in explicit common units, returning the reciprocal ratios without generating leading.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        typeSize: { type: "number", exclusiveMinimum: 0 },
        measuredLeading: { type: "number", exclusiveMinimum: 0 },
        typeUnitInPoints: { type: "number", exclusiveMinimum: 0 },
        leadingUnitInPoints: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "typeSize",
        "measuredLeading",
        "typeUnitInPoints",
        "leadingUnitInPoints",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        typeSizePerLeading: { type: "number" },
        leadingPerTypeSize: { type: "number" },
      },
      required: ["typeSizePerLeading", "leadingPerTypeSize"],
    },
    ports: {
      inputs: [
        {
          id: "typeSize",
          label: "Type Size",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredLeading",
          label: "Measured Leading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "typeUnitInPoints",
          label: "Type Unit In Points",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leadingUnitInPoints",
          label: "Leading Unit In Points",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "typeSizePerLeading",
          label: "Type Size Per Leading",
          valueType: { type: "number" },
        },
        {
          id: "leadingPerTypeSize",
          label: "Leading Per Type Size",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = typeSizeLeadingRatioTool.execute;
export default typeSizeLeadingRatioTool;
