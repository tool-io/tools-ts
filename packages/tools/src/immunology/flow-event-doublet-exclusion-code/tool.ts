import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventRecordId: string;
  readonly suppliedExclusionCode: string;
  readonly gateSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedExclusionCode: { type: "string", maxLength: 8192, minLength: 1 },
    gateSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["eventRecordId", "suppliedExclusionCode", "gateSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicitly supplied flow-event doublet-exclusion code and gate source without classifying events. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventRecordId, suppliedExclusionCode, gateSource } = request;
  const compute = (): Output => {
    H.domain(eventRecordId.length > 0, "eventRecordId");
    H.domain(suppliedExclusionCode.length > 0, "suppliedExclusionCode");
    H.domain(gateSource.length > 0, "gateSource");
    return {
      token: JSON.stringify([eventRecordId, suppliedExclusionCode, gateSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eventRecordId: "E17",
    suppliedExclusionCode: "excluded",
    gateSource: "gate G4",
  },
  output: { token: '["E17","excluded","gate G4"]' },
} satisfies ToolExample<Input, Output>;
export const flowEventDoubletExclusionCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "immunology/flow-event-doublet-exclusion-code",
    title: "Flow Event Doublet Exclusion Code Tool",
    description:
      "Preserve an explicitly supplied flow-event doublet-exclusion code and gate source without classifying events.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedExclusionCode: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
        gateSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["eventRecordId", "suppliedExclusionCode", "gateSource"],
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
          id: "eventRecordId",
          label: "Event Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedExclusionCode",
          label: "Supplied Exclusion Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "gateSource",
          label: "Gate Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = flowEventDoubletExclusionCodeTool.execute;
export default flowEventDoubletExclusionCodeTool;
