const SI = "https://www.bipm.org/en/publications/si-brochure";
const IEC = "https://www.iec.ch/prefixes-binary-multiples";

// Base: one bit. Lowercase b means bit; uppercase B means byte.
export const measureFactors = {
  b: { name: "Bit", factor: 1, cite: SI },
  kb: { name: "Kilobit", factor: 1e3, cite: SI },
  Mb: { name: "Megabit", factor: 1e6, cite: SI },
  Gb: { name: "Gigabit", factor: 1e9, cite: SI },
  Tb: { name: "Terabit", factor: 1e12, cite: SI },
  Pb: { name: "Petabit", factor: 1e15, cite: SI },
  Eb: { name: "Exabit", factor: 1e18, cite: SI },
  B: { name: "Byte", factor: 8, cite: SI },
  kB: { name: "Kilobyte", factor: 8e3, cite: SI },
  MB: { name: "Megabyte", factor: 8e6, cite: SI },
  GB: { name: "Gigabyte", factor: 8e9, cite: SI },
  TB: { name: "Terabyte", factor: 8e12, cite: SI },
  PB: { name: "Petabyte", factor: 8e15, cite: SI },
  EB: { name: "Exabyte", factor: 8e18, cite: SI },
  Kib: { name: "Kibibit", factor: 1024, cite: IEC },
  Mib: { name: "Mebibit", factor: 1024 ** 2, cite: IEC },
  Gib: { name: "Gibibit", factor: 1024 ** 3, cite: IEC },
  Tib: { name: "Tebibit", factor: 1024 ** 4, cite: IEC },
  Pib: { name: "Pebibit", factor: 1024 ** 5, cite: IEC },
  Eib: { name: "Exbibit", factor: 1024 ** 6, cite: IEC },
  KiB: { name: "Kibibyte", factor: 8 * 1024, cite: IEC },
  MiB: { name: "Mebibyte", factor: 8 * 1024 ** 2, cite: IEC },
  GiB: { name: "Gibibyte", factor: 8 * 1024 ** 3, cite: IEC },
  TiB: { name: "Tebibyte", factor: 8 * 1024 ** 4, cite: IEC },
  PiB: { name: "Pebibyte", factor: 8 * 1024 ** 5, cite: IEC },
  EiB: { name: "Exbibyte", factor: 8 * 1024 ** 6, cite: IEC },
};
