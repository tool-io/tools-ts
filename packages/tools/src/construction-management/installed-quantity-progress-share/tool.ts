import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly installed: number; readonly planned: number };
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    installed: { type: "number", minimum: 0 },
    planned: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["installed", "planned"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate installed quantity progress share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { installed, planned } = request;
  const compute = (): Output => {
    H.domain(installed >= 0);
    H.positive(planned);
    return { share: installed / planned };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { installed: 80, planned: 100 },
  output: { share: 0.8 },
} satisfies ToolExample<Input, Output>;
export const installedQuantityProgressShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "construction-management/installed-quantity-progress-share",
    title: "Installed Quantity Progress Share Tool",
    description:
      "Calculate installed quantity progress share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        installed: { type: "number", minimum: 0 },
        planned: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["installed", "planned"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" } },
      required: ["share"],
    },
    ports: {
      inputs: [
        {
          id: "installed",
          label: "Installed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "planned",
          label: "Planned",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = installedQuantityProgressShareTool.execute;
export default installedQuantityProgressShareTool;
