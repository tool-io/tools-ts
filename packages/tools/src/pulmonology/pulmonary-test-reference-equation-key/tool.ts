import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly testCode: string;
  readonly equationId: string;
  readonly referenceVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    testCode: { type: "string", maxLength: 8192, minLength: 1 },
    equationId: { type: "string", maxLength: 8192, minLength: 1 },
    referenceVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["testCode", "equationId", "referenceVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Identify an explicitly selected pulmonary reference equation without providing predictions or selecting a population model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { testCode, equationId, referenceVersion } = request;
  const compute = (): Output => {
    H.domain(testCode.length > 0, "testCode");
    H.domain(equationId.length > 0, "equationId");
    H.domain(referenceVersion.length > 0, "referenceVersion");
    return { token: JSON.stringify([testCode, equationId, referenceVersion]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { testCode: "T17", equationId: "EQ-A", referenceVersion: "v3" },
  output: { token: '["T17","EQ-A","v3"]' },
} satisfies ToolExample<Input, Output>;
export const pulmonaryTestReferenceEquationKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pulmonology", "health and medicine"],
      keywords: ["pulmonology", "health and medicine"],
    },
    id: "pulmonology/pulmonary-test-reference-equation-key",
    title: "Pulmonary Test Reference Equation Key",
    description:
      "Identify an explicitly selected pulmonary reference equation without providing predictions or selecting a population model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        testCode: { type: "string", maxLength: 8192, minLength: 1 },
        equationId: { type: "string", maxLength: 8192, minLength: 1 },
        referenceVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["testCode", "equationId", "referenceVersion"],
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
          id: "testCode",
          label: "Test Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "equationId",
          label: "Equation Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceVersion",
          label: "Reference Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = pulmonaryTestReferenceEquationKeyTool.execute;
export default pulmonaryTestReferenceEquationKeyTool;
