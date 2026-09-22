import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly setup: number;
  readonly printing: number;
  readonly pauses: number;
  readonly teardown: number;
};
export type Output = { readonly printingShare: number; readonly total: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    setup: { type: "number", minimum: 0 },
    printing: { type: "number", minimum: 0 },
    pauses: { type: "number", minimum: 0 },
    teardown: { type: "number", minimum: 0 },
  },
  required: ["setup", "printing", "pauses", "teardown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { printingShare: { type: "number" }, total: { type: "number" } },
  required: ["printingShare", "total"],
} as const;
/** Calculate biofabrication build setup print time share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { setup, printing, pauses, teardown } = request;
  const compute = (): Output => {
    H.domain(
      setup >= 0 &&
        printing >= 0 &&
        pauses >= 0 &&
        teardown >= 0 &&
        setup + printing + pauses + teardown > 0,
    );
    return {
      printingShare: printing / (setup + printing + pauses + teardown),
      total: setup + printing + pauses + teardown,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { setup: 20, printing: 100, pauses: 10, teardown: 10 },
  output: { printingShare: 0.7142857142857143, total: 140 },
} satisfies ToolExample<Input, Output>;
export const biofabricationBuildSetupPrintTimeShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biofabrication/biofabrication-build-setup-print-time-share",
      title: "Biofabrication Build Setup Print Time Share Tool",
      description:
        "Calculate biofabrication build setup print time share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          setup: { type: "number", minimum: 0 },
          printing: { type: "number", minimum: 0 },
          pauses: { type: "number", minimum: 0 },
          teardown: { type: "number", minimum: 0 },
        },
        required: ["setup", "printing", "pauses", "teardown"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          printingShare: { type: "number" },
          total: { type: "number" },
        },
        required: ["printingShare", "total"],
      },
      ports: {
        inputs: [
          {
            id: "setup",
            label: "Setup",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "printing",
            label: "Printing",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "pauses",
            label: "Pauses",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "teardown",
            label: "Teardown",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "printingShare",
            label: "Printing Share",
            valueType: { type: "number", unit: "1" },
          },
          { id: "total", label: "Total", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = biofabricationBuildSetupPrintTimeShareTool.execute;
export default biofabricationBuildSetupPrintTimeShareTool;
