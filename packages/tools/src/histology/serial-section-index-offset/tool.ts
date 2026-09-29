import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sectionIndex: number;
  readonly anchorIndex: number;
  readonly firstCoordinate: number;
  readonly sectionStep: number;
};
export type Output = { readonly coordinate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sectionIndex: { type: "integer" },
    anchorIndex: { type: "integer" },
    firstCoordinate: { type: "number" },
    sectionStep: { type: "number" },
  },
  required: ["sectionIndex", "anchorIndex", "firstCoordinate", "sectionStep"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { coordinate: { type: "number" } },
  required: ["coordinate"],
} as const;
/** Map supplied serial-section indices under an explicitly oriented constant step. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sectionIndex, anchorIndex, firstCoordinate, sectionStep } = request;
  const compute = (): Output => {
    H.domain(sectionStep !== 0);
    return {
      coordinate:
        firstCoordinate +
        Number(BigInt(sectionIndex) - BigInt(anchorIndex)) * sectionStep,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sectionIndex: 5,
    anchorIndex: 2,
    firstCoordinate: 10,
    sectionStep: 3,
  },
  output: { coordinate: 19 },
} satisfies ToolExample<Input, Output>;
export const serialSectionIndexOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/serial-section-index-offset",
    title: "Serial Section Index Offset Tool",
    description:
      "Map supplied serial-section indices under an explicitly oriented constant step.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sectionIndex: { type: "integer" },
        anchorIndex: { type: "integer" },
        firstCoordinate: { type: "number" },
        sectionStep: { type: "number" },
      },
      required: [
        "sectionIndex",
        "anchorIndex",
        "firstCoordinate",
        "sectionStep",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { coordinate: { type: "number" } },
      required: ["coordinate"],
    },
    ports: {
      inputs: [
        {
          id: "sectionIndex",
          label: "Section Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "anchorIndex",
          label: "Anchor Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstCoordinate",
          label: "First Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sectionStep",
          label: "Section Step",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "coordinate",
          label: "Coordinate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = serialSectionIndexOffsetTool.execute;
export default serialSectionIndexOffsetTool;
