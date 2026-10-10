import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDateText: string;
  readonly secondDateText: string;
  readonly showFirstDateFirst: boolean;
};
export type Output = { readonly displayText: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDateText: { type: "string", maxLength: 8192, minLength: 1 },
    secondDateText: { type: "string", maxLength: 8192, minLength: 1 },
    showFirstDateFirst: { type: "boolean" },
  },
  required: ["firstDateText", "secondDateText", "showFirstDateFirst"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { displayText: { type: "string", maxLength: 8192 } },
  required: ["displayText"],
} as const;
/** Order two explicitly supplied date transcriptions without asserting calendar equivalence or converting dates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDateText, secondDateText, showFirstDateFirst } = request;
  const compute = (): Output => {
    H.domain(
      firstDateText.length > 0 && secondDateText.length > 0,
      "firstDateText",
    );
    return {
      displayText: showFirstDateFirst
        ? firstDateText + " / " + secondDateText
        : secondDateText + " / " + firstDateText,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstDateText: "Date A",
    secondDateText: "Date B",
    showFirstDateFirst: true,
  },
  output: { displayText: "Date A / Date B" },
} satisfies ToolExample<Input, Output>;
export const middleEasternDualDateSourceOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "middle-eastern-studies",
        "middle eastern studies",
        "humanities",
      ],
      keywords: ["middle eastern studies", "humanities"],
    },
    id: "middle-eastern-studies/middle-eastern-dual-date-source-order",
    title: "Middle Eastern Dual Date Source Order",
    description:
      "Order two explicitly supplied date transcriptions without asserting calendar equivalence or converting dates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDateText: { type: "string", maxLength: 8192, minLength: 1 },
        secondDateText: { type: "string", maxLength: 8192, minLength: 1 },
        showFirstDateFirst: { type: "boolean" },
      },
      required: ["firstDateText", "secondDateText", "showFirstDateFirst"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { displayText: { type: "string", maxLength: 8192 } },
      required: ["displayText"],
    },
    ports: {
      inputs: [
        {
          id: "firstDateText",
          label: "First Date Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondDateText",
          label: "Second Date Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "showFirstDateFirst",
          label: "Show First Date First",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "displayText",
          label: "Display Text",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = middleEasternDualDateSourceOrderTool.execute;
export default middleEasternDualDateSourceOrderTool;
