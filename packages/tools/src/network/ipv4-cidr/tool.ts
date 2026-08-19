import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type Ipv4CidrInput = {
  readonly address: string;
  readonly prefix: number;
};

export type Ipv4CidrOutput = {
  readonly broadcastAddress: string;
  readonly firstHost: string;
  readonly lastHost: string;
  readonly networkAddress: string;
  readonly totalHosts: number;
};

const IPV4_PATTERN =
  /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

const toInt = (address: string): number => {
  const o = address.split(".").map(Number);
  return o[0] * 16777216 + o[1] * 65536 + o[2] * 256 + o[3];
};

const toAddress = (value: number): string =>
  [
    Math.floor(value / 16777216) % 256,
    Math.floor(value / 65536) % 256,
    Math.floor(value / 256) % 256,
    value % 256,
  ].join(".");

export const ipv4CidrInputSchema = {
  additionalProperties: false,
  properties: {
    address: {
      description: "Any IPv4 address inside the network.",
      maxLength: 15,
      minLength: 7,
      type: "string",
    },
    prefix: {
      description: "Network prefix length in bits, 0 to 32.",
      maximum: 32,
      minimum: 0,
      type: "integer",
    },
  },
  required: ["address", "prefix"],
  type: "object",
} as const;

export const ipv4CidrOutputSchema = {
  additionalProperties: false,
  properties: {
    broadcastAddress: {
      description: "Highest address in the network.",
      type: "string",
    },
    firstHost: {
      description: "First assignable host address.",
      type: "string",
    },
    lastHost: {
      description: "Last assignable host address.",
      type: "string",
    },
    networkAddress: {
      description: "Lowest address in the network.",
      type: "string",
    },
    totalHosts: {
      description:
        "Assignable host count; point-to-point /31 and /32 networks contain 2 and 1.",
      minimum: 0,
      type: "integer",
    },
  },
  required: [
    "networkAddress",
    "broadcastAddress",
    "firstHost",
    "lastHost",
    "totalHosts",
  ],
  type: "object",
} as const;

export const ipv4CidrExample = {
  input: { address: "192.168.1.77", prefix: 24 },
  output: {
    broadcastAddress: "192.168.1.255",
    firstHost: "192.168.1.1",
    lastHost: "192.168.1.254",
    networkAddress: "192.168.1.0",
    totalHosts: 254,
  },
} satisfies ToolExample<Ipv4CidrInput, Ipv4CidrOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isIpv4CidrOutput = (value: unknown): value is Ipv4CidrOutput =>
  isRecord(value) &&
  typeof value.networkAddress === "string" &&
  Number.isSafeInteger(value.totalHosts);

export const calculateIpv4Cidr = (
  input: unknown,
): ToolResult<Ipv4CidrOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (!knownField(field))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const rawAddress = input.address as string | undefined;
  const prefix = input.prefix as number | undefined;
  if (
    rawAddress === undefined ||
    typeof rawAddress !== "string" ||
    !IPV4_PATTERN.test(rawAddress)
  )
    return invalidInput([
      ...issues,
      {
        code: "address_invalid",
        field: "address",
        message: "address must be a valid dotted-decimal IPv4 address.",
      },
    ]);
  if (
    prefix === undefined ||
    !Number.isSafeInteger(prefix) ||
    prefix < 0 ||
    prefix > 32
  )
    return invalidInput([
      ...issues,
      {
        code: "prefix_invalid",
        field: "prefix",
        message: "prefix must be an integer between 0 and 32.",
      },
    ]);
  if (issues.length > 0) return invalidInput(issues);

  const addressInt = toInt(rawAddress);
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const network = (addressInt & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  // /31 point-to-point links have both addresses assignable; /32 has one.
  const hostSpan = broadcast - network;
  const firstHost = hostSpan < 2 ? network : network + 1;
  const lastHost = hostSpan < 2 ? broadcast : broadcast - 1;
  return toolSuccess({
    broadcastAddress: toAddress(broadcast),
    firstHost: toAddress(firstHost),
    lastHost: toAddress(lastHost),
    networkAddress: toAddress(network),
    totalHosts: hostSpan < 2 ? hostSpan + 1 : hostSpan - 1,
  });
};

function knownField(field: string): boolean {
  return field === "address" || field === "prefix";
}

export const ipv4CidrTool = defineTool<Ipv4CidrInput, Ipv4CidrOutput>({
  contractVersion: 1,
  description:
    "Compute network address, broadcast, host range, and capacity for an IPv4 CIDR block.",
  discovery: {
    aliases: ["cidr-calculator", "subnet-calculator"],
    keywords: ["cidr", "ipv4", "netmask", "subnet"],
  },
  execute: calculateIpv4Cidr,
  execution: { kind: "pure" },
  id: "network/ipv4-cidr",
  inputSchema: ipv4CidrInputSchema,
  outputSchema: ipv4CidrOutputSchema,
  ports: {
    inputs: [
      {
        description: "Any address inside the network.",
        id: "address",
        label: "Address",
        required: true,
        valueType: { format: "ipv4-address", type: "string" },
      },
      {
        description: "Prefix length in bits.",
        id: "prefix",
        label: "Prefix",
        required: true,
        valueType: { format: "cidr-prefix", type: "integer" },
      },
    ],
    outputs: [
      {
        description: "Lowest address in the network.",
        id: "networkAddress",
        label: "Network",
        valueType: { format: "ipv4-address", type: "string" },
      },
      {
        description: "Highest address in the network.",
        id: "broadcastAddress",
        label: "Broadcast",
        valueType: { format: "ipv4-address", type: "string" },
      },
      {
        description: "First assignable host.",
        id: "firstHost",
        label: "First host",
        valueType: { format: "ipv4-address", type: "string" },
      },
      {
        description: "Last assignable host.",
        id: "lastHost",
        label: "Last host",
        valueType: { format: "ipv4-address", type: "string" },
      },
      {
        description: "Assignable host count.",
        id: "totalHosts",
        label: "Total hosts",
        valueType: { format: "count", type: "integer" },
      },
    ],
  },
  title: "IPv4 CIDR Calculator",
});

export const runIpv4Cidr = ipv4CidrTool.execute;
export const example = {
  input: { address: "192.168.1.77", prefix: 24 },
  output: {
    broadcastAddress: "192.168.1.255",
    firstHost: "192.168.1.1",
    lastHost: "192.168.1.254",
    networkAddress: "192.168.1.0",
    totalHosts: 254,
  },
} satisfies ToolExample<Ipv4CidrInput, Ipv4CidrOutput>;
export default ipv4CidrTool;
