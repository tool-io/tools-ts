import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly displacement: number; readonly force: number };
export type Output = { readonly compliance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { displacement: { type: "number" }, force: { type: "number" } },
  required: ["displacement", "force"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { compliance: { type: "number" } },
  required: ["compliance"],
} as const;
/** Compute a signed bench displacement-to-force ratio without a tissue or device safety criterion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { displacement, force } = request;
  const compute = (): Output => {
    H.domain(force !== 0);
    return { compliance: displacement / force };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { displacement: 0.2, force: 10 },
  output: { compliance: 0.02 },
} satisfies ToolExample<Input, Output>;
export const fixtureDisplacementComplianceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioengineering/fixture-displacement-compliance-term",
    title: "Fixture Displacement Compliance Term Tool",
    description:
      "Compute a signed bench displacement-to-force ratio without a tissue or device safety criterion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        displacement: { type: "number" },
        force: { type: "number" },
      },
      required: ["displacement", "force"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { compliance: { type: "number" } },
      required: ["compliance"],
    },
    ports: {
      inputs: [
        {
          id: "displacement",
          label: "Displacement",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "force",
          label: "Force",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "compliance",
          label: "Compliance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fixtureDisplacementComplianceTermTool.execute;
export default fixtureDisplacementComplianceTermTool;
