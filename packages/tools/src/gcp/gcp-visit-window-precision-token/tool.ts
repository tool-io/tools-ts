import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visitLower: number;
  readonly visitUpper: number;
  readonly allowedLower: number;
  readonly allowedUpper: number;
};
export type Output = {
  readonly certainlyInside: boolean;
  readonly possiblyInside: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visitLower: { type: "integer" },
    visitUpper: { type: "integer" },
    allowedLower: { type: "integer" },
    allowedUpper: { type: "integer" },
  },
  required: ["visitLower", "visitUpper", "allowedLower", "allowedUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    certainlyInside: { type: "boolean" },
    possiblyInside: { type: "boolean" },
  },
  required: ["certainlyInside", "possiblyInside"],
} as const;
/** Compare supplied closed visit date bounds and protocol window bounds without determining compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visitLower, visitUpper, allowedLower, allowedUpper } = request;
  const compute = (): Output => {
    H.domain(visitLower <= visitUpper && allowedLower <= allowedUpper);
    return {
      certainlyInside: visitLower >= allowedLower && visitUpper <= allowedUpper,
      possiblyInside: visitUpper >= allowedLower && visitLower <= allowedUpper,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { visitLower: 10, visitUpper: 12, allowedLower: 9, allowedUpper: 13 },
  output: { certainlyInside: true, possiblyInside: true },
} satisfies ToolExample<Input, Output>;
export const gcpVisitWindowPrecisionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gcp/gcp-visit-window-precision-token",
    title: "GCP Visit Window Precision Token Tool",
    description:
      "Compare supplied closed visit date bounds and protocol window bounds without determining compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visitLower: { type: "integer" },
        visitUpper: { type: "integer" },
        allowedLower: { type: "integer" },
        allowedUpper: { type: "integer" },
      },
      required: ["visitLower", "visitUpper", "allowedLower", "allowedUpper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        certainlyInside: { type: "boolean" },
        possiblyInside: { type: "boolean" },
      },
      required: ["certainlyInside", "possiblyInside"],
    },
    ports: {
      inputs: [
        {
          id: "visitLower",
          label: "Visit Lower",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "visitUpper",
          label: "Visit Upper",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "allowedLower",
          label: "Allowed Lower",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "allowedUpper",
          label: "Allowed Upper",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "certainlyInside",
          label: "Certainly Inside",
          valueType: { type: "boolean" },
        },
        {
          id: "possiblyInside",
          label: "Possibly Inside",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = gcpVisitWindowPrecisionTokenTool.execute;
export default gcpVisitWindowPrecisionTokenTool;
