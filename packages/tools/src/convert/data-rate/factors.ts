const SI = "https://www.bipm.org/en/publications/si-brochure";
const IEC = "https://www.iec.ch/prefixes-binary-multiples";

// Base: one bit per second. Lowercase b means bit; uppercase B means byte.
export const measureFactors = {
  "b/s": { name: "Bit per second", factor: 1, cite: SI },
  "kb/s": { name: "Kilobit per second", factor: 1e3, cite: SI },
  "Mb/s": { name: "Megabit per second", factor: 1e6, cite: SI },
  "Gb/s": { name: "Gigabit per second", factor: 1e9, cite: SI },
  "Tb/s": {
    name: "Terabit per second",
    factor: 1e12,
    cite: SI,
  },
  "Pb/s": {
    name: "Petabit per second",
    factor: 1e15,
    cite: SI,
  },
  "B/s": { name: "Byte per second", factor: 8, cite: SI },
  "kB/s": {
    name: "Kilobyte per second",
    factor: 8e3,
    cite: SI,
  },
  "MB/s": {
    name: "Megabyte per second",
    factor: 8e6,
    cite: SI,
  },
  "GB/s": {
    name: "Gigabyte per second",
    factor: 8e9,
    cite: SI,
  },
  "TB/s": {
    name: "Terabyte per second",
    factor: 8e12,
    cite: SI,
  },
  "Kib/s": {
    name: "Kibibit per second",
    factor: 1024,
    cite: IEC,
  },
  "Mib/s": {
    name: "Mebibit per second",
    factor: 1024 ** 2,
    cite: IEC,
  },
  "Gib/s": {
    name: "Gibibit per second",
    factor: 1024 ** 3,
    cite: IEC,
  },
  "Tib/s": {
    name: "Tebibit per second",
    factor: 1024 ** 4,
    cite: IEC,
  },
  "KiB/s": {
    name: "Kibibyte per second",
    factor: 8 * 1024,
    cite: IEC,
  },
  "MiB/s": {
    name: "Mebibyte per second",
    factor: 8 * 1024 ** 2,
    cite: IEC,
  },
  "GiB/s": {
    name: "Gibibyte per second",
    factor: 8 * 1024 ** 3,
    cite: IEC,
  },
  "TiB/s": {
    name: "Tebibyte per second",
    factor: 8 * 1024 ** 4,
    cite: IEC,
  },
};
