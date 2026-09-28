import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly materialQuantities: readonly number[];
  readonly statusKnown: readonly boolean[];
  readonly dispositionVerified: readonly boolean[];
  readonly sourceMatched: readonly boolean[];
};
export type Output = {
  readonly totalQuantity: number;
  readonly supportedQuantity: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    materialQuantities: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    statusKnown: { type: "array", maxItems: 256, items: { type: "boolean" } },
    dispositionVerified: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    sourceMatched: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: [
    "materialQuantities",
    "statusKnown",
    "dispositionVerified",
    "sourceMatched",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalQuantity: { type: "number" },
    supportedQuantity: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["totalQuantity", "supportedQuantity", "share", "defined"],
} as const;
/** Calculate material status support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    materialQuantities,
    statusKnown,
    dispositionVerified,
    sourceMatched,
  } = request;
  const compute = (): Output => {
    H.sameLength(materialQuantities, statusKnown);
    H.sameLength(materialQuantities, dispositionVerified);
    H.sameLength(materialQuantities, sourceMatched);
    H.domain(materialQuantities.every((x) => x >= 0));
    return (() => {
      const totalQuantity = materialQuantities.reduce((a, b) => a + b, 0),
        supportedQuantity = materialQuantities.reduce(
          (s, x, i) =>
            s +
            (statusKnown[i] && dispositionVerified[i] && sourceMatched[i]
              ? x
              : 0),
          0,
        );
      return {
        totalQuantity,
        supportedQuantity,
        share: totalQuantity > 0 ? supportedQuantity / totalQuantity : 0,
        defined: totalQuantity > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    materialQuantities: [2, 3, 5],
    statusKnown: [true, true, true],
    dispositionVerified: [true, true, false],
    sourceMatched: [true, false, true],
  },
  output: {
    totalQuantity: 10,
    supportedQuantity: 2,
    share: 0.2,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const materialStatusSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gmp/material-status-support-share",
    title: "Material Status Support Share Tool",
    description:
      "Calculate material status support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        materialQuantities: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        statusKnown: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        dispositionVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        sourceMatched: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "materialQuantities",
        "statusKnown",
        "dispositionVerified",
        "sourceMatched",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalQuantity: { type: "number" },
        supportedQuantity: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["totalQuantity", "supportedQuantity", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "materialQuantities",
          label: "Material Quantities",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "statusKnown",
          label: "Status Known",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "dispositionVerified",
          label: "Disposition Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "sourceMatched",
          label: "Source Matched",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "totalQuantity",
          label: "Total Quantity",
          valueType: { type: "number" },
        },
        {
          id: "supportedQuantity",
          label: "Supported Quantity",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = materialStatusSupportShareTool.execute;
export default materialStatusSupportShareTool;
