import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: boolean;
  readonly germinated: boolean;
  readonly excluded: boolean;
};
export type Output = { readonly status: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "boolean" },
    germinated: { type: "boolean" },
    excluded: { type: "boolean" },
  },
  required: ["observed", "germinated", "excluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { status: { type: "string", maxLength: 8192 } },
  required: ["status"],
} as const;
/** Encode explicit germination observation and exclusion flags without evaluating seed viability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, germinated, excluded } = request;
  const compute = (): Output => {
    H.domain(observed || !germinated, "germinated");
    return {
      status: excluded
        ? "excluded"
        : !observed
          ? "not-observed"
          : germinated
            ? "germinated"
            : "not-germinated",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: true, germinated: true, excluded: false },
  output: { status: "germinated" },
} satisfies ToolExample<Input, Output>;
export const seedGerminationStatusCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["botany", "biology"],
      keywords: ["botany", "biology"],
    },
    id: "botany/seed-germination-status-code",
    title: "Seed Germination Status Code",
    description:
      "Encode explicit germination observation and exclusion flags without evaluating seed viability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observed: { type: "boolean" },
        germinated: { type: "boolean" },
        excluded: { type: "boolean" },
      },
      required: ["observed", "germinated", "excluded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { status: { type: "string", maxLength: 8192 } },
      required: ["status"],
    },
    ports: {
      inputs: [
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "germinated",
          label: "Germinated",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "excluded",
          label: "Excluded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "status", label: "Status", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = seedGerminationStatusCodeTool.execute;
export default seedGerminationStatusCodeTool;
