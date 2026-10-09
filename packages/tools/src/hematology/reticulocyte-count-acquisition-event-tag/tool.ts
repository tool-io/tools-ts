import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly countRecordId: string;
  readonly acquisitionId: string;
  readonly suppliedMethod: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    acquisitionId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedMethod: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["countRecordId", "acquisitionId", "suppliedMethod"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Link an explicit reticulocyte count record to acquisition and method identifiers without interpreting hematology. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { countRecordId, acquisitionId, suppliedMethod } = request;
  const compute = (): Output => {
    H.domain(countRecordId.length > 0, "countRecordId");
    H.domain(acquisitionId.length > 0, "acquisitionId");
    H.domain(suppliedMethod.length > 0, "suppliedMethod");
    return {
      token: JSON.stringify([countRecordId, acquisitionId, suppliedMethod]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    countRecordId: "C17",
    acquisitionId: "A4",
    suppliedMethod: "method M2",
  },
  output: { token: '["C17","A4","method M2"]' },
} satisfies ToolExample<Input, Output>;
export const reticulocyteCountAcquisitionEventTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hematology/reticulocyte-count-acquisition-event-tag",
      title: "Reticulocyte Count Acquisition Event Tag Tool",
      description:
        "Link an explicit reticulocyte count record to acquisition and method identifiers without interpreting hematology.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          countRecordId: { type: "string", maxLength: 8192, minLength: 1 },
          acquisitionId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedMethod: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["countRecordId", "acquisitionId", "suppliedMethod"],
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
            id: "countRecordId",
            label: "Count Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "acquisitionId",
            label: "Acquisition Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedMethod",
            label: "Supplied Method",
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
export const run = reticulocyteCountAcquisitionEventTagTool.execute;
export default reticulocyteCountAcquisitionEventTagTool;
