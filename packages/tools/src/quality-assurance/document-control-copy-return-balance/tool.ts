import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issued: number;
  readonly returned: number;
  readonly destroyed: number;
  readonly supersededOutstanding: number;
};
export type Output = {
  readonly outstanding: number;
  readonly accounted: number;
  readonly unresolved: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issued: { type: "integer", minimum: 0 },
    returned: { type: "integer", minimum: 0 },
    destroyed: { type: "integer", minimum: 0 },
    supersededOutstanding: { type: "integer", minimum: 0 },
  },
  required: ["issued", "returned", "destroyed", "supersededOutstanding"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outstanding: { type: "integer" },
    accounted: { type: "integer" },
    unresolved: { type: "integer" },
  },
  required: ["outstanding", "accounted", "unresolved"],
} as const;
/** Calculate document control copy return balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issued, returned, destroyed, supersededOutstanding } = request;
  const compute = (): Output => {
    H.integer(issued, 0);
    H.integer(returned, 0);
    H.integer(destroyed, 0);
    H.integer(supersededOutstanding, 0);
    H.domain(returned + destroyed + supersededOutstanding <= issued);
    return {
      outstanding: issued - returned - destroyed,
      accounted: returned + destroyed,
      unresolved: issued - returned - destroyed - supersededOutstanding,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    issued: 100,
    returned: 70,
    destroyed: 10,
    supersededOutstanding: 15,
  },
  output: { outstanding: 20, accounted: 80, unresolved: 5 },
} satisfies ToolExample<Input, Output>;
export const documentControlCopyReturnBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-assurance/document-control-copy-return-balance",
    title: "Document Control Copy Return Balance Tool",
    description:
      "Calculate document control copy return balance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        issued: { type: "integer", minimum: 0 },
        returned: { type: "integer", minimum: 0 },
        destroyed: { type: "integer", minimum: 0 },
        supersededOutstanding: { type: "integer", minimum: 0 },
      },
      required: ["issued", "returned", "destroyed", "supersededOutstanding"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outstanding: { type: "integer" },
        accounted: { type: "integer" },
        unresolved: { type: "integer" },
      },
      required: ["outstanding", "accounted", "unresolved"],
    },
    ports: {
      inputs: [
        {
          id: "issued",
          label: "Issued",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "returned",
          label: "Returned",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "destroyed",
          label: "Destroyed",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "supersededOutstanding",
          label: "Superseded Outstanding",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "outstanding",
          label: "Outstanding",
          valueType: { type: "integer" },
        },
        { id: "accounted", label: "Accounted", valueType: { type: "integer" } },
        {
          id: "unresolved",
          label: "Unresolved",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = documentControlCopyReturnBalanceTool.execute;
export default documentControlCopyReturnBalanceTool;
