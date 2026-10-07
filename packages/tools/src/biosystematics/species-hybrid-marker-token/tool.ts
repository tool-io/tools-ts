import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstParentText: string;
  readonly secondParentText: string;
};
export type Output = { readonly hybridFormula: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstParentText: { type: "string", maxLength: 8192, minLength: 1 },
    secondParentText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["firstParentText", "secondParentText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { hybridFormula: { type: "string", maxLength: 8192 } },
  required: ["hybridFormula"],
} as const;
/** Join explicit parent taxon strings with the multiplication-sign hybrid marker without asserting hybrid origin or naming validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstParentText, secondParentText } = request;
  const compute = (): Output => {
    H.domain(
      firstParentText.length > 0 && secondParentText.length > 0,
      "firstParentText",
    );
    return { hybridFormula: firstParentText + " × " + secondParentText };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstParentText: "Taxon A", secondParentText: "Taxon B" },
  output: { hybridFormula: "Taxon A × Taxon B" },
} satisfies ToolExample<Input, Output>;
export const speciesHybridMarkerTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biosystematics", "biology"],
      keywords: ["biosystematics", "biology"],
    },
    id: "biosystematics/species-hybrid-marker-token",
    title: "Species Hybrid Marker Token",
    description:
      "Join explicit parent taxon strings with the multiplication-sign hybrid marker without asserting hybrid origin or naming validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstParentText: { type: "string", maxLength: 8192, minLength: 1 },
        secondParentText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["firstParentText", "secondParentText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { hybridFormula: { type: "string", maxLength: 8192 } },
      required: ["hybridFormula"],
    },
    ports: {
      inputs: [
        {
          id: "firstParentText",
          label: "First Parent Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondParentText",
          label: "Second Parent Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "hybridFormula",
          label: "Hybrid Formula",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = speciesHybridMarkerTokenTool.execute;
export default speciesHybridMarkerTokenTool;
