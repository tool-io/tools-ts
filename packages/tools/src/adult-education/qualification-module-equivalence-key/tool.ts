import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceQualification: string;
  readonly sourceModule: string;
  readonly targetQualification: string;
  readonly targetModule: string;
};
export type Output = { readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceQualification: { type: "string", maxLength: 8192, minLength: 1 },
    sourceModule: { type: "string", maxLength: 8192, minLength: 1 },
    targetQualification: { type: "string", maxLength: 8192, minLength: 1 },
    targetModule: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: [
    "sourceQualification",
    "sourceModule",
    "targetQualification",
    "targetModule",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { key: { type: "string", maxLength: 8192 } },
  required: ["key"],
} as const;
/** Encode an explicitly asserted directed module-equivalence link without deciding credit recognition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    sourceQualification,
    sourceModule,
    targetQualification,
    targetModule,
  } = request;
  const compute = (): Output => {
    H.domain(
      sourceQualification.length > 0 &&
        sourceModule.length > 0 &&
        targetQualification.length > 0 &&
        targetModule.length > 0,
      "sourceQualification",
    );
    return {
      key: JSON.stringify([
        sourceQualification,
        sourceModule,
        targetQualification,
        targetModule,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceQualification: "Q-A",
    sourceModule: "M1",
    targetQualification: "Q-B",
    targetModule: "N2",
  },
  output: { key: '["Q-A","M1","Q-B","N2"]' },
} satisfies ToolExample<Input, Output>;
export const qualificationModuleEquivalenceKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["adult-education", "adult education", "education"],
      keywords: ["adult education", "education"],
    },
    id: "adult-education/qualification-module-equivalence-key",
    title: "Qualification Module Equivalence Key",
    description:
      "Encode an explicitly asserted directed module-equivalence link without deciding credit recognition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceQualification: { type: "string", maxLength: 8192, minLength: 1 },
        sourceModule: { type: "string", maxLength: 8192, minLength: 1 },
        targetQualification: { type: "string", maxLength: 8192, minLength: 1 },
        targetModule: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: [
        "sourceQualification",
        "sourceModule",
        "targetQualification",
        "targetModule",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { key: { type: "string", maxLength: 8192 } },
      required: ["key"],
    },
    ports: {
      inputs: [
        {
          id: "sourceQualification",
          label: "Source Qualification",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceModule",
          label: "Source Module",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "targetQualification",
          label: "Target Qualification",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "targetModule",
          label: "Target Module",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "key", label: "Key", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = qualificationModuleEquivalenceKeyTool.execute;
export default qualificationModuleEquivalenceKeyTool;
