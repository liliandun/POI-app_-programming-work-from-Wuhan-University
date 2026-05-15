import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// POST /api/upload - 上传文件
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const files = formData.getAll("files") as File[];

  if (files.length === 0) {
    return Response.json({ error: "未选择文件" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const urls: string[] = [];

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 生成唯一文件名
    const ext = path.extname(file.name);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);
    urls.push(`/uploads/${filename}`);
  }

  // TODO: 后续替换为云存储上传
  // const urls = await uploadToCloudStorage(files);

  return Response.json({
    data: { urls },
    message: `成功上传 ${urls.length} 个文件`,
  });
}
