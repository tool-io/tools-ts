import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const domains = ["access", "change", "operations"] as const;
type ItgcDomain = (typeof domains)[number];

export type ItgcDomainSplitInput = {
  readonly domainControls: ReadonlyArray<string>;
};

export type ItgcDomainSplitOutput = {
  readonly complete: boolean;
  readonly coveredDomains: ReadonlyArray<ItgcDomain>;
  readonly missingDomains: ReadonlyArray<ItgcDomain>;
  readonly unmappedControls: ReadonlyArray<string>;
};

export const splitItgcDomains = (
  input: ItgcDomainSplitInput,
): ItgcDomainSplitOutput => {
  if (!Array.isArray(input.domainControls))
    simpleError(
      "domainControls",
      "Domain controls must be an array.",
      "domain_controls_required",
    );
  const covered = new Set<ItgcDomain>();
  const unmappedControls: string[] = [];
  for (const [index, value] of input.domainControls.entries()) {
    if (typeof value !== "string" || !value.includes(":"))
      simpleError(
        `domainControls.${index}`,
        "Each control must use a domain:control label.",
        "invalid_domain_control",
      );
    const [rawDomain, ...controlParts] = value.trim().split(":");
    const domain = rawDomain?.trim().toLowerCase();
    const control = controlParts.join(":").trim();
    if (control === "" || !domains.some((candidate) => candidate === domain))
      unmappedControls.push(value);
    else covered.add(domain as ItgcDomain);
  }
  const missingDomains = domains.filter((domain) => !covered.has(domain));
  return {
    complete: missingDomains.length === 0,
    coveredDomains: domains.filter((domain) => covered.has(domain)),
    missingDomains,
    unmappedControls,
  };
};

export const itgcDomainSplitExample = {
  input: {
    domainControls: [
      "access: quarterly user review",
      "change: emergency change approval",
      "unknown: orphaned control",
    ],
  },
  output: {
    complete: false,
    coveredDomains: ["access", "change"],
    missingDomains: ["operations"],
    unmappedControls: ["unknown: orphaned control"],
  },
} satisfies ToolExample<ItgcDomainSplitInput, ItgcDomainSplitOutput>;

export const itgcDomainSplitTool = createSimpleTool({
  calculate: (input) =>
    splitItgcDomains({ domainControls: input.domainControls as string[] }),
  description:
    "Split labeled controls across access, change, and operations ITGC domains and report missing domains and malformed mappings.",
  id: "auditing/itgc-access-change-operations-domain-split-lookup",
  inputs: [
    {
      description:
        "Control labels in domain:control form, such as access:user review.",
      id: "domainControls",
      kind: "stringList",
      label: "Domain controls",
    },
  ],
  outputs: [
    { id: "complete", kind: "boolean", label: "All domains covered" },
    { id: "coveredDomains", kind: "stringList", label: "Covered domains" },
    { id: "missingDomains", kind: "stringList", label: "Missing domains" },
    {
      id: "unmappedControls",
      kind: "stringList",
      label: "Unmapped controls",
    },
  ],
  title: "ITGC Access Change Operations Domain Split Lookup",
});

export const runItgcDomainSplit = itgcDomainSplitTool.execute;
export default itgcDomainSplitTool;
