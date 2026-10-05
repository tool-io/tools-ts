import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly status: string };
export type Output = {
  readonly label: string;
  readonly countedInYesNo: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    status: {
      type: "string",
      maxLength: 8192,
      enum: ["yes", "no", "abstain", "absent", "paired"],
    },
  },
  required: ["status"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    countedInYesNo: { type: "boolean" },
  },
  required: ["label", "countedInYesNo"],
} as const;
/** Keep a supplied parliamentary abstention distinct from absence or a recorded voting pair; no chamber-specific majority rule is applied. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { status } = request;
  const compute = (): Output => {
    H.domain(
      ["yes", "no", "abstain", "absent", "paired"].includes(status),
      "status",
    );
    return {
      label: status,
      countedInYesNo: status === "yes" || status === "no",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { status: "abstain" },
  output: { label: "abstain", countedInYesNo: false },
} satisfies ToolExample<Input, Output>;
export const parliamentaryAbstentionStatusLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/parliamentary-abstention-status-label",
    title: "Parliamentary Abstention Status Label Tool",
    description:
      "Keep a supplied parliamentary abstention distinct from absence or a recorded voting pair; no chamber-specific majority rule is applied.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        status: {
          type: "string",
          maxLength: 8192,
          enum: ["yes", "no", "abstain", "absent", "paired"],
        },
      },
      required: ["status"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        countedInYesNo: { type: "boolean" },
      },
      required: ["label", "countedInYesNo"],
    },
    ports: {
      inputs: [
        {
          id: "status",
          label: "Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        {
          id: "countedInYesNo",
          label: "Counted In Yes No",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = parliamentaryAbstentionStatusLabelTool.execute;
export default parliamentaryAbstentionStatusLabelTool;
