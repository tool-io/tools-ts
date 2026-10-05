import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mapTitle: string;
  readonly edition: string;
  readonly dateText: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mapTitle: { type: "string", maxLength: 8192 },
    edition: { type: "string", maxLength: 8192 },
    dateText: { type: "string", maxLength: 8192 },
  },
  required: ["mapTitle", "edition", "dateText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format literal map title, edition and date fields without equating survey and publication dates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mapTitle, edition, dateText } = request;
  const compute = (): Output => {
    H.domain(
      mapTitle.length > 0 && edition.length > 0 && dateText.length > 0,
      "mapTitle",
    );
    return { label: mapTitle + " — " + edition + " (" + dateText + ")" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    mapTitle: "Town Plan",
    edition: "second edition",
    dateText: "c. 1850",
  },
  output: { label: "Town Plan — second edition (c. 1850)" },
} satisfies ToolExample<Input, Output>;
export const historicalMapEditionDateLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "history/historical-map-edition-date-label",
    title: "Historical Map Edition Date Label Tool",
    description:
      "Format literal map title, edition and date fields without equating survey and publication dates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mapTitle: { type: "string", maxLength: 8192 },
        edition: { type: "string", maxLength: 8192 },
        dateText: { type: "string", maxLength: 8192 },
      },
      required: ["mapTitle", "edition", "dateText"],
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
          id: "mapTitle",
          label: "Map Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "edition",
          label: "Edition",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "dateText",
          label: "Date Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = historicalMapEditionDateLabelTool.execute;
export default historicalMapEditionDateLabelTool;
