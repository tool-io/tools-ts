import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issued: number;
  readonly returned: number;
  readonly rejected: number;
  readonly reused: number;
};
export type Output = {
  readonly returnShare: number;
  readonly reuseAmongReturned: number;
  readonly netOutstanding: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issued: { type: "integer", minimum: 1 },
    returned: { type: "integer", minimum: 1 },
    rejected: { type: "integer", minimum: 0 },
    reused: { type: "integer", minimum: 0 },
  },
  required: ["issued", "returned", "rejected", "reused"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    returnShare: { type: "number" },
    reuseAmongReturned: { type: "number" },
    netOutstanding: { type: "integer" },
  },
  required: ["returnShare", "reuseAmongReturned", "netOutstanding"],
} as const;
/** Calculate farm packaging return reuse count share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issued, returned, rejected, reused } = request;
  const compute = (): Output => {
    H.integer(issued, 1);
    H.integer(returned, 1, issued);
    H.integer(rejected, 0, returned);
    H.integer(reused, 0, returned - rejected);
    return {
      returnShare: returned / issued,
      reuseAmongReturned: reused / returned,
      netOutstanding: issued - returned,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { issued: 100, returned: 80, rejected: 10, reused: 60 },
  output: { returnShare: 0.8, reuseAmongReturned: 0.75, netOutstanding: 20 },
} satisfies ToolExample<Input, Output>;
export const farmPackagingReturnReuseCountShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sustainable-agriculture/farm-packaging-return-reuse-count-share",
    title: "Farm Packaging Return Reuse Count Share Tool",
    description:
      "Calculate farm packaging return reuse count share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        issued: { type: "integer", minimum: 1 },
        returned: { type: "integer", minimum: 1 },
        rejected: { type: "integer", minimum: 0 },
        reused: { type: "integer", minimum: 0 },
      },
      required: ["issued", "returned", "rejected", "reused"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        returnShare: { type: "number" },
        reuseAmongReturned: { type: "number" },
        netOutstanding: { type: "integer" },
      },
      required: ["returnShare", "reuseAmongReturned", "netOutstanding"],
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
          id: "rejected",
          label: "Rejected",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reused",
          label: "Reused",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "returnShare",
          label: "Return Share",
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "reuseAmongReturned",
          label: "Reuse Among Returned",
          valueType: { type: "number" },
        },
        {
          id: "netOutstanding",
          label: "Net Outstanding",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmPackagingReturnReuseCountShareTool.execute;
export default farmPackagingReturnReuseCountShareTool;
