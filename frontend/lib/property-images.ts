import { api } from "@/lib/api";

export async function uploadPropertyImages(propertyId: number, files: File[], caption?: string, makeFirstCover = false) {
  for (const [index, file] of files.entries()) {
    const data = new FormData();
    data.append("file", file);
    data.append("caption", caption || file.name);
    data.append("sort_order", String(index));
    data.append("is_cover", String(makeFirstCover && index === 0));
    await api.post(`/properties/${propertyId}/images`, data);
  }
}
