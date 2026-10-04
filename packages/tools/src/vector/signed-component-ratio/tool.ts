import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly component: number;
  readonly referenceComponent: number;
};
export type Output = { readonly ratio: number; readonly sameSign: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    component: { type: "number" },
    referenceComponent: { type: "number" },
  },
  required: ["component", "referenceComponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" }, sameSign: { type: "boolean" } },
  required: ["ratio", "sameSign"],
} as const;
/** Calculate signed component ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { component, referenceComponent } = request;
  const compute = (): Output => {
    H.domain(referenceComponent !== 0);
    return {
      ratio: component / referenceComponent,
      sameSign:
        component !== 0 &&
        Math.sign(component) === Math.sign(referenceComponent),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { component: -6, referenceComponent: 3 },
  output: { ratio: -2, sameSign: false },
} satisfies ToolExample<Input, Output>;
export const signedComponentRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/signed-component-ratio",
    title: "Signed Component Ratio Tool",
    description:
      "Calculate signed component ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        component: { type: "number" },
        referenceComponent: { type: "number" },
      },
      required: ["component", "referenceComponent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" }, sameSign: { type: "boolean" } },
      required: ["ratio", "sameSign"],
    },
    ports: {
      inputs: [
        {
          id: "component",
          label: "Component",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceComponent",
          label: "Reference Component",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        { id: "sameSign", label: "Same Sign", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = signedComponentRatioTool.execute;
export default signedComponentRatioTool;
