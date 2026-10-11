import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly unitId: string;
  readonly keyHandoverDateText: string;
  readonly possessionDateText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unitId: { type: "string", maxLength: 8192, minLength: 1 },
    keyHandoverDateText: { type: "string", maxLength: 8192, minLength: 1 },
    possessionDateText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["unitId", "keyHandoverDateText", "possessionDateText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit key-handover and possession date wording without deciding legal possession. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { unitId, keyHandoverDateText, possessionDateText } = request;
  const compute = (): Output => {
    H.domain(unitId.length > 0, "unitId");
    H.domain(keyHandoverDateText.length > 0, "keyHandoverDateText");
    H.domain(possessionDateText.length > 0, "possessionDateText");
    return {
      token: JSON.stringify([unitId, keyHandoverDateText, possessionDateText]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    unitId: "U17",
    keyHandoverDateText: "2026-10-28",
    possessionDateText: "2026-11-01",
  },
  output: { token: '["U17","2026-10-28","2026-11-01"]' },
} satisfies ToolExample<Input, Output>;
export const unitKeyHandoverPossessionDateTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["real-estate", "real estate", "business and finance"],
      keywords: ["real estate", "business and finance"],
    },
    id: "real-estate/unit-key-handover-possession-date-tag",
    title: "Unit Key Handover Possession Date Tag",
    description:
      "Preserve explicit key-handover and possession date wording without deciding legal possession.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unitId: { type: "string", maxLength: 8192, minLength: 1 },
        keyHandoverDateText: { type: "string", maxLength: 8192, minLength: 1 },
        possessionDateText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["unitId", "keyHandoverDateText", "possessionDateText"],
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
          id: "unitId",
          label: "Unit Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "keyHandoverDateText",
          label: "Key Handover Date Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "possessionDateText",
          label: "Possession Date Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = unitKeyHandoverPossessionDateTagTool.execute;
export default unitKeyHandoverPossessionDateTagTool;
