import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalId: string;
  readonly correctionParent: string;
  readonly originalVersion: number;
  readonly correctedVersion: number;
};
export type Output = {
  readonly linked: boolean;
  readonly laterVersion: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalId: { type: "string", maxLength: 8192 },
    correctionParent: { type: "string", maxLength: 8192 },
    originalVersion: { type: "integer", minimum: 0 },
    correctedVersion: { type: "integer", minimum: 0 },
  },
  required: [
    "originalId",
    "correctionParent",
    "originalVersion",
    "correctedVersion",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    linked: { type: "boolean" },
    laterVersion: { type: "boolean" },
  },
  required: ["linked", "laterVersion"],
} as const;
/** Audit supplied work-order correction linkage and version progression. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalId, correctionParent, originalVersion, correctedVersion } =
    request;
  const compute = (): Output => {
    H.integer(originalVersion, 0);
    H.integer(correctedVersion, 0);
    return {
      linked: originalId === correctionParent,
      laterVersion: correctedVersion > originalVersion,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    originalId: "W1",
    correctionParent: "W1",
    originalVersion: 2,
    correctedVersion: 3,
  },
  output: { linked: true, laterVersion: true },
} satisfies ToolExample<Input, Output>;
export const farmWorkOrderCorrectedSourceLinkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroinformatics/farm-work-order-corrected-source-link",
    title: "Farm Work Order Corrected Source Link Tool",
    description:
      "Audit supplied work-order correction linkage and version progression.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalId: { type: "string", maxLength: 8192 },
        correctionParent: { type: "string", maxLength: 8192 },
        originalVersion: { type: "integer", minimum: 0 },
        correctedVersion: { type: "integer", minimum: 0 },
      },
      required: [
        "originalId",
        "correctionParent",
        "originalVersion",
        "correctedVersion",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        linked: { type: "boolean" },
        laterVersion: { type: "boolean" },
      },
      required: ["linked", "laterVersion"],
    },
    ports: {
      inputs: [
        {
          id: "originalId",
          label: "Original Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "correctionParent",
          label: "Correction Parent",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "originalVersion",
          label: "Original Version",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "correctedVersion",
          label: "Corrected Version",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "linked", label: "Linked", valueType: { type: "boolean" } },
        {
          id: "laterVersion",
          label: "Later Version",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmWorkOrderCorrectedSourceLinkTool.execute;
export default farmWorkOrderCorrectedSourceLinkTool;
