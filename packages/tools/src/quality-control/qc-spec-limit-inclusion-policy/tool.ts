import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly result: number;
  readonly lowerLimit: number;
  readonly upperLimit: number;
  readonly includeLower: boolean;
  readonly includeUpper: boolean;
};
export type Output = { readonly withinSuppliedLimits: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    result: { type: "number" },
    lowerLimit: { type: "number" },
    upperLimit: { type: "number" },
    includeLower: { type: "boolean" },
    includeUpper: { type: "boolean" },
  },
  required: [
    "result",
    "lowerLimit",
    "upperLimit",
    "includeLower",
    "includeUpper",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { withinSuppliedLimits: { type: "boolean" } },
  required: ["withinSuppliedLimits"],
} as const;
/** Apply explicit endpoint inclusion policies to supplied result limits without choosing a specification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { result, lowerLimit, upperLimit, includeLower, includeUpper } =
    request;
  const compute = (): Output => {
    H.domain(upperLimit >= lowerLimit, "upperLimit");
    return {
      withinSuppliedLimits:
        (includeLower ? result >= lowerLimit : result > lowerLimit) &&
        (includeUpper ? result <= upperLimit : result < upperLimit),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    result: 5,
    lowerLimit: 5,
    upperLimit: 10,
    includeLower: true,
    includeUpper: false,
  },
  output: { withinSuppliedLimits: true },
} satisfies ToolExample<Input, Output>;
export const qcSpecLimitInclusionPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "quality-control",
        "quality control",
        "research and quality management",
      ],
      keywords: ["quality control", "research and quality management"],
    },
    id: "quality-control/qc-spec-limit-inclusion-policy",
    title: "QC Spec Limit Inclusion Policy",
    description:
      "Apply explicit endpoint inclusion policies to supplied result limits without choosing a specification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        result: { type: "number" },
        lowerLimit: { type: "number" },
        upperLimit: { type: "number" },
        includeLower: { type: "boolean" },
        includeUpper: { type: "boolean" },
      },
      required: [
        "result",
        "lowerLimit",
        "upperLimit",
        "includeLower",
        "includeUpper",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { withinSuppliedLimits: { type: "boolean" } },
      required: ["withinSuppliedLimits"],
    },
    ports: {
      inputs: [
        {
          id: "result",
          label: "Result",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerLimit",
          label: "Lower Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperLimit",
          label: "Upper Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeLower",
          label: "Include Lower",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeUpper",
          label: "Include Upper",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "withinSuppliedLimits",
          label: "Within Supplied Limits",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = qcSpecLimitInclusionPolicyTool.execute;
export default qcSpecLimitInclusionPolicyTool;
