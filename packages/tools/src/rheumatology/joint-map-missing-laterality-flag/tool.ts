import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly jointNames: readonly string[];
  readonly lateralities: readonly string[];
  readonly allowedLateralities: readonly string[];
};
export type Output = {
  readonly missingIndices: readonly number[];
  readonly unknownIndices: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    jointNames: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    lateralities: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    allowedLateralities: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["jointNames", "lateralities", "allowedLateralities"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    unknownIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["missingIndices", "unknownIndices"],
} as const;
/** Audit supplied joint-record laterality tokens without inferring symptoms or disease activity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { jointNames, lateralities, allowedLateralities } = request;
  const compute = (): Output => {
    H.sameLength(jointNames, lateralities);
    return {
      missingIndices: lateralities.flatMap((x, i) => (x === "" ? [i] : [])),
      unknownIndices: lateralities.flatMap((x, i) =>
        x !== "" && !allowedLateralities.includes(x) ? [i] : [],
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    jointNames: ["wrist", "knee", "ankle"],
    lateralities: ["L", "", "X"],
    allowedLateralities: ["L", "R"],
  },
  output: { missingIndices: [1], unknownIndices: [2] },
} satisfies ToolExample<Input, Output>;
export const jointMapMissingLateralityFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "rheumatology/joint-map-missing-laterality-flag",
    title: "Joint Map Missing Laterality Flag Tool",
    description:
      "Audit supplied joint-record laterality tokens without inferring symptoms or disease activity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        jointNames: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        lateralities: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        allowedLateralities: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["jointNames", "lateralities", "allowedLateralities"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missingIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        unknownIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["missingIndices", "unknownIndices"],
    },
    ports: {
      inputs: [
        {
          id: "jointNames",
          label: "Joint Names",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "lateralities",
          label: "Lateralities",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "allowedLateralities",
          label: "Allowed Lateralities",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "missingIndices",
          label: "Missing Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "unknownIndices",
          label: "Unknown Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = jointMapMissingLateralityFlagTool.execute;
export default jointMapMissingLateralityFlagTool;
