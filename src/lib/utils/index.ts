import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, fmt = "dd MMMM yyyy") {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, fmt, { locale: id });
}

export function formatDateShort(date: string | Date) {
  return formatDate(date, "dd MMM yyyy");
}

export function formatDateTime(date: string | Date) {
  return formatDate(date, "dd MMM yyyy, HH:mm");
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export const KATEGORI_OPTIONS = [
  { value: "kedisiplinan", label: "Kedisiplinan", color: "blue" },
  { value: "ibadah", label: "Ibadah", color: "green" },
  { value: "kebersihan", label: "Kebersihan", color: "cyan" },
  { value: "akademik", label: "Akademik", color: "purple" },
  { value: "karakter", label: "Karakter", color: "orange" },
  { value: "pelanggaran", label: "Pelanggaran", color: "red" },
  { value: "prestasi", label: "Prestasi", color: "yellow" },
] as const;

export const KATEGORI_COLOR_MAP: Record<string, string> = {
  kedisiplinan: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  ibadah: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  kebersihan: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  akademik: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  karakter: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  pelanggaran: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  prestasi: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function paginate<T>(array: T[], page: number, perPage: number) {
  const start = (page - 1) * perPage;
  return {
    data: array.slice(start, start + perPage),
    total: array.length,
    page,
    perPage,
    totalPages: Math.ceil(array.length / perPage),
  };
}
