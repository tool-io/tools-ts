import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly seedSourceCode: string;
  readonly status: string;
  readonly sourceReference: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seedSourceCode: { type: "string", maxLength: 8192, minLength: 1 },
    status: {
      type: "string",
      maxLength: 8192,
      enum: ["granted", "declined", "pending", "withdrawn", "unknown"],
    },
    sourceReference: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["seedSourceCode", "status", "sourceReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicitly recorded seed-source permission metadata without authorizing collection, transfer or planting. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { seedSourceCode, status, sourceReference } = request;
  const compute = (): Output => {
    H.domain(
      seedSourceCode.length > 0 && sourceReference.length > 0,
      "seedSourceCode",
    );
    H.domain(
      ["granted", "declined", "pending", "withdrawn", "unknown"].includes(
        status,
      ),
      "status",
    );
    return {
      label: seedSourceCode + " [" + status + "; " + sourceReference + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    seedSourceCode: "SRC17",
    status: "granted",
    sourceReference: "record 42",
  },
  output: { label: "SRC17 [granted; record 42]" },
} satisfies ToolExample<Input, Output>;
export const seedSourcePermissionStatusLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["conservation-biology", "conservation biology", "biology"],
      keywords: ["conservation biology", "biology"],
    },
    id: "conservation-biology/seed-source-permission-status-label",
    title: "Seed Source Permission Status Label",
    description:
      "Label explicitly recorded seed-source permission metadata without authorizing collection, transfer or planting.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        seedSourceCode: { type: "string", maxLength: 8192, minLength: 1 },
        status: {
          type: "string",
          maxLength: 8192,
          enum: ["granted", "declined", "pending", "withdrawn", "unknown"],
        },
        sourceReference: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["seedSourceCode", "status", "sourceReference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "seedSourceCode",
          label: "Seed Source Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "status",
          label: "Status",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceReference",
          label: "Source Reference",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = seedSourcePermissionStatusLabelTool.execute;
export default seedSourcePermissionStatusLabelTool;
