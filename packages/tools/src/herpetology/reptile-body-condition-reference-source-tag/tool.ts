import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measurementId: string;
  readonly suppliedReferenceModel: string;
  readonly sourceVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measurementId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedReferenceModel: { type: "string", maxLength: 8192, minLength: 1 },
    sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["measurementId", "suppliedReferenceModel", "sourceVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit reptile body-condition reference model and version without calculating or interpreting condition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measurementId, suppliedReferenceModel, sourceVersion } = request;
  const compute = (): Output => {
    H.domain(measurementId.length > 0, "measurementId");
    H.domain(suppliedReferenceModel.length > 0, "suppliedReferenceModel");
    H.domain(sourceVersion.length > 0, "sourceVersion");
    return {
      token: JSON.stringify([
        measurementId,
        suppliedReferenceModel,
        sourceVersion,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measurementId: "M17",
    suppliedReferenceModel: "model A",
    sourceVersion: "v2",
  },
  output: { token: '["M17","model A","v2"]' },
} satisfies ToolExample<Input, Output>;
export const reptileBodyConditionReferenceSourceTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "herpetology/reptile-body-condition-reference-source-tag",
      title: "Reptile Body Condition Reference Source Tag Tool",
      description:
        "Record an explicit reptile body-condition reference model and version without calculating or interpreting condition.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          measurementId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedReferenceModel: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["measurementId", "suppliedReferenceModel", "sourceVersion"],
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
            id: "measurementId",
            label: "Measurement Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedReferenceModel",
            label: "Supplied Reference Model",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "sourceVersion",
            label: "Source Version",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = reptileBodyConditionReferenceSourceTagTool.execute;
export default reptileBodyConditionReferenceSourceTagTool;
