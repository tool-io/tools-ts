import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wallArea: number;
  readonly openings: readonly number[];
  readonly excludedArea: number;
};
export type Output = { readonly netArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wallArea: { type: "number", minimum: 0 },
    openings: { type: "array", maxItems: 256, items: { type: "number" } },
    excludedArea: { type: "number", minimum: 0 },
  },
  required: ["wallArea", "openings", "excludedArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netArea: { type: "number" } },
  required: ["netArea"],
} as const;
/** Calculate cavity wall insulation net area from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wallArea, openings, excludedArea } = request;
  const compute = (): Output => {
    H.domain(
      wallArea >= 0 &&
        excludedArea >= 0 &&
        openings.every((x) => x >= 0) &&
        openings.reduce((a, b) => a + b, 0) + excludedArea <= wallArea,
    );
    return {
      netArea: wallArea - openings.reduce((a, b) => a + b, 0) - excludedArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wallArea: 100, openings: [12, 8], excludedArea: 5 },
  output: { netArea: 75 },
} satisfies ToolExample<Input, Output>;
export const cavityWallInsulationNetAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/cavity-wall-insulation-net-area",
    title: "Cavity Wall Insulation Net Area Tool",
    description:
      "Calculate cavity wall insulation net area from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wallArea: { type: "number", minimum: 0 },
        openings: { type: "array", maxItems: 256, items: { type: "number" } },
        excludedArea: { type: "number", minimum: 0 },
      },
      required: ["wallArea", "openings", "excludedArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { netArea: { type: "number" } },
      required: ["netArea"],
    },
    ports: {
      inputs: [
        {
          id: "wallArea",
          label: "Wall Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "openings",
          label: "Openings",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "excludedArea",
          label: "Excluded Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netArea", label: "Net Area", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cavityWallInsulationNetAreaTool.execute;
export default cavityWallInsulationNetAreaTool;
