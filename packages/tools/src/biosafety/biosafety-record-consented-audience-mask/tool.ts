import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly audiences: readonly string[];
  readonly permitted: readonly string[];
  readonly withdrawn: readonly string[];
};
export type Output = {
  readonly mask: readonly boolean[];
  readonly permittedAudiences: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    audiences: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    permitted: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    withdrawn: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["audiences", "permitted", "withdrawn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mask: { type: "array", maxItems: 256, items: { type: "boolean" } },
    permittedAudiences: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["mask", "permittedAudiences"],
} as const;
/** Filter supplied record audiences using explicit permission and withdrawal tokens. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { audiences, permitted, withdrawn } = request;
  const compute = (): Output => {
    const mask = audiences.map(
      (x) => permitted.includes(x) && !withdrawn.includes(x),
    );
    return { mask, permittedAudiences: audiences.filter((_, i) => mask[i]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    audiences: ["team", "public", "auditor"],
    permitted: ["team", "auditor"],
    withdrawn: ["auditor"],
  },
  output: { mask: [true, false, false], permittedAudiences: ["team"] },
} satisfies ToolExample<Input, Output>;
export const biosafetyRecordConsentedAudienceMaskTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosafety/biosafety-record-consented-audience-mask",
      title: "Biosafety Record Consented Audience Mask Tool",
      description:
        "Filter supplied record audiences using explicit permission and withdrawal tokens.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          audiences: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          permitted: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          withdrawn: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["audiences", "permitted", "withdrawn"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mask: { type: "array", maxItems: 256, items: { type: "boolean" } },
          permittedAudiences: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["mask", "permittedAudiences"],
      },
      ports: {
        inputs: [
          {
            id: "audiences",
            label: "Audiences",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "permitted",
            label: "Permitted",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "withdrawn",
            label: "Withdrawn",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "mask",
            label: "Mask",
            valueType: { type: "list", items: { type: "boolean" } },
          },
          {
            id: "permittedAudiences",
            label: "Permitted Audiences",
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = biosafetyRecordConsentedAudienceMaskTool.execute;
export default biosafetyRecordConsentedAudienceMaskTool;
