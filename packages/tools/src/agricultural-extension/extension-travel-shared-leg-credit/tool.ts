import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outbound: number;
  readonly returnTravel: number;
  readonly sharedLeg: number;
  readonly creditShared: boolean;
};
export type Output = {
  readonly countedDistance: number;
  readonly credit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outbound: { type: "number", minimum: 0 },
    returnTravel: { type: "number", minimum: 0 },
    sharedLeg: { type: "number", minimum: 0 },
    creditShared: { type: "boolean" },
  },
  required: ["outbound", "returnTravel", "sharedLeg", "creditShared"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countedDistance: { type: "number" },
    credit: { type: "number" },
  },
  required: ["countedDistance", "credit"],
} as const;
/** Calculate extension travel shared leg credit from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outbound, returnTravel, sharedLeg, creditShared } = request;
  const compute = (): Output => {
    H.domain(
      outbound >= 0 &&
        returnTravel >= 0 &&
        sharedLeg >= 0 &&
        sharedLeg <= Math.min(outbound, returnTravel),
    );
    return {
      countedDistance: outbound + returnTravel - (creditShared ? sharedLeg : 0),
      credit: creditShared ? sharedLeg : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outbound: 20, returnTravel: 30, sharedLeg: 10, creditShared: true },
  output: { countedDistance: 40, credit: 10 },
} satisfies ToolExample<Input, Output>;
export const extensionTravelSharedLegCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-extension/extension-travel-shared-leg-credit",
    title: "Extension Travel Shared Leg Credit Tool",
    description:
      "Calculate extension travel shared leg credit from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outbound: { type: "number", minimum: 0 },
        returnTravel: { type: "number", minimum: 0 },
        sharedLeg: { type: "number", minimum: 0 },
        creditShared: { type: "boolean" },
      },
      required: ["outbound", "returnTravel", "sharedLeg", "creditShared"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countedDistance: { type: "number" },
        credit: { type: "number" },
      },
      required: ["countedDistance", "credit"],
    },
    ports: {
      inputs: [
        {
          id: "outbound",
          label: "Outbound",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "returnTravel",
          label: "Return Travel",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedLeg",
          label: "Shared Leg",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "creditShared",
          label: "Credit Shared",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "countedDistance",
          label: "Counted Distance",
          valueType: { type: "number" },
        },
        { id: "credit", label: "Credit", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = extensionTravelSharedLegCreditTool.execute;
export default extensionTravelSharedLegCreditTool;
