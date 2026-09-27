import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly panels: number;
  readonly radialLength: number;
  readonly seamAllowance: number;
};
export type Output = { readonly totalAddedArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    panels: { type: "integer", minimum: 1 },
    radialLength: { type: "number", minimum: 0 },
    seamAllowance: { type: "number", minimum: 0 },
  },
  required: ["panels", "radialLength", "seamAllowance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { totalAddedArea: { type: "number" } },
  required: ["totalAddedArea"],
} as const;
/** Sum straight rectangular allowances along both radial sides of each panel; corner and curved-edge allowances are excluded. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { panels, radialLength, seamAllowance } = request;
  const compute = (): Output => {
    H.integer(panels, 1);
    H.domain(radialLength >= 0 && seamAllowance >= 0);
    return { totalAddedArea: 2 * panels * radialLength * seamAllowance };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { panels: 4, radialLength: 50, seamAllowance: 1 },
  output: { totalAddedArea: 400 },
} satisfies ToolExample<Input, Output>;
export const skirtCirclePanelSeamAllowanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/skirt-circle-panel-seam-allowance",
    title: "Skirt Circle Panel Seam Allowance Tool",
    description:
      "Sum straight rectangular allowances along both radial sides of each panel; corner and curved-edge allowances are excluded.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        panels: { type: "integer", minimum: 1 },
        radialLength: { type: "number", minimum: 0 },
        seamAllowance: { type: "number", minimum: 0 },
      },
      required: ["panels", "radialLength", "seamAllowance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { totalAddedArea: { type: "number" } },
      required: ["totalAddedArea"],
    },
    ports: {
      inputs: [
        {
          id: "panels",
          label: "Panels",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "radialLength",
          label: "Radial Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "seamAllowance",
          label: "Seam Allowance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalAddedArea",
          label: "Total Added Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = skirtCirclePanelSeamAllowanceTool.execute;
export default skirtCirclePanelSeamAllowanceTool;
