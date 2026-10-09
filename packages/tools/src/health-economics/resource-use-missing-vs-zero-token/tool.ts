import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resourceRecordId: string;
  readonly status: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resourceRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    status: {
      type: "string",
      maxLength: 8192,
      enum: ["measured-zero", "measured-nonzero", "missing", "not-applicable"],
    },
  },
  required: ["resourceRecordId", "status"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Distinguish explicitly recorded zero resource use from missing or inapplicable data without imputing quantity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resourceRecordId, status } = request;
  const compute = (): Output => {
    H.domain(resourceRecordId.length > 0, "resourceRecordId");
    H.domain(
      [
        "measured-zero",
        "measured-nonzero",
        "missing",
        "not-applicable",
      ].includes(status),
      "status",
    );
    return { label: resourceRecordId + " [" + status + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { resourceRecordId: "R17", status: "missing" },
  output: { label: "R17 [missing]" },
} satisfies ToolExample<Input, Output>;
export const resourceUseMissingVsZeroTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-economics/resource-use-missing-vs-zero-token",
    title: "Resource Use Missing Vs Zero Token Tool",
    description:
      "Distinguish explicitly recorded zero resource use from missing or inapplicable data without imputing quantity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resourceRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        status: {
          type: "string",
          maxLength: 8192,
          enum: [
            "measured-zero",
            "measured-nonzero",
            "missing",
            "not-applicable",
          ],
        },
      },
      required: ["resourceRecordId", "status"],
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
          id: "resourceRecordId",
          label: "Resource Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "status",
          label: "Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = resourceUseMissingVsZeroTokenTool.execute;
export default resourceUseMissingVsZeroTokenTool;
