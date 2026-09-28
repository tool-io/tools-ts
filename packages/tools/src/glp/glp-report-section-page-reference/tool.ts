import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sectionId: string;
  readonly firstPage: number;
  readonly lastPage: number;
  readonly citedPages: readonly number[];
};
export type Output = {
  readonly outsidePages: readonly number[];
  readonly span: number;
  readonly key: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sectionId: { type: "string", maxLength: 8192 },
    firstPage: { type: "integer", minimum: 1 },
    lastPage: { type: "integer" },
    citedPages: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["sectionId", "firstPage", "lastPage", "citedPages"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outsidePages: { type: "array", maxItems: 256, items: { type: "integer" } },
    span: { type: "integer" },
    key: { type: "string", maxLength: 8192 },
  },
  required: ["outsidePages", "span", "key"],
} as const;
/** Audit supplied page references against an explicit report-section span. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sectionId, firstPage, lastPage, citedPages } = request;
  const compute = (): Output => {
    H.integer(firstPage, 1);
    H.integer(lastPage, firstPage);
    return {
      outsidePages: citedPages.filter((x) => x < firstPage || x > lastPage),
      span: lastPage - firstPage + 1,
      key: JSON.stringify([sectionId, firstPage, lastPage]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sectionId: "S1",
    firstPage: 10,
    lastPage: 20,
    citedPages: [9, 10, 15, 21],
  },
  output: { outsidePages: [9, 21], span: 11, key: '["S1",10,20]' },
} satisfies ToolExample<Input, Output>;
export const glpReportSectionPageReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "glp/glp-report-section-page-reference",
    title: "GLP Report Section Page Reference Tool",
    description:
      "Audit supplied page references against an explicit report-section span.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sectionId: { type: "string", maxLength: 8192 },
        firstPage: { type: "integer", minimum: 1 },
        lastPage: { type: "integer" },
        citedPages: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["sectionId", "firstPage", "lastPage", "citedPages"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outsidePages: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        span: { type: "integer" },
        key: { type: "string", maxLength: 8192 },
      },
      required: ["outsidePages", "span", "key"],
    },
    ports: {
      inputs: [
        {
          id: "sectionId",
          label: "Section Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "firstPage",
          label: "First Page",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lastPage",
          label: "Last Page",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "citedPages",
          label: "Cited Pages",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "outsidePages",
          label: "Outside Pages",
          valueType: { type: "list", items: { type: "integer" } },
        },
        { id: "span", label: "Span", valueType: { type: "integer" } },
        { id: "key", label: "Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = glpReportSectionPageReferenceTool.execute;
export default glpReportSectionPageReferenceTool;
