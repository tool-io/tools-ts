import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tabWidth: number;
  readonly openingWidth: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tabWidth: { type: "number" },
    openingWidth: { type: "number" },
  },
  required: ["tabWidth", "openingWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract a supplied packaging tab width from its clear opening width in matching units without fabrication tolerances or fit certification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tabWidth, openingWidth } = request;
  const compute = (): Output => {
    return { signedGap: openingWidth - tabWidth };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tabWidth: 12, openingWidth: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const packagingDielineTabClearanceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/packaging-dieline-tab-clearance-term",
    title: "Packaging Dieline Tab Clearance Term Tool",
    description:
      "Subtract a supplied packaging tab width from its clear opening width in matching units without fabrication tolerances or fit certification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tabWidth: { type: "number" },
        openingWidth: { type: "number" },
      },
      required: ["tabWidth", "openingWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "tabWidth",
          label: "Tab Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "openingWidth",
          label: "Opening Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = packagingDielineTabClearanceTermTool.execute;
export default packagingDielineTabClearanceTermTool;
