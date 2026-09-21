import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly section: number;
  readonly sectionsPerRow: number;
  readonly rows: number;
  readonly serpentine: boolean;
  readonly firstRowEastToWest: boolean;
};
export type Output = { readonly row: number; readonly column: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    section: { type: "integer", minimum: 1 },
    sectionsPerRow: { type: "integer", minimum: 1 },
    rows: { type: "integer", minimum: 1 },
    serpentine: { type: "boolean" },
    firstRowEastToWest: { type: "boolean" },
  },
  required: [
    "section",
    "sectionsPerRow",
    "rows",
    "serpentine",
    "firstRowEastToWest",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { row: { type: "integer" }, column: { type: "integer" } },
  required: ["row", "column"],
} as const;
/** Locate a supplied public section in an explicit serpentine grid, without inferring a legal land description. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { section, sectionsPerRow, rows, serpentine, firstRowEastToWest } =
    request;
  const compute = (): Output => {
    H.integer(section, 1);
    H.integer(sectionsPerRow, 1);
    H.integer(rows, 1);
    return (() => {
      H.domain(BigInt(section) <= BigInt(rows) * BigInt(sectionsPerRow));
      const row = Math.floor((section - 1) / sectionsPerRow),
        offset = (section - 1) % sectionsPerRow,
        reverse = firstRowEastToWest !== (serpentine && row % 2 === 1);
      return { row, column: reverse ? sectionsPerRow - 1 - offset : offset };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    section: 7,
    sectionsPerRow: 6,
    rows: 6,
    serpentine: true,
    firstRowEastToWest: true,
  },
  output: { row: 1, column: 0 },
} satisfies ToolExample<Input, Output>;
export const publicTownshipSectionIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "american-studies/public-township-section-index",
    title: "Public Township Section Index Tool",
    description:
      "Locate a supplied public section in an explicit serpentine grid, without inferring a legal land description.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        section: { type: "integer", minimum: 1 },
        sectionsPerRow: { type: "integer", minimum: 1 },
        rows: { type: "integer", minimum: 1 },
        serpentine: { type: "boolean" },
        firstRowEastToWest: { type: "boolean" },
      },
      required: [
        "section",
        "sectionsPerRow",
        "rows",
        "serpentine",
        "firstRowEastToWest",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { row: { type: "integer" }, column: { type: "integer" } },
      required: ["row", "column"],
    },
    ports: {
      inputs: [
        {
          id: "section",
          label: "Section",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sectionsPerRow",
          label: "Sections Per Row",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rows",
          label: "Rows",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "serpentine",
          label: "Serpentine",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "firstRowEastToWest",
          label: "First Row East To West",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "row", label: "Row", valueType: { type: "integer" } },
        { id: "column", label: "Column", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = publicTownshipSectionIndexTool.execute;
export default publicTownshipSectionIndexTool;
