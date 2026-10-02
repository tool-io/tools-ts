import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly directTransfer: number;
  readonly overhead: number;
  readonly sharedCredit: number;
};
export type Output = {
  readonly netCost: number;
  readonly overheadShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    directTransfer: { type: "number", minimum: 0 },
    overhead: { type: "number", minimum: 0 },
    sharedCredit: { type: "number", minimum: 0 },
  },
  required: ["directTransfer", "overhead", "sharedCredit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netCost: { type: "number" },
    overheadShare: { type: "number" },
  },
  required: ["netCost", "overheadShare"],
} as const;
/** Calculate relief transfer overhead share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { directTransfer, overhead, sharedCredit } = request;
  const compute = (): Output => {
    H.domain(
      directTransfer >= 0 &&
        overhead >= 0 &&
        sharedCredit >= 0 &&
        sharedCredit <= overhead &&
        directTransfer + overhead > sharedCredit,
    );
    return {
      netCost: directTransfer + overhead - sharedCredit,
      overheadShare:
        (overhead - sharedCredit) / (directTransfer + overhead - sharedCredit),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { directTransfer: 80, overhead: 30, sharedCredit: 10 },
  output: { netCost: 100, overheadShare: 0.2 },
} satisfies ToolExample<Input, Output>;
export const reliefTransferOverheadShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "peace-studies/relief-transfer-overhead-share",
    title: "Relief Transfer Overhead Share Tool",
    description:
      "Calculate relief transfer overhead share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        directTransfer: { type: "number", minimum: 0 },
        overhead: { type: "number", minimum: 0 },
        sharedCredit: { type: "number", minimum: 0 },
      },
      required: ["directTransfer", "overhead", "sharedCredit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netCost: { type: "number" },
        overheadShare: { type: "number" },
      },
      required: ["netCost", "overheadShare"],
    },
    ports: {
      inputs: [
        {
          id: "directTransfer",
          label: "Direct Transfer",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overhead",
          label: "Overhead",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedCredit",
          label: "Shared Credit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netCost", label: "Net Cost", valueType: { type: "number" } },
        {
          id: "overheadShare",
          label: "Overhead Share",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = reliefTransferOverheadShareTool.execute;
export default reliefTransferOverheadShareTool;
