import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IpAddressVersion = "IPv4" | "IPv6";

export type IpAddressValidationInput = {
  readonly ipAddress: string;
};

export type IpAddressValidationOutput = {
  readonly isPublic: boolean;
  readonly normalized: string;
  readonly scope: string;
  readonly version: IpAddressVersion;
};

const IPV4_OCTET = "(?:0|[1-9]\\d?|1\\d{2}|2[0-4]\\d|25[0-5])";
const IPV4_PATTERN = new RegExp(`^${IPV4_OCTET}(?:\\.${IPV4_OCTET}){3}$`);

const inIpv4Range = (
  octets: readonly number[],
  first: number,
  secondStart = 0,
  secondEnd = 255,
): boolean =>
  octets[0] === first && octets[1] >= secondStart && octets[1] <= secondEnd;

const classifyIpv4 = (
  address: string,
): Pick<IpAddressValidationOutput, "isPublic" | "scope"> => {
  const octets = address.split(".").map(Number);
  if (inIpv4Range(octets, 0)) return { isPublic: false, scope: "this-network" };
  if (inIpv4Range(octets, 10)) return { isPublic: false, scope: "private" };
  if (inIpv4Range(octets, 100, 64, 127))
    return { isPublic: false, scope: "shared-address-space" };
  if (inIpv4Range(octets, 127)) return { isPublic: false, scope: "loopback" };
  if (inIpv4Range(octets, 169, 254, 254))
    return { isPublic: false, scope: "link-local" };
  if (inIpv4Range(octets, 172, 16, 31))
    return { isPublic: false, scope: "private" };
  if (inIpv4Range(octets, 192, 168, 168))
    return { isPublic: false, scope: "private" };
  if (
    (octets[0] === 192 && octets[1] === 0 && octets[2] === 2) ||
    (octets[0] === 198 && octets[1] === 51 && octets[2] === 100) ||
    (octets[0] === 203 && octets[1] === 0 && octets[2] === 113)
  )
    return { isPublic: false, scope: "documentation" };
  if (octets[0] === 198 && (octets[1] === 18 || octets[1] === 19))
    return { isPublic: false, scope: "benchmarking" };
  if (octets[0] >= 224 && octets[0] <= 239)
    return { isPublic: false, scope: "multicast" };
  if (octets[0] >= 240)
    return {
      isPublic: false,
      scope: address === "255.255.255.255" ? "broadcast" : "reserved",
    };
  return { isPublic: true, scope: "global" };
};

const parseIpv6 = (address: string): string | null => {
  if (!address.includes(":") || address.includes("%")) return null;
  let candidate = address.toLowerCase();
  if (candidate.includes(".")) {
    const separator = candidate.lastIndexOf(":");
    const ipv4 = separator < 0 ? "" : candidate.slice(separator + 1);
    if (!IPV4_PATTERN.test(ipv4)) return null;
    const octets = ipv4.split(".").map(Number);
    candidate = `${candidate.slice(0, separator + 1)}${(
      octets[0] * 256 +
      octets[1]
    ).toString(16)}:${(octets[2] * 256 + octets[3]).toString(16)}`;
  }

  const halves = candidate.split("::");
  if (halves.length > 2) return null;
  const head = halves[0] === "" ? [] : halves[0].split(":");
  const tail =
    halves.length === 1 || halves[1] === "" ? [] : halves[1].split(":");
  const groups = [...head, ...tail];
  if (groups.some((group) => !/^[0-9a-f]{1,4}$/u.test(group))) return null;
  if (halves.length === 1 && groups.length !== 8) return null;
  if (halves.length === 2 && groups.length >= 8) return null;

  const expanded = [
    ...head,
    ...Array.from({ length: 8 - groups.length }, () => "0"),
    ...tail,
  ].map((group) => group.replace(/^0+(?=.)/u, ""));
  let bestStart = -1;
  let bestLength = 0;
  for (let index = 0; index < expanded.length;) {
    if (expanded[index] !== "0") {
      index += 1;
      continue;
    }
    let end = index;
    while (end < expanded.length && expanded[end] === "0") end += 1;
    if (end - index > bestLength) {
      bestStart = index;
      bestLength = end - index;
    }
    index = end;
  }
  if (bestLength < 2) return expanded.join(":");
  const before = expanded.slice(0, bestStart).join(":");
  const after = expanded.slice(bestStart + bestLength).join(":");
  return `${before}::${after}`;
};

const expandIpv6 = (address: string): readonly number[] => {
  const [head = "", tail = ""] = address.split("::");
  const headGroups = head === "" ? [] : head.split(":");
  const tailGroups = tail === "" ? [] : tail.split(":");
  const omitted = 8 - headGroups.length - tailGroups.length;
  return [
    ...headGroups,
    ...Array.from({ length: omitted }, () => "0"),
    ...tailGroups,
  ].map((group) => Number.parseInt(group, 16));
};

const classifyIpv6 = (
  address: string,
): Pick<IpAddressValidationOutput, "isPublic" | "scope"> => {
  const groups = expandIpv6(address);
  if (groups.every((group) => group === 0))
    return { isPublic: false, scope: "unspecified" };
  if (groups.slice(0, 7).every((group) => group === 0) && groups[7] === 1)
    return { isPublic: false, scope: "loopback" };
  if (groups.slice(0, 5).every((group) => group === 0) && groups[5] === 0xffff)
    return { isPublic: false, scope: "ipv4-mapped" };
  if ((groups[0] & 0xfe00) === 0xfc00)
    return { isPublic: false, scope: "unique-local" };
  if ((groups[0] & 0xffc0) === 0xfe80)
    return { isPublic: false, scope: "link-local" };
  if ((groups[0] & 0xff00) === 0xff00)
    return { isPublic: false, scope: "multicast" };
  if (groups[0] === 0x2001 && groups[1] === 0x0db8)
    return { isPublic: false, scope: "documentation" };
  if (groups[0] === 0x0100 && groups.slice(1, 4).every((group) => group === 0))
    return { isPublic: false, scope: "discard-only" };
  return { isPublic: true, scope: "global" };
};

export const validateIpAddress = (
  value: unknown,
): IpAddressValidationOutput | null => {
  if (typeof value !== "string") return null;
  const raw = value.trim();
  if (IPV4_PATTERN.test(raw)) {
    const normalized = raw.split(".").map(Number).join(".");
    return {
      ...classifyIpv4(normalized),
      normalized,
      version: "IPv4",
    };
  }
  const unwrapped =
    raw.startsWith("[") && raw.endsWith("]") ? raw.slice(1, -1) : raw;
  const normalized = parseIpv6(unwrapped);
  if (normalized === null) return null;
  return {
    ...classifyIpv6(normalized),
    normalized,
    version: "IPv6",
  };
};

export const ipAddressTool = createSimpleTool({
  id: "validate/ip-address",
  title: "IP Address Validator",
  description:
    "Validate, normalize, and classify an IPv4 or IPv6 address, including private, loopback, link-local, documentation, multicast, and globally routable ranges.",
  inputs: [
    {
      description: "IPv4 or IPv6 address to validate.",
      id: "ipAddress",
      label: "IP address",
      kind: "string",
    },
  ],
  outputs: [
    { id: "version", label: "Version", kind: "string" },
    { id: "normalized", label: "Normalized address", kind: "string" },
    { id: "scope", label: "Address scope", kind: "string" },
    { id: "isPublic", label: "Is publicly routable", kind: "boolean" },
  ],
  calculate: (input) => {
    const result = validateIpAddress(input.ipAddress);
    if (result !== null) return result;
    return simpleError(
      "ipAddress",
      "Enter a valid IPv4 or IPv6 address.",
      "invalid_ip_address",
    );
  },
});

export const runIpAddressValidation = ipAddressTool.execute;
export default ipAddressTool;

export const ipAddressExample = {
  input: { ipAddress: "2001:db8::1" },
  output: {
    isPublic: false,
    normalized: "2001:db8::1",
    scope: "documentation",
    version: "IPv6",
  },
} satisfies ToolExample<IpAddressValidationInput, IpAddressValidationOutput>;
