import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossFloorArea: number;
  readonly exemptArea: number;
  readonly lotArea: number;
};
export type Output = { readonly countedArea: number; readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossFloorArea: { type: "number" },
    exemptArea: { type: "number", minimum: 0 },
    lotArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["grossFloorArea", "exemptArea", "lotArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { countedArea: { type: "number" }, ratio: { type: "number" } },
  required: ["countedArea", "ratio"],
} as const;
/** Calculate floor area ratio exempt floor term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossFloorArea, exemptArea, lotArea } = request;
  const compute = (): Output => {
    H.positive(lotArea);
    H.domain(exemptArea >= 0 && grossFloorArea >= exemptArea);
    return {
      countedArea: grossFloorArea - exemptArea,
      ratio: (grossFloorArea - exemptArea) / lotArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossFloorArea: 1200, exemptArea: 200, lotArea: 500 },
  output: { countedArea: 1000, ratio: 2 },
} satisfies ToolExample<Input, Output>;
export const floorAreaRatioExemptFloorTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/floor-area-ratio-exempt-floor-term",
    title: "Floor Area Ratio Exempt Floor Term Tool",
    description:
      "Calculate floor area ratio exempt floor term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossFloorArea: { type: "number" },
        exemptArea: { type: "number", minimum: 0 },
        lotArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["grossFloorArea", "exemptArea", "lotArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countedArea: { type: "number" },
        ratio: { type: "number" },
      },
      required: ["countedArea", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "grossFloorArea",
          label: "Gross Floor Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exemptArea",
          label: "Exempt Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lotArea",
          label: "Lot Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "countedArea",
          label: "Counted Area",
          valueType: { type: "number" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = floorAreaRatioExemptFloorTermTool.execute;
export default floorAreaRatioExemptFloorTermTool;
