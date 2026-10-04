import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly interiorLength: number;
  readonly interiorWidth: number;
  readonly excludedArea: number;
  readonly grossFootprintArea: number;
};
export type Output = { readonly growingArea: number; readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    interiorLength: { type: "number", minimum: 0 },
    interiorWidth: { type: "number", minimum: 0 },
    excludedArea: { type: "number", minimum: 0 },
    grossFootprintArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "interiorLength",
    "interiorWidth",
    "excludedArea",
    "grossFootprintArea",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { growingArea: { type: "number" }, share: { type: "number" } },
  required: ["growingArea", "share"],
} as const;
/** Calculate planter growing area share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { interiorLength, interiorWidth, excludedArea, grossFootprintArea } =
    request;
  const compute = (): Output => {
    H.positive(grossFootprintArea);
    H.domain(
      interiorLength >= 0 &&
        interiorWidth >= 0 &&
        excludedArea >= 0 &&
        excludedArea <= interiorLength * interiorWidth &&
        interiorLength * interiorWidth <= grossFootprintArea,
    );
    return {
      growingArea: interiorLength * interiorWidth - excludedArea,
      share:
        (interiorLength * interiorWidth - excludedArea) / grossFootprintArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    interiorLength: 4,
    interiorWidth: 2,
    excludedArea: 2,
    grossFootprintArea: 10,
  },
  output: { growingArea: 6, share: 0.6 },
} satisfies ToolExample<Input, Output>;
export const planterGrowingAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-agriculture/planter-growing-area-share",
    title: "Planter Growing Area Share Tool",
    description:
      "Calculate planter growing area share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        interiorLength: { type: "number", minimum: 0 },
        interiorWidth: { type: "number", minimum: 0 },
        excludedArea: { type: "number", minimum: 0 },
        grossFootprintArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "interiorLength",
        "interiorWidth",
        "excludedArea",
        "grossFootprintArea",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        growingArea: { type: "number" },
        share: { type: "number" },
      },
      required: ["growingArea", "share"],
    },
    ports: {
      inputs: [
        {
          id: "interiorLength",
          label: "Interior Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "interiorWidth",
          label: "Interior Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedArea",
          label: "Excluded Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "grossFootprintArea",
          label: "Gross Footprint Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "growingArea",
          label: "Growing Area",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = planterGrowingAreaShareTool.execute;
export default planterGrowingAreaShareTool;
