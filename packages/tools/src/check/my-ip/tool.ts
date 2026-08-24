import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";
import { validateIpAddress } from "../../validate/ip-address/tool.js";

export type MyIpInput = {
  readonly ipv4Address: string | null;
  readonly ipv6Address: string | null;
  readonly observedAt: string;
  readonly provider: string;
};

export type MyIpOutput = MyIpInput;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const validateAddressFamily = (
  value: unknown,
  version: "IPv4" | "IPv6",
  field: "ipv4Address" | "ipv6Address",
  issues: ToolIssue[],
): string | null => {
  if (value === null) return null;
  const address = validateIpAddress(value);
  if (address === null || address.version !== version || !address.isPublic) {
    issues.push({
      code: `${version.toLowerCase()}_address_invalid`,
      field,
      message: `${field} must be a publicly routable ${version} address or null.`,
    });
    return null;
  }
  return address.normalized;
};

export const calculateMyIp = (input: unknown): ToolResult<MyIpOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "observation_required",
        field: "",
        message: "A public-IP observation is required.",
      },
    ]);

  const issues: ToolIssue[] = [];
  const knownFields = new Set([
    "ipv4Address",
    "ipv6Address",
    "observedAt",
    "provider",
  ]);
  for (const field of Object.keys(input))
    if (!knownFields.has(field))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not part of a public-IP observation.`,
      });

  const ipv4Address = validateAddressFamily(
    input.ipv4Address,
    "IPv4",
    "ipv4Address",
    issues,
  );
  const ipv6Address = validateAddressFamily(
    input.ipv6Address,
    "IPv6",
    "ipv6Address",
    issues,
  );
  if (input.ipv4Address === null && input.ipv6Address === null)
    issues.push({
      code: "public_ip_unavailable",
      field: "",
      message: "At least one public IP address must be available.",
    });
  if (
    typeof input.observedAt !== "string" ||
    Number.isNaN(Date.parse(input.observedAt))
  )
    issues.push({
      code: "observed_at_invalid",
      field: "observedAt",
      message: "observedAt must be a valid date-time string.",
    });
  if (typeof input.provider !== "string" || input.provider.trim() === "")
    issues.push({
      code: "provider_invalid",
      field: "provider",
      message: "provider must identify the observing surface.",
    });

  if (issues.length > 0) return invalidInput(issues);
  return toolSuccess({
    ipv4Address,
    ipv6Address,
    observedAt: input.observedAt as string,
    provider: (input.provider as string).trim(),
  });
};

const nullableAddressSchema = {
  anyOf: [{ type: "null" }, { minLength: 2, type: "string" }],
} as const;

export const myIpInputSchema = {
  additionalProperties: false,
  properties: {
    ipv4Address: nullableAddressSchema,
    ipv6Address: nullableAddressSchema,
    observedAt: { minLength: 1, type: "string" },
    provider: { minLength: 1, type: "string" },
  },
  required: ["ipv4Address", "ipv6Address", "observedAt", "provider"],
  type: "object",
} as const;

export const myIpOutputSchema = myIpInputSchema;

export const myIpExample = {
  input: {
    ipv4Address: "8.8.8.8",
    ipv6Address: "2606:4700:4700::1111",
    observedAt: "2026-08-31T12:00:00.000Z",
    provider: "tool.io web",
  },
  output: {
    ipv4Address: "8.8.8.8",
    ipv6Address: "2606:4700:4700::1111",
    observedAt: "2026-08-31T12:00:00.000Z",
    provider: "tool.io web",
  },
} satisfies ToolExample<MyIpInput, MyIpOutput>;

export const myIpTool = defineTool<MyIpInput, MyIpOutput>({
  contractVersion: 1,
  description:
    "Show the public IPv4 and IPv6 addresses available to the current internet connection, reporting either family as unavailable when its probe cannot connect.",
  discovery: {
    aliases: ["check-ip", "public-ip", "what-is-my-ip"],
    collections: ["learn"],
    keywords: ["connection", "internet", "IPv4", "IPv6", "network"],
  },
  execute: calculateMyIp,
  execution: {
    capabilities: [
      { id: "network/public-ip", required: true, schemaVersion: 1 },
    ],
    kind: "remote",
  },
  id: "check/my-ip",
  inputSchema: myIpInputSchema,
  outputSchema: myIpOutputSchema,
  ports: {
    inputs: [
      {
        description:
          "IPv4 and IPv6 observations supplied by the network-capable surface.",
        id: "observation",
        label: "Public IP observation",
        path: [],
        required: true,
        valueType: { format: "capability/network-public-ip", type: "object" },
      },
    ],
    outputs: [
      {
        id: "ipv4Address",
        label: "Public IPv4 address",
        valueType: { format: "nullable/ip-address-v4", type: "string" },
      },
      {
        id: "ipv6Address",
        label: "Public IPv6 address",
        valueType: { format: "nullable/ip-address-v6", type: "string" },
      },
    ],
  },
  title: "What Is My IP Address?",
});

export const runMyIp = myIpTool.execute;
export default myIpTool;
