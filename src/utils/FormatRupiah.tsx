export function formatRupiah(angka: number): string {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0, // Mengubah default 2 menjadi 0
    maximumFractionDigits: 0,
  });
  return formatter.format(angka);
}
