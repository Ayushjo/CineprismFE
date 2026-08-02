import PostImageUploader from "@/components/admin/PostImageUploader";

export default function UploadGalleryPage() {
  return (
    <PostImageUploader
      title="Upload Gallery"
      description="Add multiple gallery stills to a review."
      endpoint="/admin/upload-images"
      fileField="files"
      multiple
    />
  );
}
