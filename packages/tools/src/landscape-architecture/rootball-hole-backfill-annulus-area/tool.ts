import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly holeRadius: number;
  readonly rootballRadius: number;
  readonly depth: number;
};
export type Output = {
  readonly annulusArea: number;
  readonly backfillVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    holeRadius: { type: "number" },
    rootballRadius: { type: "number", minimum: 0 },
    depth: { type: "number", minimum: 0 },
  },
  required: ["holeRadius", "rootballRadius", "depth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    annulusArea: { type: "number" },
    backfillVolume: { type: "number" },
  },
  required: ["annulusArea", "backfillVolume"],
} as const;
/** Calculate rootball hole backfill annulus area from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { holeRadius, rootballRadius, depth } = request;
  const compute = (): Output => {
    H.domain(rootballRadius >= 0 && holeRadius >= rootballRadius && depth >= 0);
    return {
      annulusArea:
        Math.PI * (holeRadius - rootballRadius) * (holeRadius + rootballRadius),
      backfillVolume:
        Math.PI *
        (holeRadius - rootballRadius) *
        (holeRadius + rootballRadius) *
        depth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { holeRadius: 1, rootballRadius: 0.5, depth: 2 },
  output: { annulusArea: 2.356194490192345, backfillVolume: 4.71238898038469 },
} satisfies ToolExample<Input, Output>;
export const rootballHoleBackfillAnnulusAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/rootball-hole-backfill-annulus-area",
    title: "Rootball Hole Backfill Annulus Area Tool",
    description:
      "Calculate rootball hole backfill annulus area from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        holeRadius: { type: "number" },
        rootballRadius: { type: "number", minimum: 0 },
        depth: { type: "number", minimum: 0 },
      },
      required: ["holeRadius", "rootballRadius", "depth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        annulusArea: { type: "number" },
        backfillVolume: { type: "number" },
      },
      required: ["annulusArea", "backfillVolume"],
    },
    ports: {
      inputs: [
        {
          id: "holeRadius",
          label: "Hole Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rootballRadius",
          label: "Rootball Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "annulusArea",
          label: "Annulus Area",
          valueType: { type: "number" },
        },
        {
          id: "backfillVolume",
          label: "Backfill Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rootballHoleBackfillAnnulusAreaTool.execute;
export default rootballHoleBackfillAnnulusAreaTool;
