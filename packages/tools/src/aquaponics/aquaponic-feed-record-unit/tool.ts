import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly feedQuantityText: string;
  readonly unitText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    feedQuantityText: { type: "string", maxLength: 8192, minLength: 1 },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "feedQuantityText", "unitText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit feed-record quantity and unit text without recommending feed amounts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, feedQuantityText, unitText } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(feedQuantityText.length > 0, "feedQuantityText");
    H.domain(unitText.length > 0, "unitText");
    return { token: JSON.stringify([recordId, feedQuantityText, unitText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "F17", feedQuantityText: "250", unitText: "g" },
  output: { token: '["F17","250","g"]' },
} satisfies ToolExample<Input, Output>;
export const aquaponicFeedRecordUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["aquaponics", "agriculture"],
      keywords: ["aquaponics", "agriculture"],
    },
    id: "aquaponics/aquaponic-feed-record-unit",
    title: "Aquaponic Feed Record Unit",
    description:
      "Preserve explicit feed-record quantity and unit text without recommending feed amounts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        feedQuantityText: { type: "string", maxLength: 8192, minLength: 1 },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "feedQuantityText", "unitText"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "feedQuantityText",
          label: "Feed Quantity Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "unitText",
          label: "Unit Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = aquaponicFeedRecordUnitTool.execute;
export default aquaponicFeedRecordUnitTool;
