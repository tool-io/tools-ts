import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentration: number;
  readonly flow: number;
  readonly referenceLoad: number;
};
export type Output = { readonly load: number; readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentration: { type: "number", minimum: 0 },
    flow: { type: "number", minimum: 0 },
    referenceLoad: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["concentration", "flow", "referenceLoad"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { load: { type: "number" }, ratio: { type: "number" } },
  required: ["load", "ratio"],
} as const;
/** Calculate effluent load reference ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentration, flow, referenceLoad } = request;
  const compute = (): Output => {
    H.domain(concentration >= 0 && flow >= 0);
    H.positive(referenceLoad);
    return {
      load: concentration * flow,
      ratio: (concentration * flow) / referenceLoad,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { concentration: 2, flow: 3, referenceLoad: 12 },
  output: { load: 6, ratio: 0.5 },
} satisfies ToolExample<Input, Output>;
export const effluentLoadReferenceRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-engineering/effluent-load-reference-ratio",
    title: "Effluent Load Reference Ratio Tool",
    description:
      "Calculate effluent load reference ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concentration: { type: "number", minimum: 0 },
        flow: { type: "number", minimum: 0 },
        referenceLoad: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["concentration", "flow", "referenceLoad"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { load: { type: "number" }, ratio: { type: "number" } },
      required: ["load", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "concentration",
          label: "Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "flow",
          label: "Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceLoad",
          label: "Reference Load",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "load", label: "Load", valueType: { type: "number" } },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = effluentLoadReferenceRatioTool.execute;
export default effluentLoadReferenceRatioTool;
