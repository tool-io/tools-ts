import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly name: string };
export type Output = {
  readonly binomial: string;
  readonly marker: string;
  readonly epithet: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { name: { type: "string", maxLength: 8192 } },
  required: ["name"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    binomial: { type: "string", maxLength: 8192 },
    marker: { type: "string", maxLength: 8192 },
    epithet: { type: "string", maxLength: 8192 },
  },
  required: ["binomial", "marker", "epithet"],
} as const;
/** Parse a documented ASCII infraspecific-name subset without validating publication or rank. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { name } = request;
  const compute = (): Output => {
    const match =
      /^([A-Z][a-z]+ [a-z][a-z-]+) (subsp\.|var\.|f\.) ([a-z][a-z-]+)(?![\s\S])/.exec(
        name,
      );
    H.domain(match, "name");
    return { binomial: match[1], marker: match[2], epithet: match[3] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { name: "Aus bus subsp. cus" },
  output: { binomial: "Aus bus", marker: "subsp.", epithet: "cus" },
} satisfies ToolExample<Input, Output>;
export const taxonInfraspecificEpithetMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosystematics/taxon-infraspecific-epithet-marker",
    title: "Taxon Infraspecific Epithet Marker Tool",
    description:
      "Parse a documented ASCII infraspecific-name subset without validating publication or rank.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { name: { type: "string", maxLength: 8192 } },
      required: ["name"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        binomial: { type: "string", maxLength: 8192 },
        marker: { type: "string", maxLength: 8192 },
        epithet: { type: "string", maxLength: 8192 },
      },
      required: ["binomial", "marker", "epithet"],
    },
    ports: {
      inputs: [
        {
          id: "name",
          label: "Name",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "binomial", label: "Binomial", valueType: { type: "string" } },
        { id: "marker", label: "Marker", valueType: { type: "string" } },
        { id: "epithet", label: "Epithet", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = taxonInfraspecificEpithetMarkerTool.execute;
export default taxonInfraspecificEpithetMarkerTool;
