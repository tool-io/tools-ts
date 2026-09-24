import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plannedQuantity: number;
  readonly installedQuantity: number;
  readonly acceptedQuantity: number;
  readonly useAccepted: boolean;
};
export type Output = {
  readonly countedQuantity: number;
  readonly variance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedQuantity: { type: "number", minimum: 0 },
    installedQuantity: { type: "number", minimum: 0 },
    acceptedQuantity: { type: "number", minimum: 0 },
    useAccepted: { type: "boolean" },
  },
  required: [
    "plannedQuantity",
    "installedQuantity",
    "acceptedQuantity",
    "useAccepted",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countedQuantity: { type: "number" },
    variance: { type: "number" },
  },
  required: ["countedQuantity", "variance"],
} as const;
/** Calculate installed quantity variance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plannedQuantity, installedQuantity, acceptedQuantity, useAccepted } =
    request;
  const compute = (): Output => {
    H.domain(
      plannedQuantity >= 0 &&
        installedQuantity >= 0 &&
        acceptedQuantity >= 0 &&
        acceptedQuantity <= installedQuantity,
    );
    return {
      countedQuantity: useAccepted ? acceptedQuantity : installedQuantity,
      variance:
        (useAccepted ? acceptedQuantity : installedQuantity) - plannedQuantity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    plannedQuantity: 100,
    installedQuantity: 110,
    acceptedQuantity: 90,
    useAccepted: true,
  },
  output: { countedQuantity: 90, variance: -10 },
} satisfies ToolExample<Input, Output>;
export const installedQuantityVarianceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "construction-management/installed-quantity-variance",
    title: "Installed Quantity Variance Tool",
    description:
      "Calculate installed quantity variance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plannedQuantity: { type: "number", minimum: 0 },
        installedQuantity: { type: "number", minimum: 0 },
        acceptedQuantity: { type: "number", minimum: 0 },
        useAccepted: { type: "boolean" },
      },
      required: [
        "plannedQuantity",
        "installedQuantity",
        "acceptedQuantity",
        "useAccepted",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countedQuantity: { type: "number" },
        variance: { type: "number" },
      },
      required: ["countedQuantity", "variance"],
    },
    ports: {
      inputs: [
        {
          id: "plannedQuantity",
          label: "Planned Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "installedQuantity",
          label: "Installed Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "acceptedQuantity",
          label: "Accepted Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "useAccepted",
          label: "Use Accepted",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "countedQuantity",
          label: "Counted Quantity",
          valueType: { type: "number" },
        },
        { id: "variance", label: "Variance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = installedQuantityVarianceTool.execute;
export default installedQuantityVarianceTool;
