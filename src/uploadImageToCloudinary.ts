export async function uploadToCloudinary(uri: string) {
  const data = new FormData();

  data.append("file", {
    uri,
    type: "image/jpeg",
    name: "profile.jpg",
  } as any);

  data.append("upload_preset", "profile_uploads");
  data.append("folder", "users");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/da8yjlzsn/image/upload",
    {
      method: "POST",
      body: data,
    }
  );

  const json = await res.json();

  if (!json.secure_url) {
    throw new Error("Cloudinary upload failed");
  }

  return json.secure_url as string;
}
