import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly name: string };
export type Output = {
  readonly genus: string;
  readonly qualifier: string;
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
    genus: { type: "string", maxLength: 8192 },
    qualifier: { type: "string", maxLength: 8192 },
    epithet: { type: "string", maxLength: 8192 },
  },
  required: ["genus", "qualifier", "epithet"],
} as const;
/** Separate an explicit cf./aff. qualifier without inferring species identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { name } = request;
  const compute = (): Output => {
    const match = /^([A-Z][a-z]+) (cf\.|aff\.) ([a-z][a-z-]+)(?![\s\S])/.exec(
      name,
    );
    H.domain(match, "name");
    return { genus: match[1], qualifier: match[2], epithet: match[3] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { name: "Aus cf. bus" },
  output: { genus: "Aus", qualifier: "cf.", epithet: "bus" },
} satisfies ToolExample<Input, Output>;
export const taxonomicNameQualifierCfAffTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosystematics/taxonomic-name-qualifier-cf-aff-token",
    title: "Taxonomic Name Qualifier Cf Aff Token Tool",
    description:
      "Separate an explicit cf./aff. qualifier without inferring species identity.",
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
        genus: { type: "string", maxLength: 8192 },
        qualifier: { type: "string", maxLength: 8192 },
        epithet: { type: "string", maxLength: 8192 },
      },
      required: ["genus", "qualifier", "epithet"],
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
        { id: "genus", label: "Genus", valueType: { type: "string" } },
        { id: "qualifier", label: "Qualifier", valueType: { type: "string" } },
        { id: "epithet", label: "Epithet", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = taxonomicNameQualifierCfAffTokenTool.execute;
export default taxonomicNameQualifierCfAffTokenTool;
