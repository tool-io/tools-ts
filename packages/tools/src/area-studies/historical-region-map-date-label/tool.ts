import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly regionName: string;
  readonly mapTitle: string;
  readonly dateText: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    regionName: { type: "string", maxLength: 8192, minLength: 1 },
    mapTitle: { type: "string", maxLength: 8192, minLength: 1 },
    dateText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["regionName", "mapTitle", "dateText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Attach a literal map title and date context to a historical region name without asserting present boundaries. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { regionName, mapTitle, dateText } = request;
  const compute = (): Output => {
    H.domain(
      regionName.length > 0 && mapTitle.length > 0 && dateText.length > 0,
      "regionName",
    );
    return { label: regionName + " [" + mapTitle + "; " + dateText + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    regionName: "Region A",
    mapTitle: "Map edition 2",
    dateText: "c. 1850",
  },
  output: { label: "Region A [Map edition 2; c. 1850]" },
} satisfies ToolExample<Input, Output>;
export const historicalRegionMapDateLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["area-studies", "area studies", "humanities"],
      keywords: ["area studies", "humanities"],
    },
    id: "area-studies/historical-region-map-date-label",
    title: "Historical Region Map Date Label",
    description:
      "Attach a literal map title and date context to a historical region name without asserting present boundaries.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        regionName: { type: "string", maxLength: 8192, minLength: 1 },
        mapTitle: { type: "string", maxLength: 8192, minLength: 1 },
        dateText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["regionName", "mapTitle", "dateText"],
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
          id: "regionName",
          label: "Region Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "mapTitle",
          label: "Map Title",
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
export const run = historicalRegionMapDateLabelTool.execute;
export default historicalRegionMapDateLabelTool;
