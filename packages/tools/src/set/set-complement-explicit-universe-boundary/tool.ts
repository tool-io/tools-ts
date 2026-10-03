import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly inUniverse: boolean; readonly inSet: boolean };
export type Output = { readonly complement: boolean; readonly valid: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inUniverse: { type: "boolean" }, inSet: { type: "boolean" } },
  required: ["inUniverse", "inSet"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { complement: { type: "boolean" }, valid: { type: "boolean" } },
  required: ["complement", "valid"],
} as const;
/** Calculate set complement explicit universe boundary from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inUniverse, inSet } = request;
  const compute = (): Output => {
    return { complement: inUniverse && !inSet, valid: inUniverse || !inSet };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inUniverse: false, inSet: true },
  output: { complement: false, valid: false },
} satisfies ToolExample<Input, Output>;
export const setComplementExplicitUniverseBoundaryTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "set/set-complement-explicit-universe-boundary",
      title: "Set Complement Explicit Universe Boundary Tool",
      description:
        "Calculate set complement explicit universe boundary from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inUniverse: { type: "boolean" },
          inSet: { type: "boolean" },
        },
        required: ["inUniverse", "inSet"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          complement: { type: "boolean" },
          valid: { type: "boolean" },
        },
        required: ["complement", "valid"],
      },
      ports: {
        inputs: [
          {
            id: "inUniverse",
            label: "In Universe",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "inSet",
            label: "In Set",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "complement",
            label: "Complement",
            valueType: { type: "boolean" },
          },
          { id: "valid", label: "Valid", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = setComplementExplicitUniverseBoundaryTool.execute;
export default setComplementExplicitUniverseBoundaryTool;
