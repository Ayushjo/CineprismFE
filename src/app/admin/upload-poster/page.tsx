import PostImageUploader from "@/components/admin/PostImageUploader";

export default function UploadPosterPage() {
  return (
    <PostImageUploader
      title="Upload Poster"
      description="Set the main (vertical) poster for a review."
      endpoint="/admin/add-poster"
      fileField="file"
    />
  );
}
