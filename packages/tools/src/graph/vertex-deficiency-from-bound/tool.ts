import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly degree: number; readonly suppliedBound: number };
export type Output = {
  readonly deficiency: number;
  readonly exceedsBound: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    degree: { type: "integer", minimum: 0 },
    suppliedBound: { type: "integer", minimum: 0 },
  },
  required: ["degree", "suppliedBound"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deficiency: { type: "integer" },
    exceedsBound: { type: "boolean" },
  },
  required: ["deficiency", "exceedsBound"],
} as const;
/** Calculate vertex deficiency from bound from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { degree, suppliedBound } = request;
  const compute = (): Output => {
    H.integer(degree, 0);
    H.integer(suppliedBound, 0);
    return {
      deficiency: suppliedBound - degree,
      exceedsBound: degree > suppliedBound,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { degree: 3, suppliedBound: 5 },
  output: { deficiency: 2, exceedsBound: false },
} satisfies ToolExample<Input, Output>;
export const vertexDeficiencyFromBoundTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/vertex-deficiency-from-bound",
    title: "Vertex Deficiency From Bound Tool",
    description:
      "Calculate vertex deficiency from bound from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        degree: { type: "integer", minimum: 0 },
        suppliedBound: { type: "integer", minimum: 0 },
      },
      required: ["degree", "suppliedBound"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deficiency: { type: "integer" },
        exceedsBound: { type: "boolean" },
      },
      required: ["deficiency", "exceedsBound"],
    },
    ports: {
      inputs: [
        {
          id: "degree",
          label: "Degree",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedBound",
          label: "Supplied Bound",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "deficiency",
          label: "Deficiency",
          valueType: { type: "integer" },
        },
        {
          id: "exceedsBound",
          label: "Exceeds Bound",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = vertexDeficiencyFromBoundTool.execute;
export default vertexDeficiencyFromBoundTool;
