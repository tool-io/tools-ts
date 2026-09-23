import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly leafArea: number; readonly hullArea: number };
export type Output = { readonly solidity: number; readonly deficit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leafArea: { type: "number", minimum: 0 },
    hullArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["leafArea", "hullArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { solidity: { type: "number" }, deficit: { type: "number" } },
  required: ["solidity", "deficit"],
} as const;
/** Calculate leaf outline solidity from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leafArea, hullArea } = request;
  const compute = (): Output => {
    H.positive(hullArea);
    H.domain(leafArea >= 0 && leafArea <= hullArea);
    return { solidity: leafArea / hullArea, deficit: hullArea - leafArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leafArea: 8, hullArea: 10 },
  output: { solidity: 0.8, deficit: 2 },
} satisfies ToolExample<Input, Output>;
export const leafOutlineSolidityTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "botany/leaf-outline-solidity",
      title: "Leaf Outline Solidity Tool",
      description:
        "Calculate leaf outline solidity from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          leafArea: { type: "number", minimum: 0 },
          hullArea: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["leafArea", "hullArea"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          solidity: { type: "number" },
          deficit: { type: "number" },
        },
        required: ["solidity", "deficit"],
      },
      ports: {
        inputs: [
          {
            id: "leafArea",
            label: "Leaf Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "hullArea",
            label: "Hull Area",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "solidity", label: "Solidity", valueType: { type: "number" } },
          { id: "deficit", label: "Deficit", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  },
);
export const run = leafOutlineSolidityTool.execute;
export default leafOutlineSolidityTool;
