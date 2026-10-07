import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly testId: string;
  readonly jointId: string;
  readonly angleText: string;
  readonly referenceFrame: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    testId: { type: "string", maxLength: 8192, minLength: 1 },
    jointId: { type: "string", maxLength: 8192, minLength: 1 },
    angleText: { type: "string", maxLength: 8192, minLength: 1 },
    referenceFrame: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["testId", "jointId", "angleText", "referenceFrame"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit prosthetic bench joint-angle record and reference frame without recommending settings. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { testId, jointId, angleText, referenceFrame } = request;
  const compute = (): Output => {
    H.domain(testId.length > 0, "testId");
    H.domain(jointId.length > 0, "jointId");
    H.domain(angleText.length > 0, "angleText");
    H.domain(referenceFrame.length > 0, "referenceFrame");
    return {
      token: JSON.stringify([testId, jointId, angleText, referenceFrame]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    testId: "T17",
    jointId: "J4",
    angleText: "30 deg",
    referenceFrame: "bench zero",
  },
  output: { token: '["T17","J4","30 deg","bench zero"]' },
} satisfies ToolExample<Input, Output>;
export const prostheticBenchJointAngleTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioengineering", "engineering"],
      keywords: ["bioengineering", "engineering"],
    },
    id: "bioengineering/prosthetic-bench-joint-angle-tag",
    title: "Prosthetic Bench Joint Angle Tag",
    description:
      "Preserve an explicit prosthetic bench joint-angle record and reference frame without recommending settings.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        testId: { type: "string", maxLength: 8192, minLength: 1 },
        jointId: { type: "string", maxLength: 8192, minLength: 1 },
        angleText: { type: "string", maxLength: 8192, minLength: 1 },
        referenceFrame: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["testId", "jointId", "angleText", "referenceFrame"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "testId",
          label: "Test Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "jointId",
          label: "Joint Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "angleText",
          label: "Angle Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceFrame",
          label: "Reference Frame",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = prostheticBenchJointAngleTagTool.execute;
export default prostheticBenchJointAngleTagTool;
