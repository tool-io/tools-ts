import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly onEdge: boolean;
  readonly insideQuadrat: boolean;
  readonly suppliedIncludeEdge: boolean;
};
export type Output = { readonly included: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    onEdge: { type: "boolean" },
    insideQuadrat: { type: "boolean" },
    suppliedIncludeEdge: { type: "boolean" },
  },
  required: ["onEdge", "insideQuadrat", "suppliedIncludeEdge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { included: { type: "boolean" } },
  required: ["included"],
} as const;
/** Apply an explicit quadrat edge-inclusion policy to supplied location flags without detecting organisms or selecting survey protocol. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { onEdge, insideQuadrat, suppliedIncludeEdge } = request;
  const compute = (): Output => {
    return { included: onEdge ? suppliedIncludeEdge : insideQuadrat };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { onEdge: true, insideQuadrat: false, suppliedIncludeEdge: true },
  output: { included: true },
} satisfies ToolExample<Input, Output>;
export const quadratEdgeIndividualInclusionRuleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ecology/quadrat-edge-individual-inclusion-rule",
    title: "Quadrat Edge Individual Inclusion Rule Tool",
    description:
      "Apply an explicit quadrat edge-inclusion policy to supplied location flags without detecting organisms or selecting survey protocol.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        onEdge: { type: "boolean" },
        insideQuadrat: { type: "boolean" },
        suppliedIncludeEdge: { type: "boolean" },
      },
      required: ["onEdge", "insideQuadrat", "suppliedIncludeEdge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { included: { type: "boolean" } },
      required: ["included"],
    },
    ports: {
      inputs: [
        {
          id: "onEdge",
          label: "On Edge",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "insideQuadrat",
          label: "Inside Quadrat",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppliedIncludeEdge",
          label: "Supplied Include Edge",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "included", label: "Included", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = quadratEdgeIndividualInclusionRuleTool.execute;
export default quadratEdgeIndividualInclusionRuleTool;
