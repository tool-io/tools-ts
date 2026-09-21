import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly claimA: number;
  readonly claimB: number;
  readonly intersection: number;
  readonly parcelArea: number;
};
export type Output = {
  readonly union: number;
  readonly unclaimed: number;
  readonly excess: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    claimA: { type: "number", minimum: 0 },
    claimB: { type: "number", minimum: 0 },
    intersection: { type: "number", minimum: 0 },
    parcelArea: { type: "number", minimum: 0 },
  },
  required: ["claimA", "claimB", "intersection", "parcelArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    union: { type: "number" },
    unclaimed: { type: "number" },
    excess: { type: "number" },
  },
  required: ["union", "unclaimed", "excess"],
} as const;
/** Calculate farm claim parcel overlap area term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { claimA, claimB, intersection, parcelArea } = request;
  const compute = (): Output => {
    H.domain(
      claimA >= 0 &&
        claimB >= 0 &&
        intersection >= 0 &&
        intersection <= Math.min(claimA, claimB) &&
        parcelArea >= 0,
    );
    return {
      union: claimA + claimB - intersection,
      unclaimed: Math.max(0, parcelArea - claimA - claimB + intersection),
      excess: Math.max(0, claimA + claimB - intersection - parcelArea),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { claimA: 60, claimB: 50, intersection: 20, parcelArea: 100 },
  output: { union: 90, unclaimed: 10, excess: 0 },
} satisfies ToolExample<Input, Output>;
export const farmClaimParcelOverlapAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-policy/farm-claim-parcel-overlap-area-term",
    title: "Farm Claim Parcel Overlap Area Term Tool",
    description:
      "Calculate farm claim parcel overlap area term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        claimA: { type: "number", minimum: 0 },
        claimB: { type: "number", minimum: 0 },
        intersection: { type: "number", minimum: 0 },
        parcelArea: { type: "number", minimum: 0 },
      },
      required: ["claimA", "claimB", "intersection", "parcelArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        union: { type: "number" },
        unclaimed: { type: "number" },
        excess: { type: "number" },
      },
      required: ["union", "unclaimed", "excess"],
    },
    ports: {
      inputs: [
        {
          id: "claimA",
          label: "Claim A",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "claimB",
          label: "Claim B",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "intersection",
          label: "Intersection",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "parcelArea",
          label: "Parcel Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "union", label: "Union", valueType: { type: "number" } },
        { id: "unclaimed", label: "Unclaimed", valueType: { type: "number" } },
        { id: "excess", label: "Excess", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmClaimParcelOverlapAreaTermTool.execute;
export default farmClaimParcelOverlapAreaTermTool;
