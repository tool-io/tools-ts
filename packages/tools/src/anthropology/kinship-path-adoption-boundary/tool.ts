import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly links: readonly string[];
  readonly adoptiveTokens: readonly string[];
};
export type Output = {
  readonly crossesAdoption: boolean;
  readonly firstBoundary: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    links: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    adoptiveTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["links", "adoptiveTokens"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    crossesAdoption: { type: "boolean" },
    firstBoundary: { type: "integer" },
  },
  required: ["crossesAdoption", "firstBoundary"],
} as const;
/** Find the first caller-defined adoptive link in a supplied kinship path without inferring legal or cultural kinship. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { links, adoptiveTokens } = request;
  const compute = (): Output => {
    const firstBoundary = links.findIndex((x) => adoptiveTokens.includes(x));
    return { crossesAdoption: firstBoundary >= 0, firstBoundary };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    links: ["parent", "adoptive-parent", "sibling"],
    adoptiveTokens: ["adoptive-parent"],
  },
  output: { crossesAdoption: true, firstBoundary: 1 },
} satisfies ToolExample<Input, Output>;
export const kinshipPathAdoptionBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anthropology/kinship-path-adoption-boundary",
    title: "Kinship Path Adoption Boundary Tool",
    description:
      "Find the first caller-defined adoptive link in a supplied kinship path without inferring legal or cultural kinship.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        links: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        adoptiveTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["links", "adoptiveTokens"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        crossesAdoption: { type: "boolean" },
        firstBoundary: { type: "integer" },
      },
      required: ["crossesAdoption", "firstBoundary"],
    },
    ports: {
      inputs: [
        {
          id: "links",
          label: "Links",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "adoptiveTokens",
          label: "Adoptive Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "crossesAdoption",
          label: "Crosses Adoption",
          valueType: { type: "boolean" },
        },
        {
          id: "firstBoundary",
          label: "First Boundary",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = kinshipPathAdoptionBoundaryTool.execute;
export default kinshipPathAdoptionBoundaryTool;
