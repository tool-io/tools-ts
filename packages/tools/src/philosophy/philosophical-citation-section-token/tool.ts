import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly workTitle: string; readonly section: string };
export type Output = { readonly citation: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workTitle: { type: "string", maxLength: 8192 },
    section: { type: "string", maxLength: 8192 },
  },
  required: ["workTitle", "section"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { citation: { type: "string", maxLength: 8192 } },
  required: ["citation"],
} as const;
/** Format an explicit work title and section locator with a section sign. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { workTitle, section } = request;
  const compute = (): Output => {
    H.domain(workTitle.length > 0 && section.length > 0, "workTitle");
    return { citation: workTitle + ", §" + section };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { workTitle: "Treatise", section: "12.3" },
  output: { citation: "Treatise, §12.3" },
} satisfies ToolExample<Input, Output>;
export const philosophicalCitationSectionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "philosophy/philosophical-citation-section-token",
    title: "Philosophical Citation Section Token Tool",
    description:
      "Format an explicit work title and section locator with a section sign.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        workTitle: { type: "string", maxLength: 8192 },
        section: { type: "string", maxLength: 8192 },
      },
      required: ["workTitle", "section"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { citation: { type: "string", maxLength: 8192 } },
      required: ["citation"],
    },
    ports: {
      inputs: [
        {
          id: "workTitle",
          label: "Work Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "section",
          label: "Section",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "citation", label: "Citation", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = philosophicalCitationSectionTokenTool.execute;
export default philosophicalCitationSectionTokenTool;
