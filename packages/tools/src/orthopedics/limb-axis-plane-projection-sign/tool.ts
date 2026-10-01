import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly axisComponent: number;
  readonly suppliedProjectionCosine: number;
  readonly reversePlaneNormal: boolean;
};
export type Output = { readonly projectedComponent: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    axisComponent: { type: "number" },
    suppliedProjectionCosine: { type: "number", minimum: -1, maximum: 1 },
    reversePlaneNormal: { type: "boolean" },
  },
  required: ["axisComponent", "suppliedProjectionCosine", "reversePlaneNormal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { projectedComponent: { type: "number" } },
  required: ["projectedComponent"],
} as const;
/** Project a supplied bench axis component with explicit sign conventions; no limb alignment diagnosis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { axisComponent, suppliedProjectionCosine, reversePlaneNormal } =
    request;
  const compute = (): Output => {
    H.domain(suppliedProjectionCosine >= -1 && suppliedProjectionCosine <= 1);
    return {
      projectedComponent:
        axisComponent *
        suppliedProjectionCosine *
        (reversePlaneNormal ? -1 : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    axisComponent: 10,
    suppliedProjectionCosine: 0.5,
    reversePlaneNormal: true,
  },
  output: { projectedComponent: -5 },
} satisfies ToolExample<Input, Output>;
export const limbAxisPlaneProjectionSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthopedics/limb-axis-plane-projection-sign",
    title: "Limb Axis Plane Projection Sign Tool",
    description:
      "Project a supplied bench axis component with explicit sign conventions; no limb alignment diagnosis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        axisComponent: { type: "number" },
        suppliedProjectionCosine: { type: "number", minimum: -1, maximum: 1 },
        reversePlaneNormal: { type: "boolean" },
      },
      required: [
        "axisComponent",
        "suppliedProjectionCosine",
        "reversePlaneNormal",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { projectedComponent: { type: "number" } },
      required: ["projectedComponent"],
    },
    ports: {
      inputs: [
        {
          id: "axisComponent",
          label: "Axis Component",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedProjectionCosine",
          label: "Supplied Projection Cosine",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reversePlaneNormal",
          label: "Reverse Plane Normal",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "projectedComponent",
          label: "Projected Component",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = limbAxisPlaneProjectionSignTool.execute;
export default limbAxisPlaneProjectionSignTool;
