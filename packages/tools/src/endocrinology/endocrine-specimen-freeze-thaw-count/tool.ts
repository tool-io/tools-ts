import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingCycles: number;
  readonly addedCycles: number;
  readonly removedErroneousCycles: number;
};
export type Output = { readonly closingBalance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingCycles: { type: "integer", minimum: 0 },
    addedCycles: { type: "integer", minimum: 0 },
    removedErroneousCycles: { type: "integer", minimum: 0 },
  },
  required: ["openingCycles", "addedCycles", "removedErroneousCycles"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closingBalance: { type: "integer" } },
  required: ["closingBalance"],
} as const;
/** Reconcile explicitly recorded endocrine specimen freeze-thaw cycle counts without inferring assay stability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingCycles, addedCycles, removedErroneousCycles } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(openingCycles) &&
        openingCycles >= 0 &&
        openingCycles <= Number.MAX_SAFE_INTEGER,
      "openingCycles",
    ),
      openingCycles);
    (H.domain(
      Number.isSafeInteger(addedCycles) &&
        addedCycles >= 0 &&
        addedCycles <= Number.MAX_SAFE_INTEGER,
      "addedCycles",
    ),
      addedCycles);
    (H.domain(
      Number.isSafeInteger(removedErroneousCycles) &&
        removedErroneousCycles >= 0 &&
        removedErroneousCycles <= Number.MAX_SAFE_INTEGER,
      "removedErroneousCycles",
    ),
      removedErroneousCycles);
    return {
      closingBalance: Number(
        BigInt(openingCycles) +
          BigInt(addedCycles) -
          BigInt(removedErroneousCycles),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingCycles: 20, addedCycles: 8, removedErroneousCycles: 5 },
  output: { closingBalance: 23 },
} satisfies ToolExample<Input, Output>;
export const endocrineSpecimenFreezeThawCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endocrinology/endocrine-specimen-freeze-thaw-count",
    title: "Endocrine Specimen Freeze Thaw Count Tool",
    description:
      "Reconcile explicitly recorded endocrine specimen freeze-thaw cycle counts without inferring assay stability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingCycles: { type: "integer", minimum: 0 },
        addedCycles: { type: "integer", minimum: 0 },
        removedErroneousCycles: { type: "integer", minimum: 0 },
      },
      required: ["openingCycles", "addedCycles", "removedErroneousCycles"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { closingBalance: { type: "integer" } },
      required: ["closingBalance"],
    },
    ports: {
      inputs: [
        {
          id: "openingCycles",
          label: "Opening Cycles",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "addedCycles",
          label: "Added Cycles",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "removedErroneousCycles",
          label: "Removed Erroneous Cycles",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "closingBalance",
          label: "Closing Balance",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = endocrineSpecimenFreezeThawCountTool.execute;
export default endocrineSpecimenFreezeThawCountTool;
