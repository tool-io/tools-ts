import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reviewTime: number;
  readonly dueTime: number;
  readonly suppliedExtension: number;
  readonly extensionRecorded: boolean;
};
export type Output = {
  readonly effectiveDue: number;
  readonly lateness: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reviewTime: { type: "number" },
    dueTime: { type: "number" },
    suppliedExtension: { type: "number", minimum: 0 },
    extensionRecorded: { type: "boolean" },
  },
  required: ["reviewTime", "dueTime", "suppliedExtension", "extensionRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveDue: { type: "number" },
    lateness: { type: "number" },
  },
  required: ["effectiveDue", "lateness"],
} as const;
/** Inspect supplied administrative review timing flags without granting access or determining authorization validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reviewTime, dueTime, suppliedExtension, extensionRecorded } = request;
  const compute = (): Output => {
    H.domain(suppliedExtension >= 0);
    return {
      effectiveDue: dueTime + (extensionRecorded ? suppliedExtension : 0),
      lateness:
        reviewTime - dueTime - (extensionRecorded ? suppliedExtension : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reviewTime: 120,
    dueTime: 100,
    suppliedExtension: 10,
    extensionRecorded: true,
  },
  output: { effectiveDue: 110, lateness: 10 },
} satisfies ToolExample<Input, Output>;
export const authorizationReviewOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosecurity/authorization-review-offset",
    title: "Authorization Review Offset Tool",
    description:
      "Inspect supplied administrative review timing flags without granting access or determining authorization validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reviewTime: { type: "number" },
        dueTime: { type: "number" },
        suppliedExtension: { type: "number", minimum: 0 },
        extensionRecorded: { type: "boolean" },
      },
      required: [
        "reviewTime",
        "dueTime",
        "suppliedExtension",
        "extensionRecorded",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveDue: { type: "number" },
        lateness: { type: "number" },
      },
      required: ["effectiveDue", "lateness"],
    },
    ports: {
      inputs: [
        {
          id: "reviewTime",
          label: "Review Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dueTime",
          label: "Due Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedExtension",
          label: "Supplied Extension",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "extensionRecorded",
          label: "Extension Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "effectiveDue",
          label: "Effective Due",
          valueType: { type: "number" },
        },
        { id: "lateness", label: "Lateness", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = authorizationReviewOffsetTool.execute;
export default authorizationReviewOffsetTool;
