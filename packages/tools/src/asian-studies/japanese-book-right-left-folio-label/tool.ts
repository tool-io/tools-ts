import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly openingNumber: number; readonly side: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingNumber: { type: "integer", minimum: 1 },
    side: { type: "string", maxLength: 8192, enum: ["right", "left"] },
  },
  required: ["openingNumber", "side"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly numbered book opening and right/left surface without assuming reading direction or equating surfaces with recto/verso. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingNumber, side } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(openingNumber) &&
        openingNumber >= 1 &&
        openingNumber <= Number.MAX_SAFE_INTEGER,
      "openingNumber",
    ),
      openingNumber);
    H.domain(["right", "left"].includes(side), "side");
    return { label: openingNumber + (side === "right" ? "右" : "左") };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingNumber: 12, side: "right" },
  output: { label: "12右" },
} satisfies ToolExample<Input, Output>;
export const japaneseBookRightLeftFolioLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "asian-studies/japanese-book-right-left-folio-label",
    title: "Japanese Book Right Left Folio Label Tool",
    description:
      "Label an explicitly numbered book opening and right/left surface without assuming reading direction or equating surfaces with recto/verso.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingNumber: { type: "integer", minimum: 1 },
        side: { type: "string", maxLength: 8192, enum: ["right", "left"] },
      },
      required: ["openingNumber", "side"],
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
          id: "openingNumber",
          label: "Opening Number",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "side",
          label: "Side",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = japaneseBookRightLeftFolioLabelTool.execute;
export default japaneseBookRightLeftFolioLabelTool;
