import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resourceQuantities: readonly number[];
  readonly reusedFractions: readonly number[];
  readonly provenanceVerified: readonly boolean[];
};
export type Output = {
  readonly totalQuantity: number;
  readonly declaredReused: number;
  readonly verifiedReused: number;
  readonly verifiedShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resourceQuantities: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    reusedFractions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    provenanceVerified: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["resourceQuantities", "reusedFractions", "provenanceVerified"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalQuantity: { type: "number" },
    declaredReused: { type: "number" },
    verifiedReused: { type: "number" },
    verifiedShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "totalQuantity",
    "declaredReused",
    "verifiedReused",
    "verifiedShare",
    "defined",
  ],
} as const;
/** Calculate resource reuse support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resourceQuantities, reusedFractions, provenanceVerified } = request;
  const compute = (): Output => {
    H.sameLength(resourceQuantities, reusedFractions);
    H.sameLength(resourceQuantities, provenanceVerified);
    H.domain(
      resourceQuantities.every((x) => x >= 0) &&
        reusedFractions.every((x) => x >= 0 && x <= 1),
    );
    return (() => {
      const totalQuantity = resourceQuantities.reduce((a, b) => a + b, 0),
        declaredReused = resourceQuantities.reduce(
          (s, x, i) => s + x * reusedFractions[i],
          0,
        ),
        verifiedReused = resourceQuantities.reduce(
          (s, x, i) => s + (provenanceVerified[i] ? x * reusedFractions[i] : 0),
          0,
        );
      return {
        totalQuantity,
        declaredReused,
        verifiedReused,
        verifiedShare: totalQuantity > 0 ? verifiedReused / totalQuantity : 0,
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
    resourceQuantities: [10, 20],
    reusedFractions: [0.5, 0.5],
    provenanceVerified: [true, false],
  },
  output: {
    totalQuantity: 30,
    declaredReused: 15,
    verifiedReused: 5,
    verifiedShare: 0.16666666666666666,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const resourceReuseSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sustainable-agriculture/resource-reuse-support-share",
    title: "Resource Reuse Support Share Tool",
    description:
      "Calculate resource reuse support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resourceQuantities: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        reusedFractions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        provenanceVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["resourceQuantities", "reusedFractions", "provenanceVerified"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalQuantity: { type: "number" },
        declaredReused: { type: "number" },
        verifiedReused: { type: "number" },
        verifiedShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "totalQuantity",
        "declaredReused",
        "verifiedReused",
        "verifiedShare",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "resourceQuantities",
          label: "Resource Quantities",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "reusedFractions",
          label: "Reused Fractions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "provenanceVerified",
          label: "Provenance Verified",
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
          id: "declaredReused",
          label: "Declared Reused",
          valueType: { type: "number" },
        },
        {
          id: "verifiedReused",
          label: "Verified Reused",
          valueType: { type: "number" },
        },
        {
          id: "verifiedShare",
          label: "Verified Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = resourceReuseSupportShareTool.execute;
export default resourceReuseSupportShareTool;
