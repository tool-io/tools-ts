import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outerRadius: number;
  readonly trunkRadius: number;
  readonly clearance: number;
};
export type Output = { readonly usableArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outerRadius: { type: "number" },
    trunkRadius: { type: "number", minimum: 0 },
    clearance: { type: "number", minimum: 0 },
  },
  required: ["outerRadius", "trunkRadius", "clearance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { usableArea: { type: "number" } },
  required: ["usableArea"],
} as const;
/** Calculate mulch ring trunk clearance area term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outerRadius, trunkRadius, clearance } = request;
  const compute = (): Output => {
    H.domain(
      trunkRadius >= 0 &&
        clearance >= 0 &&
        outerRadius >= trunkRadius + clearance,
    );
    return {
      usableArea: Math.PI * (outerRadius ** 2 - (trunkRadius + clearance) ** 2),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outerRadius: 2, trunkRadius: 0.2, clearance: 0.3 },
  output: { usableArea: 11.780972450961723 },
} satisfies ToolExample<Input, Output>;
export const mulchRingTrunkClearanceAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "permaculture/mulch-ring-trunk-clearance-area-term",
    title: "Mulch Ring Trunk Clearance Area Term Tool",
    description:
      "Calculate mulch ring trunk clearance area term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outerRadius: { type: "number" },
        trunkRadius: { type: "number", minimum: 0 },
        clearance: { type: "number", minimum: 0 },
      },
      required: ["outerRadius", "trunkRadius", "clearance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { usableArea: { type: "number" } },
      required: ["usableArea"],
    },
    ports: {
      inputs: [
        {
          id: "outerRadius",
          label: "Outer Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "trunkRadius",
          label: "Trunk Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "clearance",
          label: "Clearance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "usableArea",
          label: "Usable Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mulchRingTrunkClearanceAreaTermTool.execute;
export default mulchRingTrunkClearanceAreaTermTool;
