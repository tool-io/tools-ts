import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemId: string;
  readonly manuscriptDateText: string;
  readonly postmarkDateText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemId: { type: "string", maxLength: 8192, minLength: 1 },
    manuscriptDateText: { type: "string", maxLength: 8192, minLength: 1 },
    postmarkDateText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["itemId", "manuscriptDateText", "postmarkDateText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Pair explicitly supplied manuscript and postmark date transcriptions without resolving historical calendars or missing dates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemId, manuscriptDateText, postmarkDateText } = request;
  const compute = (): Output => {
    H.domain(itemId.length > 0, "itemId");
    H.domain(manuscriptDateText.length > 0, "manuscriptDateText");
    H.domain(postmarkDateText.length > 0, "postmarkDateText");
    return {
      token: JSON.stringify([itemId, manuscriptDateText, postmarkDateText]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    itemId: "MS17",
    manuscriptDateText: "12 May 1820",
    postmarkDateText: "14 May 1820",
  },
  output: { token: '["MS17","12 May 1820","14 May 1820"]' },
} satisfies ToolExample<Input, Output>;
export const manuscriptDatedVersusPostmarkedPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["history", "humanities"],
        keywords: ["history", "humanities"],
      },
      id: "history/manuscript-dated-versus-postmarked-pair",
      title: "Manuscript Dated Versus Postmarked Pair",
      description:
        "Pair explicitly supplied manuscript and postmark date transcriptions without resolving historical calendars or missing dates.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          itemId: { type: "string", maxLength: 8192, minLength: 1 },
          manuscriptDateText: { type: "string", maxLength: 8192, minLength: 1 },
          postmarkDateText: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["itemId", "manuscriptDateText", "postmarkDateText"],
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
            id: "itemId",
            label: "Item Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "manuscriptDateText",
            label: "Manuscript Date Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "postmarkDateText",
            label: "Postmark Date Text",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = manuscriptDatedVersusPostmarkedPairTool.execute;
export default manuscriptDatedVersusPostmarkedPairTool;
