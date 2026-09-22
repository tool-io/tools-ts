import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly leafWidth: number; readonly gapHeight: number };
export type Output = { readonly area: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leafWidth: { type: "number", minimum: 0 },
    gapHeight: { type: "number", minimum: 0 },
  },
  required: ["leafWidth", "gapHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { area: { type: "number" } },
  required: ["area"],
} as const;
/** Calculate door leaf undercut area term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leafWidth, gapHeight } = request;
  const compute = (): Output => {
    H.domain(leafWidth >= 0 && gapHeight >= 0);
    return { area: leafWidth * gapHeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leafWidth: 0.9, gapHeight: 0.02 },
  output: { area: 0.018000000000000002 },
} satisfies ToolExample<Input, Output>;
export const doorLeafUndercutAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/door-leaf-undercut-area-term",
    title: "Door Leaf Undercut Area Term Tool",
    description:
      "Calculate door leaf undercut area term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leafWidth: { type: "number", minimum: 0 },
        gapHeight: { type: "number", minimum: 0 },
      },
      required: ["leafWidth", "gapHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { area: { type: "number" } },
      required: ["area"],
    },
    ports: {
      inputs: [
        {
          id: "leafWidth",
          label: "Leaf Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gapHeight",
          label: "Gap Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "area", label: "Area", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = doorLeafUndercutAreaTermTool.execute;
export default doorLeafUndercutAreaTermTool;
