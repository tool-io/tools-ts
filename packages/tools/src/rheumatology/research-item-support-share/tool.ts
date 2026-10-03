import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemWeights: readonly number[];
  readonly applicable: readonly boolean[];
  readonly responseKnown: readonly boolean[];
  readonly sourceVerified: readonly boolean[];
};
export type Output = {
  readonly applicableWeight: number;
  readonly supportedWeight: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    applicable: { type: "array", maxItems: 256, items: { type: "boolean" } },
    responseKnown: { type: "array", maxItems: 256, items: { type: "boolean" } },
    sourceVerified: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["itemWeights", "applicable", "responseKnown", "sourceVerified"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    applicableWeight: { type: "number" },
    supportedWeight: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["applicableWeight", "supportedWeight", "share", "defined"],
} as const;
/** Calculate research item support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemWeights, applicable, responseKnown, sourceVerified } = request;
  const compute = (): Output => {
    H.sameLength(itemWeights, applicable);
    H.sameLength(itemWeights, responseKnown);
    H.sameLength(itemWeights, sourceVerified);
    H.domain(itemWeights.every((x) => x >= 0));
    return (() => {
      const applicableWeight = itemWeights.reduce(
          (s, x, i) => s + (applicable[i] ? x : 0),
          0,
        ),
        supportedWeight = itemWeights.reduce(
          (s, x, i) =>
            s +
            (applicable[i] && responseKnown[i] && sourceVerified[i] ? x : 0),
          0,
        );
      return {
        applicableWeight,
        supportedWeight,
        share: applicableWeight > 0 ? supportedWeight / applicableWeight : 0,
        defined: applicableWeight > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    itemWeights: [2, 3, 5],
    applicable: [true, true, false],
    responseKnown: [true, true, true],
    sourceVerified: [true, false, true],
  },
  output: {
    applicableWeight: 5,
    supportedWeight: 2,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const researchItemSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "rheumatology/research-item-support-share",
    title: "Research Item Support Share Tool",
    description:
      "Calculate research item support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        applicable: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        responseKnown: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        sourceVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "itemWeights",
        "applicable",
        "responseKnown",
        "sourceVerified",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        applicableWeight: { type: "number" },
        supportedWeight: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["applicableWeight", "supportedWeight", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "itemWeights",
          label: "Item Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "applicable",
          label: "Applicable",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "responseKnown",
          label: "Response Known",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "sourceVerified",
          label: "Source Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "applicableWeight",
          label: "Applicable Weight",
          valueType: { type: "number" },
        },
        {
          id: "supportedWeight",
          label: "Supported Weight",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = researchItemSupportShareTool.execute;
export default researchItemSupportShareTool;
