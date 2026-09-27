import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly packageIds: readonly string[];
  readonly sealed: readonly boolean[];
  readonly sealVerified: readonly boolean[];
};
export type Output = {
  readonly packages: number;
  readonly sealedPackages: number;
  readonly verifiedSealedPackages: number;
  readonly verifiedShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packageIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sealed: { type: "array", maxItems: 256, items: { type: "boolean" } },
    sealVerified: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["packageIds", "sealed", "sealVerified"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packages: { type: "integer" },
    sealedPackages: { type: "integer" },
    verifiedSealedPackages: { type: "integer" },
    verifiedShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "packages",
    "sealedPackages",
    "verifiedSealedPackages",
    "verifiedShare",
    "defined",
  ],
} as const;
/** Count literal package/seal verification records; no chain-of-custody adequacy finding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { packageIds, sealed, sealVerified } = request;
  const compute = (): Output => {
    H.sameLength(packageIds, sealed);
    H.sameLength(packageIds, sealVerified);
    return (() => {
      const all = new Set(packageIds),
        yes = new Set(packageIds.filter((x, i) => sealed[i])),
        verified = new Set(
          packageIds.filter((x, i) => sealed[i] && sealVerified[i]),
        );
      return {
        packages: all.size,
        sealedPackages: yes.size,
        verifiedSealedPackages: verified.size,
        verifiedShare: all.size > 0 ? verified.size / all.size : 0,
        defined: all.size > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    packageIds: ["a", "a", "b"],
    sealed: [true, false, true],
    sealVerified: [true, false, false],
  },
  output: {
    packages: 2,
    sealedPackages: 2,
    verifiedSealedPackages: 1,
    verifiedShare: 0.5,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const evidencePackageSealShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "forensic-science/evidence-package-seal-share",
    title: "Evidence Package Seal Share Tool",
    description:
      "Count literal package/seal verification records; no chain-of-custody adequacy finding.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        packageIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sealed: { type: "array", maxItems: 256, items: { type: "boolean" } },
        sealVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["packageIds", "sealed", "sealVerified"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        packages: { type: "integer" },
        sealedPackages: { type: "integer" },
        verifiedSealedPackages: { type: "integer" },
        verifiedShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "packages",
        "sealedPackages",
        "verifiedSealedPackages",
        "verifiedShare",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "packageIds",
          label: "Package Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sealed",
          label: "Sealed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "sealVerified",
          label: "Seal Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "packages", label: "Packages", valueType: { type: "integer" } },
        {
          id: "sealedPackages",
          label: "Sealed Packages",
          valueType: { type: "integer" },
        },
        {
          id: "verifiedSealedPackages",
          label: "Verified Sealed Packages",
          valueType: { type: "integer" },
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
export const run = evidencePackageSealShareTool.execute;
export default evidencePackageSealShareTool;
