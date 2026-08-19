import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Ipv6Groups = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

const IPV6_GROUP = /^[0-9a-f]{1,4}$/u;
const IPV4_TAIL = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/u;

/** Formats eight 16-bit groups as the full lowercase zero-padded form. */
export const formatIpv6Full = (groups: readonly number[]): string =>
  groups.map((group) => group.toString(16).padStart(4, "0")).join(":");

const expandSegmentWithIpv4Tail = (
  segments: string[],
  field: string,
): string[] => {
  const last = segments.at(-1);
  if (last === undefined || !last.includes(".")) return segments;
  const match = IPV4_TAIL.exec(last);
  if (!match)
    simpleError(field, "Invalid embedded IPv4 address.", "invalid_ipv6");
  const octets = match!.slice(1).map((part) => Number(part));
  if (octets.some((octet) => octet > 255))
    simpleError(field, "Invalid embedded IPv4 address.", "invalid_ipv6");
  return [
    ...segments.slice(0, -1),
    ((octets[0]! << 8) | octets[1]!).toString(16),
    ((octets[2]! << 8) | octets[3]!).toString(16),
  ];
};

const parseGroupList = (segments: readonly string[], field: string): number[] =>
  segments.map((segment) => {
    if (!IPV6_GROUP.test(segment))
      simpleError(field, "Invalid IPv6 address.", "invalid_ipv6");
    return Number.parseInt(segment, 16);
  });

/** Parses an RFC 4291 IPv6 address into eight 16-bit groups. */
export const parseIpv6 = (value: string, field = "address"): Ipv6Groups => {
  const text = value.trim().toLowerCase();
  if (text.includes("%"))
    simpleError(field, "Zone identifiers are not supported.", "invalid_ipv6");
  const pieces = text.split("::");
  if (pieces.length > 2)
    simpleError(
      field,
      "An address may contain at most one :: sequence.",
      "invalid_ipv6",
    );
  if (pieces.length === 1) {
    const groups = parseGroupList(
      expandSegmentWithIpv4Tail(text.split(":"), field),
      field,
    );
    if (groups.length !== 8)
      simpleError(field, "Invalid IPv6 address.", "invalid_ipv6");
    return groups as Ipv6Groups;
  }
  const head =
    pieces[0] === ""
      ? []
      : expandSegmentWithIpv4Tail(pieces[0].split(":"), field);
  const tail =
    pieces[1] === ""
      ? []
      : expandSegmentWithIpv4Tail(pieces[1].split(":"), field);
  const known = head.length + tail.length;
  if (known >= 8) simpleError(field, "Invalid IPv6 address.", "invalid_ipv6");
  const middle = new Array<number>(8 - known).fill(0);
  const groups = [
    ...parseGroupList(head, field),
    ...middle,
    ...parseGroupList(tail, field),
  ] as Ipv6Groups;
  return groups;
};

export const ipv6ExpandExample = {
  input: { address: "2001:db8::1" },
  output: { address: "2001:0db8:0000:0000:0000:0000:0000:0001" },
} satisfies ToolExample<
  { readonly address: string },
  { readonly address: string }
>;

export const calculateIpv6Expand = (
  input: Readonly<Record<string, unknown>>,
): Readonly<Record<string, unknown>> => ({
  address: formatIpv6Full(parseIpv6(input.address as string)),
});

export const ipv6ExpandTool = createSimpleTool({
  calculate: calculateIpv6Expand,
  description:
    "Expand an IPv6 address into its full eight-group lowercase form.",
  id: "network/ipv6-expand",
  inputs: [
    {
      description:
        "IPv6 address in RFC 4291 notation, optionally with an embedded IPv4 tail.",
      id: "address",
      kind: "string",
      label: "IPv6 address",
    },
  ],
  outputs: [
    {
      description: "Thirty-nine character expanded address.",
      id: "address",
      kind: "string",
      label: "Expanded address",
    },
  ],
  title: "IPv6 Address Expander",
});
export const runIpv6Expand = ipv6ExpandTool.execute;
export default ipv6ExpandTool;
