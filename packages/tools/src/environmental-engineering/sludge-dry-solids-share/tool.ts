import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly dryMass: number; readonly wetMass: number };
export type Output = { readonly share: number; readonly waterMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryMass: { type: "number", minimum: 0 },
    wetMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["dryMass", "wetMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, waterMass: { type: "number" } },
  required: ["share", "waterMass"],
} as const;
/** Calculate sludge dry solids share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dryMass, wetMass } = request;
  const compute = (): Output => {
    H.positive(wetMass);
    H.domain(dryMass >= 0 && dryMass <= wetMass);
    return { share: dryMass / wetMass, waterMass: wetMass - dryMass };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dryMass: 2, wetMass: 10 },
  output: { share: 0.2, waterMass: 8 },
} satisfies ToolExample<Input, Output>;
export const sludgeDrySolidsShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-engineering/sludge-dry-solids-share",
    title: "Sludge Dry Solids Share Tool",
    description:
      "Calculate sludge dry solids share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryMass: { type: "number", minimum: 0 },
        wetMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["dryMass", "wetMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" }, waterMass: { type: "number" } },
      required: ["share", "waterMass"],
    },
    ports: {
      inputs: [
        {
          id: "dryMass",
          label: "Dry Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wetMass",
          label: "Wet Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "waterMass", label: "Water Mass", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sludgeDrySolidsShareTool.execute;
export default sludgeDrySolidsShareTool;
