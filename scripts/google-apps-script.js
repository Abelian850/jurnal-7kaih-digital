/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║         GOOGLE APPS SCRIPT — JURNAL 7KAIH DIGITAL       ║
 * ║         Upload Foto ke Google Drive                      ║
 * ║         Author: Abyass Walker (AW)                       ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * CARA DEPLOY:
 * 1. Buka https://script.google.com
 * 2. Buat project baru
 * 3. Paste script ini
 * 4. Ganti FOLDER_ID dan SECRET_TOKEN
 * 5. Klik Deploy > New Deployment
 * 6. Pilih type: Web App
 * 7. Execute as: Me
 * 8. Who has access: Anyone
 * 9. Klik Deploy, copy URL
 * 10. Masukkan URL ke .env.local sebagai NEXT_PUBLIC_GAS_URL
 */

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const FOLDER_ID = "YOUR_GOOGLE_DRIVE_FOLDER_ID"; // Ganti dengan Folder ID kamu
const SECRET_TOKEN = "YOUR_SECRET_TOKEN_HERE";    // Buat token acak yang kuat

// ─── CARA MENDAPATKAN FOLDER ID ───────────────────────────────────────────────
// 1. Buka Google Drive
// 2. Buat folder baru (misal: "Jurnal 7KAIH Foto")
// 3. Buka folder tersebut
// 4. Copy ID dari URL: https://drive.google.com/drive/folders/[FOLDER_ID_DI_SINI]

// ─── HANDLE POST (upload file) ────────────────────────────────────────────────
function doPost(e) {
  try {
    // Validasi token
    const token = e.parameter.token;
    if (token !== SECRET_TOKEN) {
      return jsonResponse({ success: false, error: "Invalid token" }, 403);
    }

    // Validasi ada file
    if (!e.files || !e.files.foto) {
      return jsonResponse({ success: false, error: "No file provided" }, 400);
    }

    const file = e.files.foto;
    const mimeType = file.mimeType || "image/webp";

    // Validasi tipe file (image only)
    if (!mimeType.startsWith("image/")) {
      return jsonResponse({ success: false, error: "Only image files allowed" }, 400);
    }

    // Validasi ukuran file (max 500KB = 512000 bytes)
    const fileSize = file.bytes.length;
    if (fileSize > 512000) {
      return jsonResponse({ success: false, error: "File too large. Max 500KB" }, 400);
    }

    // Generate nama file unik
    const timestamp = new Date().getTime();
    const ext = mimeType === "image/webp" ? ".webp" : mimeType === "image/jpeg" ? ".jpg" : ".png";
    const filename = `foto_${timestamp}${ext}`;

    // Simpan ke Google Drive
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const blob = Utilities.newBlob(file.bytes, mimeType, filename);
    const driveFile = folder.createFile(blob);

    // Set file jadi publicly viewable
    driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    // Generate URL untuk embed/view
    const fileId = driveFile.getId();
    const viewUrl = `https://drive.google.com/file/d/${fileId}/view`;
    const directUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
    const thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1080`;

    return jsonResponse({
      success: true,
      fileId: fileId,
      url: thumbnailUrl,        // Gunakan ini untuk tampil di web
      viewUrl: viewUrl,
      directUrl: directUrl,
      filename: filename,
      size: fileSize,
    });

  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() }, 500);
  }
}

// ─── HANDLE GET (health check) ────────────────────────────────────────────────
function doGet(e) {
  const token = e.parameter.token;
  if (token !== SECRET_TOKEN) {
    return jsonResponse({ success: false, error: "Invalid token" }, 403);
  }
  return jsonResponse({
    success: true,
    message: "Jurnal 7KAIH Upload Service Active",
    author: "Abyass Walker (AW)",
    timestamp: new Date().toISOString(),
  });
}

// ─── HELPER: JSON Response ────────────────────────────────────────────────────
function jsonResponse(data, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
